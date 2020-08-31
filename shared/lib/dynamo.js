'use strict';

const AWS = require('aws-sdk');
AWS.config.update({ region: 'sa-east-1' });
const dynamodb = new AWS.DynamoDB.DocumentClient();

/**
 * DynamoDB Client Abstraction
 * @Author: Alexsandro Carvalho de Freitas
 *
 * @save() - Register Item on DynamoDB
 * @TODO @find() - Find Register by Key
 * @TODO @query() - Execute DynamoDB Query
 * @TODO @scan() - Execute DynamoDB Scan
 * @TODO @update() - Execute a DynamoDB Update
 * @TODO @removeRow() - Delete a single row using Key
 */

const save = async (item, table) => {
	return new Promise((resolve, reject) => {
		const params = {
			TableName: table,
			Item: item,
		};
		dynamodb.put(params, function (err, data) {
			if (err) {
				console.error(
					'Unable to query table. Error JSON:',
					JSON.stringify(err, null, 2)
				);
				console.log('Rejection for newSession:', params);
				reject(err);
			} else {
				resolve(data);
			}
		});
	});
};

module.exports = {
	save,
};
