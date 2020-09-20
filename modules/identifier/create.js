"use strict";
const { getId, getApiKey } = require("../../shared/lib/encryption");
const dynamo = require("../../shared/lib/dynamo");
const response = require("../../shared/lib/response");

const DYNAMO_TABLE_SESSION = process.env.DYNAMO_TABLE_SESSION;
/**
 * Register a Identifier on DynamoDB
 * This endpoint receibe a simple POST Payload like this:
 * {
 *   "org_id": "88242366-eff5-47e8-a732-b350704da6b7",
 *   "identifier_key": "carteirinha", "cbenef", "cpf", "rg", "ra", "passport"
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
    const IDENTIFIER_ID = getId();

    let identifierData = {
      TableName: DYNAMO_TABLE_SESSION,
      Item: {
        PK: `ORG#${ORG_ID}`,
        SK: `IDEN#${IDENTIFIER_ID}`,
        org_id: ORG_ID,
        identifier_id: IDENTIFIER_ID,
        identifier_key: data.identifier_key,
        data: `IDEN#${identifier_key}`,
        created_at: new Date().getTime(),
        updated_at: new Date().getTime(),
      },
    };

    const idenData = await dynamo.save(identifierData);

    return response.json(
      callback,
      {
        result: {
          code: 2001,
          message: "Identifier successfully recorded",
          identifier: {
            id: idenData.Item.identifier_id,
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
          message: "Identifier not recorded try again ",
          error,
        },
      },
      500
    );
  }
};
