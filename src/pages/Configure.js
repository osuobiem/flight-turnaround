import React from 'react';
import * as msTeams from '@microsoft/teams-js';

export default function Configure() {

	msTeams.initialize();

	msTeams.settings.registerOnSaveHandler(saveEvent => {
		msTeams.settings.setSettings({
			contentUrl: 'https://lively-sand-02bc7bd10.1.azurestaticapps.net',//window.location.origin,
			entityId: "Test",
			websiteUrl: 'https://lively-sand-02bc7bd10.1.azurestaticapps.net/configure'
		});

	saveEvent.notifySuccess();
  });
  msTeams.settings.setValidityState(true);

  return (
	<h1>Configure</h1>
  );
}