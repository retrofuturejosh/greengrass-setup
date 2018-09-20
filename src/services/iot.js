class IoTService {
  constructor(iot) {
    this.iot = iot;
  }

  /**
   * creates an iot thing
   * @param {string} thingName - name of thing to be created
   * @param {object}  attributes - (optional) object of attributes for thing. e.g. { watts: '100', lumens: '1100' }
   */
  createThing(thingName, attributes) {
    return createThing(this.iot, thingName, attributes);
  }

  /**
   * creates iot keys and certificate
   * @param {boolean} active - setAsActive prop
   */
  createKeysCert(active) {
    return createKeysCert(this.iot, active);
  }

  /**
   * Attaches certificate to thing
   * @param {string} principal - certificate arn
   * @param {string} thingName - name of thing
   */
  attachThingPrincipal(principal, thingName) {
    return attachThingPrincipal(this.iot, principal, thingName);
  }

  /**
   * Creates necessary iot policy
   * @param {string} policyName - optional: name of policy
   * @param {string} policyDoc - optional: JSON policy document
   */
  createPolicy(iot, policyName, policyDoc) {
    return createPolicy(this.iot, policyName, policyDoc);
  }

  /**
   *
   * @param {service} iot - instance of aws.iot()
   * @param {string} policyName - name of IAM policy
   * @param {strint} principal - arn of principal cert
   */
  attachPrincipalPolicy(policyName, principal) {
    return attachPrincipalPolicy(this.iot, policyName, principal);
  }
}

/**
 * creates an iot thing
 * @param {service} iot - instance of aws.iot()
 * @param {string} thingName - name of thing to be created
 * @param {object} attributes - (optional) object of attributes for thing. e.g. { watts: '100', lumens: '1100' }
 */
function createThing(iot, thingName, attributes) {
  let thingParams = {
    thingName
  };

  if (attributes) {
    thingParams.attributePayload = { attributes };
  }

  return iot
    .createThing(thingParams)
    .promise()
    .then(res => {
      console.log('Successfully created thing:', JSON.stringify(res));
      return res;
    })
    .catch(err => {
      console.log(err);
    });
}

/**
 * creates iot keys and certificate
 * @param {service} iot = instance of aws.iot()
 * @param {boolean} active - setAsActive prop
 */
function createKeysCert(iot, active) {
  const params = {
    setAsActive: active
  };
  return iot
    .createKeysAndCertificate(params)
    .promise()
    .then(res => {
      console.log('Successfully created keys:', JSON.stringify(res));
      return res;
    })
    .catch(err => {
      console.log(err);
    });
}

/**
 * Attaches certificate to thing
 * @param {service} iot - instance of aws.iot()
 * @param {string} principal - certificate arn
 * @param {string} thingName - name of thing
 */
function attachThingPrincipal(iot, principal, thingName) {
  const params = {
    principal,
    thingName
  };
  return iot
    .attachThingPrincipal(params)
    .promise()
    .then(res => {
      console.log('Successfully attached Thing Principal:', res);
      return res;
    })
    .catch(err => {
      console.log(err);
    });
}

/**
 * Creates necessary iot policy
 * @param {service} iot - instance of aws.iot()
 * @param {string} policyName - optional: name of policy
 * @param {string} policyDoc - optional: JSON policy document
 */
function createPolicy(iot, policyName, policyDoc) {
  let policy = {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Action: [
          'iot:Publish',
          'iot:Subscribe',
          'iot:Connect',
          'iot:Receive',
          'iot:GetThingShadow',
          'iot:DeleteThingShadow',
          'iot:UpdateThingShadow',
          'greengrass:AssumeRoleForGroup',
          'greengrass:CreateCertificate',
          'greengrass:GetConnectivityInfo',
          'greengrass:GetDeployment',
          'greengrass:GetDeploymentArtifacts',
          'greengrass:UpdateConnectivityInfo',
          'greengrass:UpdateCoreDeploymentStatus'
        ],
        Resource: ['*']
      }
    ]
  };
  let params = {
    policyDocument: JSON.stringify(policy) /* required */,
    policyName: 'greengrassPolicy' /* required */
  };

  if (policyDoc) params.policyDocument = policyDoc;
  if (policyName) params.policyName = policyName;

  return iot
    .createPolicy(params)
    .promise()
    .then(res => {
      console.log('Successfully Created Policy:', res);
      return res;
    })
    .catch(err => {
      console.log(err);
    });
}

/**
 *
 * @param {service} iot - instance of aws.iot()
 * @param {string} policyName - name of IAM policy
 * @param {strint} principal - arn of principal cert
 */
function attachPrincipalPolicy(iot, policyName, principal) {
  const params = {
    policyName,
    principal
  };
  return iot
    .attachPrincipalPolicy(params)
    .promise()
    .then(res => {
      console.log('Successfully Attached principal policy:', res);
      return res;
    })
    .catch(err => {
      console.log(err);
    });
}

module.exports = {
  createThing,
  createKeysCert,
  attachThingPrincipal,
  createPolicy,
  attachPrincipalPolicy,
  IoTService
};
