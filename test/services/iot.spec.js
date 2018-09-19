const AWS = require(`aws-sdk`);
const { expect } = require('chai');
const { stub, spy } = require('sinon');

const iot = new AWS.Iot({ apiVersion: '2015-05-28', region: 'us-east-1' });

const {
  createThing,
  createKeysCert,
  attachThingPrincipal,
  createPolicy,
  attachPrincipalPolicy
} = require('../../src/createGroup');
const expectedResults = require('../expectedResults.js');

describe('IoT functions', () => {
  describe('Create Thing function', () => {
    let createThingStub;
    let expectedRes = expectedResults.createThing;
    before(() => {
      //create stub
      createThingStub = stub(iot, 'createThing');
      createThingStub.returns({
        promise: () => {
          return Promise.resolve(expectedRes);
        }
      });
    });
    it('Calls the service with correct params and returns IoT promise', async () => {
      let myAttribute = { myAttribute: 'yas', anotherAttribute: 'werk' };
      let res = await createThing(iot, 'MyTestThing');
      let res2 = await createThing(iot, 'MyTestThing', myAttribute);
      expect(createThingStub.args[0][0]).to.deep.equal({
        thingName: 'MyTestThing'
      });
      expect(createThingStub.args[1][0]).to.deep.equal({
        thingName: 'MyTestThing',
        attributePayload: { attributes: myAttribute }
      });
      expect(res).to.deep.equal(expectedRes);
      expect(res2).to.deep.equal(expectedRes);
    });
  });
  describe('Create Keys and Certs function', () => {
    let createKeysStub;
    let expectedRes = expectedResults.createKeysCerts;
    before(() => {
      //stub service
      //create stub
      createKeysStub = stub(iot, 'createKeysAndCertificate');
      createKeysStub.returns({
        promise: () => {
          return Promise.resolve(expectedRes);
        }
      });
    });
    it('Calls service with correct arg and creates keys/certificate', async () => {
      let res1 = await createKeysCert(iot, true);
      let res2 = await createKeysCert(iot, false);
      expect(res1).to.deep.equal(expectedRes);
      expect(res2).to.deep.equal(expectedRes);
      expect(createKeysStub.args[0][0]).to.deep.equal({ setAsActive: true });
      expect(createKeysStub.args[1][0]).to.deep.equal({ setAsActive: false });
    });
  });
  describe('Attach Thing Principal function', () => {
    let attachPrincipalStub;
    before(() => {
      //stub service
      attachPrincipalStub = stub(iot, 'attachThingPrincipal');
      attachPrincipalStub.returns({
        promise: () => {
          return Promise.resolve('success');
        }
      });
    });
    it('Calls the service with correct params and returns IoT promise', async () => {
      let res = await attachThingPrincipal(iot, 'certArn', 'testThing');
      let calledWith = {
        principal: 'certArn',
        thingName: 'testThing'
      };
      expect(attachPrincipalStub.args[0][0]).to.deep.equal(calledWith);
    });
  });
  describe('Create IoT Policy Function ', () => {
    let createPolicyStub;
    let expectedRes = expectedResults.createPolicy;
    before(() => {
      //stub service
      createPolicyStub = stub(iot, 'createPolicy');
      createPolicyStub.returns({
        promise: () => {
          return Promise.resolve(expectedRes);
        }
      });
    });
    it('Calls the service with correct params and returns IoT promise', async () => {
      let res = await createPolicy(iot);
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
      let calledWith = {
        policyDocument: JSON.stringify(policy) /* required */,
        policyName: 'greengrassPolicy' /* required */
      };
      expect(res).to.deep.equal(expectedRes);
      expect(createPolicyStub.args[0][0]).to.deep.equal(calledWith);
    });
  });
  describe('Attach Principal Policy function', () => {
    let attachPrincPolStub;
    before(() => {
      //stub service
      attachPrincPolStub = stub(iot, 'attachPrincipalPolicy');
      attachPrincPolStub.returns({
        promise: () => {
          return Promise.resolve('success');
        }
      });
    });
    it('Calls the service with correct params and returns IoT promise', async () => {
      let res = await attachPrincipalPolicy(iot, 'myPolicy', 'myPrincipal');
      expect(res).to.equal('success');
      expect(attachPrincPolStub.args[0][0]).to.deep.equal({
        policyName: 'myPolicy',
        principal: 'myPrincipal'
      });
    });
  });
});
