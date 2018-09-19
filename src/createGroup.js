const fs = require('fs');

const {
  createGroup,
  createCoreDefinition,
  createDeviceDefinition,
  createInitialGroupVersion
} = require('./services/greengrass');

const {
  createThing,
  createKeysCert,
  attachThingPrincipal,
  createPolicy,
  attachPrincipalPolicy
} = require('./services/iot');

/**
 * Sets up greengrass group with thing/core, group, certificate, policy, and version
 * @param {service} iot - instance of aws.iot()
 * @param {service} greengrass - instance of aws.greengrass()
 * @param {string} groupName
 * @param {string} thingName - core/thing name
 */
const createGreengrassGroup = async (iot, greengrass, groupName, thingName) => {
  try {
    console.log('Creating greengrass group');
    let groupInfo = {};
    //Create Group
    let group = await createGroup(greengrass, groupName);
    let groupId = group.Id;

    groupInfo.group = group;

    //Create Thing
    let thing = await createThing(iot, thingName);
    let thingArn = thing.thingArn;
    let thingId = thing.thingId;

    groupInfo.thing = thing;

    //Create Cert
    let cert = await createKeysCert(iot, true);
    let certArn = cert.certificateArn;

    groupInfo.cert = cert;

    //Attach Thing Principal
    let attachedPrincipal = await attachThingPrincipal(iot, certArn, thingName);

    //Create policy
    let policy = await createPolicy(iot);
    let policyName = policy.policyName;

    groupInfo.policy = policy;

    //Attach policy to certificate
    let attachPolicy = await attachPrincipalPolicy(iot, policyName, certArn);

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
    let coreDefinition = await createCoreDefinition(
      greengrass,
      groupName,
      initialVersion
    );
    let coreArn = coreDefinition.LatestVersionArn;

    groupInfo.coreDefinition = coreDefinition;

    // create group version
    let groupVersion = await createInitialGroupVersion(
      greengrass,
      groupId,
      coreArn
    );

    groupInfo.groupVersion = groupVersion;

    //save group information
    fs.writeFileSync('groupInfo.json', JSON.stringify(groupInfo));

    console.log('Successfully set up Greengrass Group!');
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  createGroup,
  createThing,
  createKeysCert,
  createCoreDefinition,
  createDeviceDefinition,
  attachThingPrincipal,
  createPolicy,
  attachPrincipalPolicy,
  createGreengrassGroup,
  createInitialGroupVersion
};
