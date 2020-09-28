'use strict';
const { Consent, PersonSession, PersonConsent } = require('common').Service;

const response = require('common').Response;
/**
Register a Consent and Person-Consent on DynamoDB
This endpoint receibe a simple PUT Payload like this:
  {
    "spvll":"xxxxxxxxx",
    "consents": [  
     {
        "isAccepted": true,
        "consentTypeId": 1
     },
     {
        "isAccepted": false,
         "consentTypeId": 2
     },
   ]
  }
After receive a simple payload:
Register on DynamoDB Table
 */
module.exports.run = async (event, context, callback) => {
	try {
		const body = event.body ? event.body : event;
		const asset = JSON.parse(event.requestContext.authorizer.asset);
		const data = JSON.parse(body);
		// const asset = { org_id: '233455000989' }; //RemoveBeforeDeploy

		const { spvll, consents } = data;

		const consentsRecorded = [];

		const personSession = await PersonSession.findPersonSessionBySPVLL({
			org_id: asset.org_id,
			spvll,
		});

		if (Object.keys(personSession).length === 0) {
			return response.json(
				callback,
				{
					result: {
						code: 4001,
						message: `session not started, access /session/start to register your session`,
					},
				},
				400
			);
		}

		if (consents.length > 0) {
			for await (let consent of consents) {
				const { consentTypeId, isAccepted } = consent;
				// Save Consent
				const { consent_id } = await Consent.create({
					org_id: asset.org_id,
					person_id: personSession.person_id,
					consent_id: consentTypeId,
				});

				// Save Person-Consent
				const person_consent = await PersonConsent.create({
					org_id: asset.org_id,
					person_id: personSession.person_id,
					consent_id,
					spvll,
					consent_type_id: consentTypeId,
					is_accepted: isAccepted,
					person_identifier_key: personSession.person_identifier_key,
					person_identifier_value: personSession.person_identifier_value,
				});

				if (Object.keys(person_consent).length > 0) {
					const { consent_type_id, is_accepted, consent_at } = person_consent;
					consentsRecorded.push({
						consentTypeId: consent_type_id,
						isAccepted: is_accepted,
						consentAt: consent_at,
					});
				}
			}
		}

		return response.json(
			callback,
			{
				result: {
					code: 2001,
					message: 'consents successfully recorded',
					consents: consentsRecorded,
				},
			},
			200
		);
	} catch (error) {
		return response.json(
			callback,
			{
				result: {
					code: 5001,
					message: 'consent not recorded try again',
					error,
				},
			},
			500
		);
	}
};
