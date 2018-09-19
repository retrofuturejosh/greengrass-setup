const { createGreengrassGroup } = require('./greengrassSetUp');

const params = require('./params');

createGreengrassGroup(params.groupName, params.coreName);
