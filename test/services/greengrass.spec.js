const AWS = require(`aws-sdk`);
const { expect } = require('chai');
const { stub, spy } = require('sinon');

const greengrass = new AWS.Greengrass({
  apiVersion: '2017-06-07',
  region: 'us-east-1'
});

const {
  createGroup,
  createCoreDefinition,
  createInitialGroupVersion
} = require('../../src/greengrassSetUp');
const expectedResults = require('../expectedResults');

describe('IoT/Greengrass functions', () => {
  describe('Create Group function', () => {
    let createGroupStub;
    let expectedRes = expectedResults.createGroup;
    before(() => {
      //create stub
      createGroupStub = stub(greengrass, 'createGroup');
      createGroupStub.returns({
        promise: () => {
          return Promise.resolve(expectedRes);
        }
      });
    });
    it('Calls the service with correct params and returns greengrass promise', async () => {
      let res = await createGroup(greengrass, 'testName');
      expect(res).to.deep.equal(expectedRes);
      expect(createGroupStub.args[0][0]).to.deep.equal({
        Name: 'testName'
      });
    });
  });
  describe('Create Core Definition', () => {
    let createCoreDefStub;
    let expectedRes = expectedResults.createCoreDefinition;
    before(() => {
      //stub service
      createCoreDefStub = stub(greengrass, 'createCoreDefinition');
      createCoreDefStub.returns({
        promise: () => {
          return Promise.resolve(expectedRes);
        }
      });
    });
    it('Calls the service with correct params and returns greengrass promise', async () => {
      let initialVersion = {
        Cores: [
          {
            CertificateArn: 'myCert',
            Id: 'myCoreId',
            SyncShadow: true,
            ThingArn: 'myThingArn'
          }
        ]
      };
      let res = await createCoreDefinition(
        greengrass,
        'myCoreDefName',
        initialVersion
      );
      let calledWith = {
        InitialVersion: {
          Cores: [
            {
              CertificateArn: 'myCert',
              Id: 'myCoreId',
              SyncShadow: true,
              ThingArn: 'myThingArn'
            }
          ]
        },
        Name: 'myCoreDefName'
      };
      expect(res).to.deep.equal(expectedRes);
      expect(createCoreDefStub.args[0][0]).to.deep.equal(calledWith);
    });
  });
  describe('Create Group Version func', () => {
    let groupVersionStub;
    let expectedRes = expectedResults.createGGVersion;
    before(() => {
      //stub service
      groupVersionStub = stub(greengrass, 'createGroupVersion');
      groupVersionStub.returns({
        promise: () => {
          return Promise.resolve(expectedRes);
        }
      });
    });
    it('Calls the service with correct params and returns greengrass promise', async () => {
      let res = await createInitialGroupVersion(greengrass, 'groupID', 'coreArn');
      let calledWith = {
        GroupId: 'groupID',
        CoreDefinitionVersionArn: 'coreArn'
      };
      expect(res).to.deep.equal(expectedRes);
      expect(groupVersionStub.args[0][0]).to.deep.equal(calledWith);
    });
  });
});
