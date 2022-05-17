import React from 'react';
import * as msTeams from '@microsoft/teams-js';

export default function Configure() {

	msTeams.initialize();

	msTeams.settings.registerOnSaveHandler(saveEvent => {
		msTeams.settings.setSettings({
			contentUrl: window.location.origin,
			entityId: window.location.origin
		});

	saveEvent.notifySuccess();
  });
  msTeams.settings.setValidityState(true);

  return (
	<div>
		<h1>Green Africa Teams Application</h1>
		<p>No settings available, click the <strong>Save</strong> button to continue</p>
	</div>
  );
}