'use strict';
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
		const PERSON_CONSENT_ID = getId();
		const PERSON_IDENTIFIER_VALUE = data.person_identifier_value;

		let params = {
			TableName: DYNAMO_TABLE,
			Item: {
				PK: `ORG#${ORG_ID}#PERS#${PERSON_ID}`,
				SK: `ORG#${ORG_ID}#CONS#${CONSENT_ID}`,
				org_id: ORG_ID,
				person_id: PERSON_ID,
				person_consent_id: PERSON_CONSENT_ID,
				person_identifier_key: data.person_identifier_key,
				person_identifier_value: data.person_identifier_value,
				is_accept: data.is_accept,
				consent_data: data.consent_data,
				data_key: `ORG#${ORG_ID}#PERS#CONS#${PERSON_IDENTIFIER_VALUE}`,
				created_at: util.getDateFormated(),
				updated_at: util.getDateFormated(),
			},
		};
		const persConsData = await dynamodb.save(params);

		return {
			org_id: persConsData.Item.org_id,
			person_id: persConsData.Item.person_id,
			person_consent_id: persConsData.Item.person_consent_id,
		};
	} catch (error) {
		throw new Error('PersonConsent not recorded try again');
	}
};
const findPersonConsentByIdenValue = async (event) => {
	try {
		const data = event.body ? event.body : event;

		/**@TODO Validate Informations.*/
		const ORG_ID = data.org_id;
		const PERSON_IDENTIFIER_VALUE = data.person_identifier_value;

		let params = {
			TableName: DYNAMO_TABLE,
			IndexName: 'data_key-filter',
			KeyConditionExpression: '#data_key = :data_key',
			ExpressionAttributeNames: { '#data_key': 'data_key' },
			ExpressionAttributeValues: {
				':data_key': `ORG#${ORG_ID}#PERS#CONS#${PERSON_IDENTIFIER_VALUE}`,
			},
		};

		const personConsentData = await dynamodb.list(params);
		return { ...personConsentData.Items[0] };
	} catch (error) {
		throw new Error('PersonConsent not founded try again');
	}
};

const findPersonConsentBySPVLL = async (event) => {
	try {
		const data = event.body ? event.body : event;

		/**@TODO Validate Informations.*/
		const SPVLL = data.spvll;

		let params = {
			TableName: DYNAMO_TABLE,
			IndexName: 'spvll-filter',
			KeyConditionExpression: '#spvll = :spvll',
			ExpressionAttributeNames: { '#spvll': 'spvll' },
			ExpressionAttributeValues: {
				':spvll': `SPVLL#${SPVLL}`,
			},
		};

		const personConsentData = await dynamodb.list(params);
		return { ...personConsentData.Items[0] };
	} catch (error) {
		throw new Error('PersonConsent not founded try again');
	}
};

module.exports = {
	create,
	findPersonConsentByIdenValue,
	findPersonConsentBySPVLL,
	// get,
	// find,
	// update,
	// listAssetsById,
	// listIdentifiersById,
	// listPersonsById
};
