'use strict';
const { getId, getApiKey } = require('../lib/encryption');
const dynamodb = require('../lib/dynamo');
const util = require('../lib/util');
const DYNAMO_TABLE = process.env.DYNAMO_TABLE;

/**
 * PersonSession CRUD Abstraction
 * @Author: Alexsandro Carvalho de Freitas
 *
 * @create() - Register PersonSession on DynamoDB
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
		const SESSION_ID = data.session_id;
		const PERSON_SESSION_ID = getId();
		const PERSON_IDENTIFIER_KEY = data.person_identifier_key;
		const PERSON_IDENTIFIER_VALUE = data.person_identifier_value;

		let params = {
			TableName: DYNAMO_TABLE,
			Item: {
				PK: `ORG#${ORG_ID}#PERS#${PERSON_ID}`,
				SK: `ORG#${ORG_ID}#SESS#${SESSION_ID}`,
				org_id: ORG_ID,
				person_id: PERSON_ID,
				person_session_id: PERSON_SESSION_ID,
				person_identifier_key: PERSON_IDENTIFIER_KEY,
				person_identifier_value: PERSON_IDENTIFIER_VALUE,
				spvll: data.spvll,
				data_key: `ORG#${ORG_ID}#SPVLL#${data.spvll}`,
				created_at: util.getDateFormated(),
				updated_at: util.getDateFormated(),
			},
		};
		const persSessData = await dynamodb.save(params);
		return persSessData.Item ? { ...persSessData.Item } : {};
	} catch (error) {
		throw new Error('PersonSession not recorded try again');
	}
};

const update = async (event) => {
	try {
		const data = event.body ? event.body : event;

		/**@TODO Validate Informations.*/
		const PK = data.PK;
		const SK = data.SK;

		let params = {
			TableName: DYNAMO_TABLE,
			Key: { PK, SK },
			UpdateExpression: 'set #spvll = :spvll, updated_at = :updated_at',
			ExpressionAttributeNames: { '#spvll': 'spvll' },
			ExpressionAttributeValues: {
				':spvll': data.spvll,
				':updated_at': util.getDateFormated(),
			},
		};
		return await dynamodb.update(params);
	} catch (error) {
		throw new Error('PersonSession not updated try again');
	}
};

const findPersonSessionBySPVLL = async (event) => {
	try {
		const data = event.body ? event.body : event;

		/**@TODO Validate Informations.*/
		const ORG_ID = data.org_id;
		const SPVLL = data.spvll;

		let params = {
			TableName: DYNAMO_TABLE,
			IndexName: 'data_key-filter',
			KeyConditionExpression: '#data_key = :data_key',
			ExpressionAttributeNames: { '#data_key': 'data_key' },
			ExpressionAttributeValues: {
				':data_key': `ORG#${ORG_ID}#SPVLL#${SPVLL}`,
			},
		};

		const personSessionData = await dynamodb.list(params);
		return personSessionData.Items ? { ...personSessionData.Items[0] } : {};
	} catch (error) {
		throw new Error('PersonSession not founded try again');
	}
};

module.exports = {
	create,
	update,
	findPersonSessionBySPVLL,
	// get,
	// find,

	// listAssetsById,
	// listIdentifiersById,
	// listPersonsById
};
