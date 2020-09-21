const OrganizationService = require('../services/organization.service'); 
const AssetService = require('../services/asset.service'); 
const IdentifierService = require('../services/identifier.service'); 

const response = require('../shared/lib/response');

module.exports.create = async (event, context, callback) => {
  try {
    const body = event.body ? event.body : event;
    const data = JSON.parse(body);
    const responseData = [];

    for await (organization of data) {
      const {
        company_id,
        name,
        domain_name,
        country,
        assets,
        identifiers,
      } = organization;

      let { org_id } = await OrganizationService.create({
        company_id,
        name,
        domain_name,
        country,
      });

      const assetApiKeys = [];

      for await (asset of assets) {
        const assetData = await AssetService.create({
          org_id,
          ...asset,
        });
        assetApiKeys.push(assetData);
      }

      for await (identifier of identifiers) {
        const identifierData = await IdentifierService.create({
          org_id,
          identifier_key: identifier,
        });
      }

      responseData.push({
        org_id,
        company_id,
        name,
        domain_name,
        country,
        assets: assetApiKeys,
      });
    }

    console.log("RESPONSE DATA  --> ", JSON.stringify(responseData, null, 2));

    return response.json(
      callback,
      {
        result: {
          code: 2001,
          message: "Organizations, Assets and Identifiers successfully recorded",
          organizations: responseData,
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
          message: error.message ? error.message : "Organizations, Assets and Identifiers not recorded try again ",
          error,
        },
      },
      500
    );
  }
};
