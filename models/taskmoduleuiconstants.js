// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { UISettings } = require('./uisettings');
const { TaskModuleIds } = require('./taskmoduleids');

const TaskModuleUIConstants = {
    UpdateTask: new UISettings(810, 700, 'Update Task', TaskModuleIds.UpdateTask, 'Update Task'),
    ViewActivity: new UISettings(810, 700, 'View Activity', TaskModuleIds.ViewActivity, 'View Activity'),
    // Notify: new UISettings(310, 300, 'Notify Team Members', TaskModuleIds.Notify, 'Notify')
};

module.exports.TaskModuleUIConstants = TaskModuleUIConstants;
