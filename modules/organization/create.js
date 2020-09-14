'use strict';
const generatiorID = require('../../shared/lib/generatorID');
const dynamo = require('../../shared/lib/dynamo');
const response = require('../../shared/lib/response');

const DYNAMO_TABLE_SESSION = process.env.DYNAMO_TABLE_SESSION;
/**
 * Register a Organization on DynamoDB
 * This endpoint receibe a simple POST Payload like this:
 * {
 *   "organization":{
 *      "name":"unimed"
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

		const ORG_ID = generatiorID.create();
		// TODO Validate Informations.

		let organization = {
			TableName : DYNAMO_TABLE_SESSION,
			Item: {
				PK: `ORG#${ORG_ID}`,
				SK: `#METADATA#${ORG_ID}`,
				name: data.organization.name,
				created_at: new Date().getTime(),
			}
		};

		console.log(organization);

		let organizationSaved = await dynamo.save(organization);

		return response.json(
			callback,
			{
				result: {
					code: 2001,
					message: 'Organization successfully recorded',
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
					message: 'Organization not recorded try again ',
					error,
				},
			},
			500
		);
	}
};
