"use strict";

const AWS = require("aws-sdk");
AWS.config.update({ region: "sa-east-1" });
const dynamodb = new AWS.DynamoDB.DocumentClient();

/**
 * DynamoDB Client Abstraction
 * @Author: Alexsandro Carvalho de Freitas
 *
 * @save() - Register Item on DynamoDB
 * @find() - Find Register by Key
 * @query() - Execute DynamoDB Query
 * @update() - Execute a DynamoDB Update
 * @TODO @scan() - Execute DynamoDB Scan
 * @TODO @removeRow() - Delete a single row using Key
 */

const save = async params => {
  try {
    await dynamodb.put(params).promise();
    return params;
  } catch (error) {
    console.log(
      "Unable to create item in table. Error JSON:",
      JSON.stringify(error, null, 2)
    );
    console.log("Rejection for:", JSON.stringify(params, null, 2));
    throw new Error();
  }
};

const update = async params => {
  try {
    return await dynamodb.update(params).promise();
  } catch (error) {
    console.log(
      "Unable to create item in table. Error JSON:",
      JSON.stringify(error, null, 2)
    );
    console.log("Rejection for:", JSON.stringify(params, null, 2));
    throw new Error();
  }
};

const find = async params => {
  try {
    return await dynamodb.get(params).promise();
  } catch (error) {
    console.log(
      "Unable to create item in table. Error JSON:",
      JSON.stringify(error, null, 2)
    );
    console.log("Rejection for:", JSON.stringify(params, null, 2));
    throw new Error();
  }
};

const list = async params => {
	try {
	  return await dynamodb.query(params).promise();
	} catch (error) {
	  console.log(
		"Unable to create item in table. Error JSON:",
		JSON.stringify(error, null, 2)
	  );
    console.log("Rejection for:", JSON.stringify(params, null, 2));
    throw new Error();
	}
  };

module.exports = {
  save,
  update,
  find,
  list
};
