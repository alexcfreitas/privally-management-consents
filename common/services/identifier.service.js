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
    let IDENTIFIER_ID = data.identifier_id;
  
    let identifierData = {
      TableName: DYNAMO_TABLE,
      Item: {
        PK: `ORG#${ORG_ID}`,
        SK: `IDEN#${IDENTIFIER_ID}`,
        org_id: ORG_ID,
        identifier_id: IDENTIFIER_ID,
        identifier_key: data.identifier_key,
        is_active: data.is_active,
        is_deleted: data.is_deleted,
        data_key: `IDEN#${data.identifier_key}`,
        created_at: new Date().getTime(),
        updated_at: new Date().getTime(),
      },
    };
    let idenData =  await dynamodb.save(identifierData);

    return {...idenData.Item};

  } catch (error) {
    throw new Error("Identifier not recorded try again");
  }
};

const update = async (event) => {
  try {
    const data = event.body ? event.body : event;

    /**@TODO Validate Informations.*/
    const PK = data.PK;
    const SK = data.SK;

    let params = {
      TableName: DYNAMO_TABLE,
      Key: { PK, SK},
      UpdateExpression: "set #identifier_key = :identifier_key, is_active = :is_active, is_deleted = :is_deleted, data_key = :data_key, updated_at = :updated_at",
      ExpressionAttributeNames: {"#identifier_key": "identifier_key" },
      ExpressionAttributeValues: {
        ":identifier_key": data.identifier_key,
        ":is_active": data.is_active,
        ":is_deleted": data.is_deleted,
        ":data_key": data.data_key,
        ":updated_at": new Date().getTime()
      },
      ReturnValues: "ALL_NEW"
    };

    const idenData = await dynamodb.update(params);
    return {...idenData.Attributes};

  } catch (error) {
    throw new Error("Identifier not updated try again");
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
  update,
  // listAssetsById,
  // listIdentifiersById,
  // listPersonsById
};
