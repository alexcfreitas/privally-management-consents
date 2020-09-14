'use strict';

const dynamo = require('../../shared/lib/dynamo');
const response = require('../../shared/lib/response');

const DYNAMO_TABLE_SESSION = process.env.DYNAMO_TABLE_SESSION;
/**
 * Register a single Session on DynamoDB
 * This endpoint receibe a simple POST Payload like this:
 *
 * {
 *   "spvll": "4f6d4f65d4f65ds465f4ds",
 *   "identifier":{
 *      "key":"carteirinha",
 *      "value":"54654564645"
 *   }
 * }
 *
 * After receibe a simple payload:
 *
 * Register on DynamoDB Table
 */
module.exports.create = async (event, context, callback) => {
	try {
		const body = event.body ? event.body : event;
		const data = JSON.parse(body);
		console.log(data);

		if (data.identifier.key !== 'carteirinha') {
			return response.json(
				callback,
				{
					result: {
						code: 4001,
						message: `identifier "${data.identifier.key}" does not exist`,
					},
				},
				400
			);
		}

		const session = {
			pk: `SPVLL#${data.spvll}`,
			sk: `#IDENTIFIER#${data.identifier.value}`,
			spvll: data.spvll,
			identifierKey: data.identifier.key,
			identifierValue: data.identifier.value,
			created_at: new Date().getTime(),
		};

		console.log(session);

		let sessionSaved = await dynamo.save(session, DYNAMO_TABLE_SESSION);

		return response.json(
			callback,
			{
				result: {
					code: 2001,
					message: 'session successfully recorded',
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
					message: 'session successfully recorded',
					error,
				},
			},
			500
		);
	}
};
