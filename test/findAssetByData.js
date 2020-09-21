"use strict";
const AWS = require('aws-sdk');
AWS.config.update({ region: 'sa-east-1' });
const dynamodb = new AWS.DynamoDB.DocumentClient();

const DYNAMO_TABLE = "table-consent-management-dev";
/**
 * List All Persons of Organization on DynamoDB
 * This endpoint receive a simple GET with queryparams
 */

const findAssetByApiKey = (event) => {
  const data = event.body ? event.body : event;

  /**@TODO Validate Informations.*/

  const API_KEY = data.api_key;

  let params = {
    TableName: DYNAMO_TABLE,
    IndexName: 'data_key-filter',
    KeyConditionExpression: "#data_key = :data_key",
    ExpressionAttributeNames: {"#data_key":"data_key"},
    ExpressionAttributeValues: {
      ":data_key":`ASSE#${API_KEY}`,
    }
  };

  // let params = {
  //   TableName: DYNAMO_TABLE,
  //   FilterExpression : 'data_key = :data_key',
  //   ExpressionAttributeValues : {':data_key': `ASSE#${API_KEY}`}
  // }

  dynamodb.query(params, function (err, data) {
    if (err) {
      console.log(
        "Unable to create item in table. Error JSON:",
        JSON.stringify(err, null, 2)
      );
      console.log("Rejection for newSession:", params);
    } else {
      console.log("ASSET --> ", JSON.stringify(data, null, 2));
    }
  });
};

(() => {
  findAssetByApiKey({
    // api_key: "S82DD1J6WDMHD1QGXM67MPK8PATP",
    api_key: "S82DD1J6WDMHD1QGXM67MPK8PATPs",
  });
})();
