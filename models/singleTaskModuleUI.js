// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { UISettings } = require('./uisettings');
const { TaskModuleIds } = require('./taskmoduleids');

const SingleTaskModuleUI = {
    MarkDone: new UISettings(400, 400, 'Mark Task as done', TaskModuleIds.MarkDone, 'Mark Task as done'),
    SingleUpdate: new UISettings(800, 1200, 'Update Single Task', TaskModuleIds.SingleUpdate, 'Update task')
};

module.exports.SingleTaskModuleUI = SingleTaskModuleUI;
