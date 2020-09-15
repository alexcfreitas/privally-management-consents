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


 /**
  * Example Put Item
	var params = {
		TableName : 'Table',
		Item: {
			HashKey: 'haskey',
			NumAttribute: 1,
			BoolAttribute: true,
			ListAttribute: [1, 'two', false],
			MapAttribute: { foo: 'bar'},
			NullAttribute: null
		}
	};
  */

const save = async (params) => {
	return new Promise((resolve, reject) => {
		dynamodb.put(params, function (err, data) {
			if (err) {
				console.error(
					'Unable to create item in table. Error JSON:',
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

const update = async (params) => {
	return new Promise((resolve, reject) => {
		dynamodb.update(params, function (err, data) {
			if (err) {
				console.error(
					'Unable to Update item in table. Error JSON:',
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

const find = async (params) => {
	return new Promise((resolve, reject) => {
		dynamodb.get(params, function (err, data) {
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
	update,
	find,
};
