const { Asset, Identifier } = require("common").Service;
const response = require("common").Response;

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

    for await (let asset of assets) {
      const assetData = await Asset.update({
        PK: `ORG#${organizationId}`,
        SK: `ASSE#${asset.assetId}`,
        org_id: organizationId,
        asset_id: asset.assetId,
        url: asset.url,
        is_active: asset.isActive,
        is_deleted: asset.isDeleted,
      });
      assetApiKeys.push(assetData);
    }

    for await (let iden of identifiers) {
      const identifierData = await Identifier.update({
        PK: `ORG#${organizationId}`,
        SK: `IDEN#${iden.identifierId}`,
        identifier_id: iden.identifierId,
        identifier_key: iden.key,
        is_active: iden.isActive,
        is_deleted: iden.isDeleted,
        data_key: `IDEN#${iden.key}`,
      });
      identifiersCreated.push(identifierData);
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
