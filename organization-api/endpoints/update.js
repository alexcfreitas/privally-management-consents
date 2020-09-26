const { Asset, Identifier } = require("common").Service;
const response = require("common").Response;
const util = require("common").Util;

/** Enable Organizer, Asset and Identifiers  
{
  "organization": {
    "organizationId": 0000000000,
    "assets": [
      {
        "assetId": 0000000
        "url": "www.x.com.br",
        "isActive": true,
        "isDeleted": true
      }
    ]
  }
}
*/

module.exports.run = async (event, context, callback) => {
  try {
    const body = event.body ? event.body : event;
    const data = JSON.parse(body);

    const { organizationId, assets, identifiers } = data.organization;
    const identifiersCreated = [];
    const assetApiKeys = [];


    if(assets.length > 0) {
      for await (let asset of assets) {

        const {identifierId, url, isActive,  isDeleted } = asset;
        
        let isValidObject = {
          url: url,
          is_active: isActive,
          is_deleted: isDeleted,
          updated_at: new Date().getTime()
        }
        
        let obj = util.getAtributesValid(isValidObject, 'url',  'is_active', 'is_deleted', 'data_key','updated_at');

        const assetData = await Asset.update({
          PK: `ORG#${organizationId}`,
          SK: `ASSE#${asset.assetId}`,
          object: obj
        });
        assetApiKeys.push(assetData);
      }
    }

    if(identifiers.length > 0) {
      for await (let iden of identifiers) {
        const {identifierId, key, isActive,  isDeleted } = iden;

        let isValidObject = {
          identifier_key: key,
          is_active: isActive,
          is_deleted: isDeleted,
          data_key: `IDEN#${key}`,
          updated_at: new Date().getTime()
        }
        
        let obj = util.getAtributesValid(isValidObject, 'identifier_id', 'identifier_key', 'is_active', 'is_deleted', 'data_key','updated_at');

        const identifierData = await Identifier.update({
          PK: `ORG#${organizationId}`,
          SK: `IDEN#${identifierId}`,
          object: obj
        });
        identifiersCreated.push(identifierData);
      }
    }

    return response.json(
      callback,
      {
        result: {
          code: 2001,
          message: "Organizations, Assets and Identifiers successfully updated",
          organization: { org_id: organizationId, assets: assetApiKeys, identifiers: identifiersCreated },
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
          message: error.message
            ? error.message
            : "Organizations, Assets and Identifiers not recorded try again ",
          error,
        },
      },
      500
    );
  }
};
