"use strict";
const AWS = require('aws-sdk');
AWS.config.update({ region: 'sa-east-1' });
const dynamodb = new AWS.DynamoDB.DocumentClient();

const { getId, getApiKey } = require("../../shared/lib/encryption");

const DYNAMO_TABLE_SESSION = "test-privacy-apis-ERD";
/**
 * Register a Organization on DynamoDB
 * This endpoint receive a simple POST Payload like this:
 * {
 *   "organization":{
 *      "name":"unimed"
 *   }
 * }
 * After receive a simple payload:
 *
 * Register on DynamoDB Table
 */

const createOrganization = (event) => {
  const data = event.body ? event.body : event;

  /**@TODO Validate Informations.*/

  const ORG_ID = getId();

  let params = {
    TableName: DYNAMO_TABLE_SESSION,
    Item: {
      PK: `ORG#${ORG_ID}`,
      SK: `#METADATA#${ORG_ID}`,
      name: data.organization.name,
      created_at: new Date().getTime(),
    },
  };

  dynamodb.put(params, function (err, data) {
    if (err) {
      console.log(
        "Unable to create item in table. Error JSON:",
        JSON.stringify(err, null, 2)
      );
      console.log("Rejection for newSession:", params);
    } else {
      console.log("ORGANIZATION --> ", JSON.stringify(data, null, 2));
    }
  });
};

(() => {
  createOrganization({
    organization: {
      name: "unimed",
    },
  });
})();
