"use strict";
const AWS = require("aws-sdk");
AWS.config.update({ region: "sa-east-1" });
const dynamodb = new AWS.DynamoDB.DocumentClient();

const { getId, getApiKey } = require("../../shared/lib/encryption");

const DYNAMO_TABLE_SESSION = "test-privacy-apis-ERD";
/**
 * Register a Asset on DynamoDB
 * This endpoint receive a simple POST Payload like this:
 * {
 *   "org_id": "88242366eff547e8a732b350704da6b7",
 *   "asset":{
 *      "name":"unimed_platform",
 * 		  "origin": "centralnacionalunimed.com.br"
 *   }
 * }
 * After receive a simple payload:
 *
 * Register on DynamoDB Table
 */
const createAsset = (event) => {
  const data = event.body ? event.body : event;

  /**@TODO Validate Informations.*/

  const ORG_ID = data.org_id;
  const ASSET_ID = getId();

  let params = {
    TableName: DYNAMO_TABLE_SESSION,
    Item: {
      PK: `ORG#${ORG_ID}`,
      SK: `ASSE#${ASSET_ID}`,
      asset_id: ASSET_ID,
      name: data.asset.name,
      api_key: getApiKey(),
      origin: data.asset.origin,
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
      console.log("ASSET --> ", JSON.stringify(data, null, 2));
    }
  });
};

(() => {
  createAsset({
    org_id: "a115f8136c2d4fb1944c069d110dc1cc",
    asset: {
      name: "unimed_platform_web",
      origin: "centralnacionalunimed1.com.br",
    },
  });
})();
