"use strict";
const { getId, getApiKey } = require("../lib/encryption");
const dynamodb = require("../lib/dynamo");

const DYNAMO_TABLE = process.env.DYNAMO_TABLE;
// const DYNAMO_TABLE = "table-consent-management-dev";

/**
 * Asset CRUD Abstraction
 * @Author: Alexsandro Carvalho de Freitas
 *
 * @create() - Register Asset on DynamoDB
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

    let ORG_ID = data.org_id;
    let ASSET_ID = getId();
    let API_KEY = getApiKey();

    let params = {
      TableName: DYNAMO_TABLE,
      Item: {
        PK: `ORG#${ORG_ID}`,
        SK: `ASSE#${ASSET_ID}`,
        org_id: ORG_ID,
        asset_id: ASSET_ID,
        name: data.asset_name,
        api_key: API_KEY,
        data_key: `ASSE#${API_KEY}`,
        origin: data.asset_origin,
        created_at: new Date().getTime(),
      },
    };

    const assetData = await dynamodb.save(params);

    return {
      asset_id: assetData.Item.asset_id,
      name: assetData.Item.name,
      api_key: assetData.Item.api_key,
      origin: assetData.Item.origin,
    };
  } catch (error) {
    throw new Error("Asset not recorded try again");
  }
};

const findAssetByApiKey = async (event) => {
  try {
    const data = event.body ? event.body : event;

    /**@TODO Validate Informations.*/

    const API_KEY = data.api_key;

    let params = {
      TableName: DYNAMO_TABLE,
      IndexName: "data_key-filter",
      KeyConditionExpression: "#data_key = :data_key",
      ExpressionAttributeNames: { "#data_key": "data_key" },
      ExpressionAttributeValues: {
        ":data_key": `ASSE#${API_KEY}`,
      },
    };

    const assetData = await dynamodb.list(params);
    return {...assetData.Items[0]};

  } catch (error) {
    console.log(error)
    throw new Error("Asset not founded try again");
  }
};

module.exports = {
  create,
  findAssetByApiKey,
  // get,
  // find,
  // update,
  // listAssetsById,
  // listIdentifiersById,
  // listPersonsById
};
