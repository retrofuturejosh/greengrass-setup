const AWS = require(`aws-sdk`);
const fs = require('fs');
const { expect } = require('chai');
const { stub, spy } = require('sinon');

const greengrass = new AWS.Greengrass({
  apiVersion: '2017-06-07',
  region: 'us-east-1'
});
const iot = new AWS.Iot({ apiVersion: '2015-05-28', region: 'us-east-1' });

const expectedResults = require('../expectedResults');
const { createGreengrassGroup } = require('../../src/greengrassSetUp');

describe('Greengrass set up', () => {
  let createThingStub;
  let createKeysStub;
  let attachPrincipalStub;
  let createPolicyStub;
  let attachPrincPolStub;
  let createGroupStub;
  let createCoreDefStub;
  let groupVersionStub;

  before(async () => {
    //create stubs
    createThingStub = stub(iot, 'createThing');
    createThingStub.returns({
      promise: () => {
        return Promise.resolve(expectedResults.createThing);
      }
    });

    createKeysStub = stub(iot, 'createKeysAndCertificate');
    createKeysStub.returns({
      promise: () => {
        return Promise.resolve(expectedResults.createKeysCerts);
      }
    });

    attachPrincipalStub = stub(iot, 'attachThingPrincipal');
    attachPrincipalStub.returns({
      promise: () => {
        return Promise.resolve('success');
      }
    });

    createPolicyStub = stub(iot, 'createPolicy');
    createPolicyStub.returns({
      promise: () => {
        return Promise.resolve(expectedResults.createPolicy);
      }
    });

    attachPrincPolStub = stub(iot, 'attachPrincipalPolicy');
    attachPrincPolStub.returns({
      promise: () => {
        return Promise.resolve('success');
      }
    });

    createGroupStub = stub(greengrass, 'createGroup');
    createGroupStub.returns({
      promise: () => {
        return Promise.resolve(expectedResults.createGroup);
      }
    });

    createCoreDefStub = stub(greengrass, 'createCoreDefinition');
    createCoreDefStub.returns({
      promise: () => {
        return Promise.resolve(expectedResults.createCoreDefinition);
      }
    });

    groupVersionStub = stub(greengrass, 'createGroupVersion');
    groupVersionStub.returns({
      promise: () => {
        return Promise.resolve(expectedResults.createGGVersion);
      }
    });

    let result = await createGreengrassGroup(
      iot,
      greengrass,
      'testGroup',
      'testThing'
    );
  });
  it('Calls all the necessary APIs', () => {
    let stubs = [
      createThingStub,
      createKeysStub,
      attachPrincipalStub,
      createPolicyStub,
      attachPrincPolStub,
      createGroupStub,
      createCoreDefStub,
      groupVersionStub
    ];
    stubs.forEach(stub => {
      return checkStub(stub);
    });
  });
  it('Writes the file groupInfo.json', () => {
    let groupInfo = JSON.parse(fs.readFileSync('groupInfo.json').toString('utf-8'));
    expect(groupInfo).to.deep.equal(expectedResults.groupInfo)
    fs.unlink('groupInfo.json', function(err) {
      if (err) return console.log(err);
      console.log('groupInfo.json deleted successfully');
    });
  });
});

function checkStub(stub) {
  return expect(stub.calledOnce).to.equal(true);
}
