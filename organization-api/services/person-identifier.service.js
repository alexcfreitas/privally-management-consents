"use strict";
const { getId, getApiKey } = require("../shared/lib/encryption");
const dynamodb = require("../shared/lib/dynamo");

const DYNAMO_TABLE = process.env.DYNAMO_TABLE;

/**
 * PersonIdentifier CRUD Abstraction
 * @Author: Alexsandro Carvalho de Freitas
 *
 * @create() - Register PersonIdentifier on DynamoDB
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
    // const data = JSON.parse(body);
    /**@TODO Validate Informations.*/

    const ORG_ID = data.org_id;
    const PERSON_ID = data.person_id;
    const IDENTIFIER_ID = data.identifier_id;
    const PERSON_IDENTIFIER_ID = getId();

    let params = {
      TableName: DYNAMO_TABLE,
      Item: {
        PK: `ORG#${ORG_ID}#PERS#${PERSON_ID}`,
        SK: `ORG#${ORG_ID}#IDEN#${IDENTIFIER_ID}`,
        org_id: ORG_ID,
        person_id: PERSON_ID,
        person_identifier_id: PERSON_IDENTIFIER_ID,
        person_identifier_value: data.person_identifier_value,
        data_key: `PERS#IDEN#${data.person_identifier_value}`,
        created_at: new Date().getTime(),
        updated_at: new Date().getTime(),
      },
    };
    const persIdenData = await dynamodb.save(params);

    return {
      org_id: persIdenData.Item.org_id,
      person_id: persIdenData.Item.person_id,
      person_identifier_id: persIdenData.Item.person_identifier_id,
      person_identifier_value: persIdenData.Item.person_identifier_value,
    };
  } catch (error) {
    throw new Error("PersonIdentifier not recorded try again");
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
