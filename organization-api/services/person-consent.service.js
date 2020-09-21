"use strict";
const { getId, getApiKey } = require("../shared/lib/encryption");
const dynamodb = require("../shared/lib/dynamo");

const DYNAMO_TABLE = process.env.DYNAMO_TABLE;

/**
 * PersonConsent CRUD Abstraction
 * @Author: Alexsandro Carvalho de Freitas
 *
 * @create() - Register PersonConsent on DynamoDB
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
    const CONSENT_ID = data.consent_id;
    const PERSON_CONSENT_ID = getId();

    let params = {
      TableName: DYNAMO_TABLE,
      Item: {
        PK: `ORG#${ORG_ID}#PERS#${PERSON_ID}`,
        SK: `ORG#${ORG_ID}#CONS#${CONSENT_ID}`,
        org_id: ORG_ID,
        person_id: PERSON_ID,
        person_consent_id: PERSON_CONSENT_ID,
        data_key: `PERS#CONS#${PERSON_ID}`,
        created_at: new Date().getTime(),
        updated_at: new Date().getTime(),
      },
    };
    const persConsData = await dynamodb.save(params);

    return {
      org_id: persConsData.Item.org_id,
      person_id: persConsData.Item.person_id,
      person_consent_id: persConsData.Item.person_consent_id,
    };
  } catch (error) {
    throw new Error("PersonConsent not recorded try again");
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
