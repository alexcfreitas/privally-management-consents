const { Organization, Identifier, Asset } = require('common').Service;
const response = require('common').Response;

module.exports.run = async (event, context, callback) => {
  try {
    const body = event.body ? event.body : event;
    const data = JSON.parse(body);
    const responseData = [];
    console.log("event DATA  --> ", JSON.stringify(event, null, 2));
    console.log("context DATA  --> ", JSON.stringify(context, null, 2));
    

    for await (organization of data) {
      const {
        company_id,
        name,
        domain_name,
        country,
        assets,
        identifiers,
      } = organization;

      let { org_id } = await Organization.create({
        company_id,
        name,
        domain_name,
        country,
      });

      const assetApiKeys = [];

      for await (asset of assets) {
        const assetData = await Asset.create({
          org_id,
          ...asset,
        });
        assetApiKeys.push(assetData);
      }

      for await (identifier of identifiers) {
        const identifierData = await Identifier.create({
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
