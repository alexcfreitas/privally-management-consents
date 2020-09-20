"use strict";
const { getId, getApiKey } = require("../../shared/lib/encryption");
const dynamo = require("../../shared/lib/dynamo");
const response = require("../../shared/lib/response");

const DYNAMO_TABLE_SESSION = process.env.DYNAMO_TABLE_SESSION;
/**
 * Register a Organization on DynamoDB
 * This endpoint receibe a simple POST Payload like this:
 * body: {
 * company_id: "84981171000139",
 * name: "Leroy Merlin Cia Brasileira de Bricolagem",
 * domain_name: "leroymerlin.com.br",
 * country: "Brazil",
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

    const ORG_ID = getId();

    let organizationData = {
      TableName: DYNAMO_TABLE_SESSION,
      Item: {
        PK: `ORG#${ORG_ID}`,
        SK: `#METADATA#${ORG_ID}`,
        org_id: ORG_ID,
        company_id: data.company_id,
        name: data.name,
        domain_name: data.domain_name,
        country: data.country,
        data: `ORG#${name}`,
        created_at: new Date().getTime(),
        updated_at: new Date().getTime(),
      },
    };

    const orgData = await dynamo.save(organizationData);

    return response.json(
      callback,
      {
        result: {
          code: 2001,
          message: "Organization successfully recorded",
          organization: { id: orgData.Item.org_id },
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
          message: "Organization not recorded try again ",
          error,
        },
      },
      500
    );
  }
};
