'use strict';

const dynamo = require('../../../shared/lib/dynamo');
const response = require('../../../shared/lib/response');

const DYNAMO_TABLE_SESSION = process.env.DYNAMO_TABLE_SESSION;
/**
 * End a single Session on DynamoDB
 * This endpoint receibe a simple POST
 */
module.exports.end = async (event, context, callback) => {
	try {
		// const body = event.body ? event.body : event;
		// const data = JSON.parse(body);
		// console.log(data);

		return response.json(
			callback,
			{
				result: {
					code: 2001,
					message: 'session ended successfully',
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
					message: '',
					error,
				},
			},
			500
		);
	}
};
