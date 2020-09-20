"use strict";
const { getId, getApiKey } = require("../../shared/lib/encryption");
const dynamo = require("../../shared/lib/dynamo");
const response = require("../../shared/lib/response");

const DYNAMO_TABLE_SESSION = process.env.DYNAMO_TABLE_SESSION;
/**
 * Register a Asset on DynamoDB
 * This endpoint receibe a simple POST Payload like this:
 * {
 *   "org_id": "a115f8136c2d4fb1944c069d110dc1cc",
 *   "asset_name": "unimed_platform_portal",
 *   "asset_origin": "portalbeneficiario.com.br",
 * }
 * After receive a simple payload:
 *
 * Register on DynamoDB Table
 */

module.exports.create = async (event, context, callback) => {
  try {
    const body = event.body ? event.body : event;
    const data = JSON.parse(body);

    /**@TODO Validate Informations.*/

    const ORG_ID = data.org_id;
    const ASSET_ID = getId();
    const API_KEY = getApiKey();

    let assetData = {
      TableName: DYNAMO_TABLE_SESSION,
      Item: {
        PK: `ORG#${ORG_ID}`,
        SK: `ASSE#${ASSET_ID}`,
        org_id: ORG_ID,
        asset_id: ASSET_ID,
        asset_name: data.asset_name,
        asset_origin: data.asset_origin,
        asset_api_key: API_KEY,
        data: `ASSE#${API_KEY}`,
        created_at: new Date().getTime(),
        updated_at: new Date().getTime(),
      },
    };

    const asseData = await dynamo.save(assetData);

    return response.json(
      callback,
      {
        result: {
          code: 2001,
          message: "Asset successfully recorded",
          asset: {
            id: asseData.Item.asset_id,
            api_key: asseData.Item.asset_api_key,
          },
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
          message: "Asset not recorded try again ",
          error,
        },
      },
      500
    );
  }
};
