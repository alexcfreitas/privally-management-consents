"use strict";
const {
  Session,
  Identifier,
  Person,
  PersonIdentifier,
  PersonSession,
  Asset,
} = require("common").Service;

const response = require("common").Response;
const Paylod = require("./eventUpdateOrganization.json");
/**
 * Register a single Session on DynamoDB
 * This endpoint receibe a simple POST Payload like this:
 *
 * {
 *   "spvll": "4f6d4f65d4f65ds465f4ds",
 *   "identifier":{
 *      "key":" ",
 *      "value":"54654564645"
 *   }
 * }
 *
 * After receibe a simple payload:
 * Register on DynamoDB Table
 */
const run = async (event, context, callback) => {
  try {
    const data = event.body ? event.body : event;
    const asset = event.requestContext.authorizer.asset;
    // const data = JSON.parse(body);

    const {organizationId, assets } = data.organization;
    const responseData = [];
    const assetApiKeys = [];

    for await (let asset of assets) {
      const assetData = await Asset.update({
        PK: `ORG#${organizationId}`,
        SK: `ASSE#${asset.assetId}`,
        org_id: organizationId,
        asset_id: asset.assetId,
        url: asset.url,
        is_active: asset.isActive,
        is_deleted: asset.isDeleted
      });
      assetApiKeys.push(assetData);
    }

    responseData.push({
      org_id: organizationId,
      assets: assetApiKeys,
    });

    console.log("RESPONSE DATA  --> ", JSON.stringify(responseData, null, 2));

    return response.json(
      callback,
      {
        result: {
          code: 2001,
          message:
            "Asset successfully updated",
          organization: responseData,
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


const callback = (erro, data) => {
  console.info("*******************");
  console.info(
    "Erro: ",
    erro === null ? "Não há erros" : JSON.stringify(erro, null, 2)
  );
  console.info("*******************");
  console.info("Sucesso: ", JSON.stringify(data, null, 2));
  console.info("*******************");
};

(async () => {
  let test = run(Paylod, {}, callback);

  console.log("RESULT --> ", JSON.stringify(test, null, 2));
})();
