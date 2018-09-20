const fs = require('fs');

const { GreengrassService } = require('./services/greengrass');
const { IoTService } = require('./services/iot');
const { GreengrassConfigBuilder } = require('./services/ggConfig');

/**
 * Sets up greengrass group with thing/core, group, certificate, policy, and version
 * @param {service} iot - instance of aws.iot()
 * @param {service} greengrass - instance of aws.greengrass()
 * @param {string} groupName - name of group
 * @param {string} thingName - core/thing name
 */
const createGreengrassGroup = async (
  iot,
  greengrass,
  groupName,
  thingName,
  config
) => {
  try {
    console.log('Creating greengrass group');

    //start services
    const greengrassService = new GreengrassService(greengrass);
    const iotService = new IoTService(iot);
    //configBuilder creates the config.json file for greengrass
    let configBuilder = new GreengrassConfigBuilder();
    //groupInfo will save all metadata locally and write it to a file groupInfo.json
    let groupInfo = {};

    //GROUP
    //Create Group
    let group = await greengrassService.createGroup(groupName);
    let groupId = group.Id;
    //add group to groupInfo
    groupInfo.group = group;

    //THING
    //Create Thing
    let thing = await iotService.createThing(thingName);
    let thingArn = thing.thingArn;
    let thingId = thing.thingId;
    //add thingArn to config
    configBuilder.addThingArn(thingArn);
    //add thing to groupInfo
    groupInfo.thing = thing;

    //CERTS
    //Create Cert
    let cert = await iotService.createKeysCert(true);
    let certArn = cert.certificateArn;
    let certPem = cert.certificatePem;
    let keyPem = cert.keyPair.PrivateKey;
    //Add certs to `/cert` folder
    fs.writeFileSync(__dirname + '/../certs/cloud-pem-crt', certPem);
    fs.writeFileSync(__dirname + '/../certs/cloud-pem-key', keyPem);
    groupInfo.cert = cert;

    //ATTACH CERT TO THING
    //Attach Thing Principal
    let attachedPrincipal = await iotService.attachThingPrincipal(
      certArn,
      thingName
    );

    //POLICY
    //Create policy
    let policy = await iotService.createPolicy();
    let policyName = policy.policyName;
    groupInfo.policy = policy;
    //Attach policy to certificate
    let attachPolicy = await iotService.attachPrincipalPolicy(
      policyName,
      certArn
    );

    //CORE
    //set parameters for initial version of core
    let initialVersion = {
      Cores: [
        {
          Id: thingId,
          CertificateArn: certArn,
          SyncShadow: true,
          ThingArn: thingArn
        }
      ]
    };
    //create core definition
    let coreDefinition = await greengrassService.createCoreDefinition(
      groupName,
      initialVersion
    );
    let coreArn = coreDefinition.LatestVersionArn;

    groupInfo.coreDefinition = coreDefinition;

    //GROUP VERSION
    // create group version
    let groupVersion = await greengrassService.createInitialGroupVersion(
      groupId,
      coreArn
    );
    groupInfo.groupVersion = groupVersion;

    //save group information and config.json
    fs.writeFileSync('groupInfo.json', JSON.stringify(groupInfo));
    fs.writeFileSync('config.json', JSON.stringify(configBuilder.getConfig()));

    //all done
    console.log('Successfully set up Greengrass Group!');
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  createGreengrassGroup
};
