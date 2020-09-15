'use strict';
const encryption = require('../../shared/lib/encryption');
const dynamo = require('../../shared/lib/dynamo');
const response = require('../../shared/lib/response');

const DYNAMO_TABLE_SESSION = process.env.DYNAMO_TABLE_SESSION;
/**
 * Register a Asset on DynamoDB
 * This endpoint receibe a simple POST Payload like this:
 * {
 *   "org_id": "88242366eff547e8a732b350704da6b7",
 *   "asset":{
 *      "name":"unimed_platform",
 *      "api_key":"FETY009KRP4DN7MYR3WT9PM0KC17",
 * 		"origin": "centralnacionalunimed.com.br"
 *   }
 * }
 * After receibe a simple payload:
 *
 * Register on DynamoDB Table
 */
module.exports.create = async (event, context, callback) => {
	try {
		const body = event.body ? event.body : event;
		const data = JSON.parse(body);
		
		/**@TODO Validate Informations.*/

		const ORG_ID = data.org_id;
		const ASSET_ID = encryption.getId();

		let asset = {
			TableName : DYNAMO_TABLE_SESSION,
			Item: {
				PK: `ORG#${ORG_ID}`,
				SK: `#ASSE#${ASSET_ID}`,
				asset_id: ASSET_ID,
				name: data.asset.name,
				api_key: encryption.getApiKey(),
				origin: data.asset.origin,
				created_at: new Date().getTime(),
			}
		};

		console.log(asset);

		let assetSaved = await dynamo.save(asset);

		return response.json(
			callback,
			{
				result: {
					code: 2001,
					message: 'Asset successfully recorded',
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
					message: 'Asset not recorded try again ',
					error,
				},
			},
			500
		);
	}
};
