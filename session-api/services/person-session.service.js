"use strict";
const { getId, getApiKey } = require("../shared/lib/encryption");
const dynamodb = require("../shared/lib/dynamo");

const DYNAMO_TABLE = process.env.DYNAMO_TABLE;

/**
 * PersonSession CRUD Abstraction
 * @Author: Alexsandro Carvalho de Freitas
 *
 * @create() - Register PersonSession on DynamoDB
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
    const SESSION_ID = data.session_id;
    const PERSON_SESSION_ID = getId();

    let params = {
      TableName: DYNAMO_TABLE,
      Item: {
        PK: `ORG#${ORG_ID}#PERS#${PERSON_ID}`,
        SK: `ORG#${ORG_ID}#SESS#${SESSION_ID}`,
        org_id: ORG_ID,
        person_id: PERSON_ID,
        person_session_id: PERSON_SESSION_ID,
        spvll: data.spvll,
        data_key: `PERS#SESS#${data.spvll}`,
        created_at: new Date().getTime(),
        updated_at: new Date().getTime(),
      },
    };
    const persSessData = await dynamodb.save(params);

    return {
      org_id: persSessData.Item.org_id,
      person_id: persSessData.Item.person_id,
      person_session_id: persSessData.Item.person_session_id,
    };
  } catch (error) {
    throw new Error("PersonSession not recorded try again");
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
