const { Organization, Identifier, Asset } = require("common").Service;
const response = require("common").Response;

/** Enable Organizer, Asset and Identifiers  
{
  "organization": {
    "organizationId": 0000000000,
    "assets": [
      {
        "assetId": 0000000,
        "url": "www.x.com.br",
        "isActive": true,
        "isDeleted": true
      },
      {
        "assetId": 0000000,
        "url": "www.x.com.br",
        "isActive": true,
        "isDeleted": true
      }
    ],
    "identifiers": [
      {
        "identifierId": 00000,
        "key": "cbenef",
        "isActive": true,
        "isDeleted": false
      },
      {
        "identifierId": 00000,
        "key": "cbenef",
        "isActive": true,
        "isDeleted": false
      }
    ]
  }
}
*/

module.exports.run = async (event, context, callback) => {
  try {
    const body = event.body ? event.body : event;
    const data = JSON.parse(body);
    const responseData = [];

    const { organization } = data;
    const { organizationId, assets, identifiers } = organization;

    const org_enabled = await Organization.get({
      org_id: organizationId,
    });

    if (Object.keys(org_enabled).length > 0) {
      return response.json(
        callback,
        {
          result: {
            code: 4001,
            message: `this organization has already been enabled`,
          },
        },
        400
      );
    }

    const org_data = await Organization.create({
      org_id: organizationId,
    });

    const assetApiKeys = [];
    const identifiersCreated = [];

    for await (let asset of assets) {
      const assetData = await Asset.create({
        org_id: organizationId,
        asset_id: asset.assetId,
        url: asset.url,
        is_active: asset.isActive,
        is_deleted: asset.isDeleted,
      });
      assetApiKeys.push(assetData);
    }

    for await (let identifier of identifiers) {
      const identifierData = await Identifier.create({
        org_id: organizationId,
        identifier_id: identifier.identifierId,
        identifier_key: identifier.key,
        is_active: identifier.isActive,
        is_deleted: identifier.isDeleted,
      });
      identifiersCreated.push(identifierData);
    }

    console.log("RESPONSE DATA  --> ", JSON.stringify(responseData, null, 2));

    return response.json(
      callback,
      {
        result: {
          code: 2001,
          message: "Organizations, Assets and Identifiers successfully enabled",
          organization: {
            org_id: organization.organizationId,
            assets: assetApiKeys,
            identifiers: identifiersCreated,
          },
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
