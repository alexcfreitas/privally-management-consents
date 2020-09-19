'use strict';
const encryption = require('../../shared/lib/encryption');
const dynamo = require('../../shared/lib/dynamo');
const response = require('../../shared/lib/response');

const DYNAMO_TABLE_SESSION = process.env.DYNAMO_TABLE_SESSION;
/**
 * Register a Identifier on DynamoDB
 * This endpoint receive a simple POST Payload like this:
 * {
 *   "org_id": "88242366-eff5-47e8-a732-b350704da6b7",
 *   "identifier":{
 *      "key":"carteirinha",
 *      "value":"88242366eff547e8a732b350704da6b7"
 *   }
 * }
 * After receive a simple payload:
 *
 * Register on DynamoDB Table
 */
module.exports.create = async (event, context, callback) => {
	try {
		const body = event.body ? event.body : event;
		const data = JSON.parse(body);

		/**@TODO Validate Informations.*/
		
		const ORG_ID = data.org_id;
		const IDENTIFIER_ID = encryption.getId();

		let identifier = {
			TableName : DYNAMO_TABLE_SESSION,
			Item: {
				PK: `ORG#${ORG_ID}`,
				SK: `IDEN#${IDENTIFIER_ID}`,
				identifier_id: IDENTIFIER_ID,
				key: data.identifier.key,
				value: data.identifier.value,
				created_at: new Date().getTime(),
			}
		};

		console.log(identifier);

		let identifierSaved = await dynamo.save(identifier);

		return response.json(
			callback,
			{
				result: {
					code: 2001,
					message: 'Identifier successfully recorded',
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
					message: 'Identifier not recorded try again ',
					error,
				},
			},
			500
		);
	}
};
