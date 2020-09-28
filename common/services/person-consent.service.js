'use strict';
const _ = require('lodash');
const { getId, getApiKey } = require('../lib/encryption');
const dynamodb = require('../lib/dynamo');
const util = require('../lib/util');

const DYNAMO_TABLE = process.env.DYNAMO_TABLE;

/**
 * PersonConsent CRUD Abstraction
 * @Author: Alexsandro Carvalho de Freitas
 *
 * @create() - Register PersonConsent on DynamoDB
 * @TODO @get() -
 * @TODO @find() -
 * @TODO @update() -
 * @TODO @listAssetsById() -
 * @TODO @listIdentifiersById() -
 * @TODO @listPersonsById() -
 */

const create = async (event) => {
	try {
		const data = event.body ? event.body : event;
		// const data = JSON.parse(body);
		/**@TODO Validate Informations.*/

		const ORG_ID = data.org_id;
		const PERSON_ID = data.person_id;
		const CONSENT_ID = data.consent_id;
		const SPVLL = data.spvll;

		let params = {
			TableName: DYNAMO_TABLE,
			Item: {
				PK: `ORG#${ORG_ID}#PERS#${PERSON_ID}`,
				SK: `ORG#${ORG_ID}#CONS#${CONSENT_ID}`,
				org_id: ORG_ID,
				person_id: PERSON_ID,
				is_accepted: data.is_accepted,
				consent_type_id: data.consent_type_id,
				spvll: SPVLL,
				data_key: `ORG#${ORG_ID}#PERSON#${PERSON_ID}`,
				consent_at: util.getDateFormated(),
				created_at: util.getDateFormated(),
				updated_at: util.getDateFormated(),
			},
		};
		const persConsData = await dynamodb.save(params);
		return persConsData ? { ...persConsData.Item } : {};
	} catch (error) {
		throw new Error('PersonConsent not recorded try again');
	}
};

const findPersonConsentByPersonId = async (event) => {
	try {
		const data = event.body ? event.body : event;

		/**@TODO Validate Informations.*/
		const ORG_ID = data.org_id;
		const PERSON_ID = data.person_id;

		let params = {
			TableName: DYNAMO_TABLE,
			IndexName: 'data_key-filter',
			KeyConditionExpression: '#data_key = :data_key',
			ExpressionAttributeNames: { '#data_key': 'data_key' },
			ExpressionAttributeValues: {
				':data_key': `ORG#${ORG_ID}#PERSON#${PERSON_ID}`,
			},
		};

		const personConsentData = await dynamodb.list(params);
		return personConsentData ? mapPersonConsents(personConsentData.Items) : [];
	} catch (error) {
		throw new Error('PersonConsent not founded try again');
	}
};

const mapPersonConsents = (personConsents) => {
	let consents = _.chain(personConsents)
		.map((consent) => {
			const { consent_type_id, is_accepted, consent_at } = consent;
			return {
				consentTypeId: consent_type_id,
				isAccepted: is_accepted,
				consentAt: consent_at,
			};
		})
		.orderBy('consentAt', 'desc')
		.groupBy('consentTypeId')
		.map((consent) => {
			return {
				consentTypeId: consent[0].consentTypeId,
				history: _.take(consent, 5),
			};
		})
		.value();

	return consents;
};

module.exports = {
	create,
	findPersonConsentByPersonId,
	// get,
	// find,
	// update,
	// listAssetsById,
	// listIdentifiersById,
	// listPersonsById
};
