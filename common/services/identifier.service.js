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

    let ORG_ID = data.org_id;
    let IDENTIFIER_ID = getId();
  
    let identifierData = {
      TableName: DYNAMO_TABLE,
      Item: {
        PK: `ORG#${ORG_ID}`,
        SK: `IDEN#${IDENTIFIER_ID}`,
        org_id: ORG_ID,
        identifier_id: IDENTIFIER_ID,
        identifier_key: data.identifier_key,
        data_key: `IDEN#${data.identifier_key}`,
        created_at: new Date().getTime(),
        updated_at: new Date().getTime(),
      },
    };
    let idenData =  await dynamodb.save(identifierData);

    return {
      org_id: idenData.Item.org_id,
      identifier_id: idenData.Item.identifier_id,
      identifier_key: idenData.Item.identifier_key
    };
  } catch (error) {
    throw new Error("Identifier not recorded try again");
  }
};


const findIdentifierByKey = async (event) => {
  try {
    const data = event.body ? event.body : event;

    /**@TODO Validate Informations.*/
    const ORG_ID = data.org_id;
    const IDENTIFIER_KEY = data.identifier_key;

    let params = {
      TableName: DYNAMO_TABLE,
      IndexName: "PK-data_key-Filter",
      KeyConditionExpression: "#PK = :PK and begins_with(#SK, :SK)",
      ExpressionAttributeNames: { "#PK":"PK", "#SK": "data_key" },
      ExpressionAttributeValues: {
        ":PK": `ORG#${ORG_ID}`,
        ":SK": `IDEN#${IDENTIFIER_KEY}`
      },
    };

    const identifierData = await dynamodb.list(params);
    return {...identifierData.Items[0]};

  } catch (error) {
    throw new Error("Identifier not founded try again");
  }
};

module.exports = {
  create,
  findIdentifierByKey,
  // get,
  // find,
  // update,
  // listAssetsById,
  // listIdentifiersById,
  // listPersonsById
};
