"use strict";
const { getId, getApiKey } = require("../lib/encryption");
const dynamodb = require("../lib/dynamo");

const DYNAMO_TABLE = process.env.DYNAMO_TABLE;
// const DYNAMO_TABLE = "test-privacy-apis-ERD";

/**
 * Organization CRUD Abstraction
 * @Author: Alexsandro Carvalho de Freitas
 *
 * @create() - Register Organization on DynamoDB
 * @TODO @get() - 
 * @TODO @find() - 
 * @TODO @update() - 
 * @TODO @listAssetsById() - 
 * @TODO @listIdentifiersById() - 
 * @TODO @listPersonsById() - 
 */

const create = async (event) => {
  try {
    const data = event.body ? event.body : event;
    /**@TODO Validate Informations.*/

    let ORG_ID = getId();

    let params = {
      TableName: DYNAMO_TABLE,
      Item: {
        PK: `ORG#${ORG_ID}`,
        SK: `#METADATA#${ORG_ID}`,
        org_id: ORG_ID,
        company_id: data.company_id,
        name: data.name,
        domain_name: data.domain_name,
        country: data.country,
        data_key: `ORG#${data.company_id}`,
        created_at: new Date().getTime(),
        updated_at: new Date().getTime(),
      },
    };
    const orgData = await dynamodb.save(params);

    return {
      org_id: orgData.Item.org_id,
      company_id: orgData.Item.company_id,
      name: orgData.Item.name,
      domain_name: orgData.Item.domain_name,
      data: orgData.Item.data,
    };
  } catch (error) {
    throw new Error("Organization not recorded try again");
  }
};

module.exports = {
  create,
  // get,
  // find,
  // update,
  // listAssetsById,
  // listIdentifiersById,
  // listPersonsById
};
