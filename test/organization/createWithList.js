const dynamodb = require("../../shared/lib/dynamo");
const { getId, getApiKey } = require("../../shared/lib/encryption");

const DYNAMO_TABLE_SESSION = "test-privacy-apis-ERD";
/**
 * Register a Asset on DynamoDB
 * This endpoint receive a simple POST Payload:
 * After receive a simple payload:
 * See MOCK DUMMY DATA below
 * Register on DynamoDB Table
 */

const body = [
  {
    company_id: "84981171000139",
    name: "Leroy Merlin Cia Brasileira de Bricolagem",
    domain_name: "leroymerlin.com.br",
    country: "Brazil",
    assets: [
      {
        asset_name: "leroy_platform_portal",
        asset_origin: "leroymerlin.com.br",
      },
      {
        asset_name: "leroy_platform_app",
        asset_origin: "app.leroymerlin.com.br",
      },
      {
        asset_name: "leroy_platform_web",
        asset_origin: "leroymerlin.com.br",
      },
    ],
    identifiers: ["cpf", "rg"],
  },
  {
    company_id: "98789278000194",
    name: "Central Nacional Unimed",
    domain_name: "cnu.com.br",
    country: "Brazil",
    assets: [
      {
        asset_name: "unimed_platform_portal",
        asset_origin: "portalbeneficiario.com.br",
      },
      {
        asset_name: "unimed_platform_app",
        asset_origin: "app.portalbeneficiario.com.br",
      },
      {
        asset_name: "cnu_platform_web",
        asset_origin: "cnu.com.br",
      },
    ],
    identifiers: ["carteirinha", "cbenef", "cpf", "rg", "ra", "passport"],
  },
];

const createOrganization = async (event) => {
  const data = event.body ? event.body : event;

  /**@TODO Validate Informations.*/

  let ORG_ID = getId();

  let params = {
    TableName: DYNAMO_TABLE_SESSION,
    Item: {
      PK: `ORG#${ORG_ID}`,
      SK: `#METADATA#${ORG_ID}`,
      org_id: ORG_ID,
      company_id: data.company_id,
      name: data.name,
      domain_name: data.domain_name,
      country: data.country,
      data: `ORG#${data.name}`,
      created_at: new Date().getTime(),
      updated_at: new Date().getTime(),
    },
  };
  const orgData = await dynamodb.save(params);

  return {
    org_id: orgData.Item.org_id,
    company_id: orgData.Item.company_id,
    name: orgData.Item.name,
    domain_name: orgData.Item.domain_name,
    data: orgData.Item.data,
  };
};

const createIdentifier = async (event) => {
  const data = event.body ? event.body : event;

  let ORG_ID = data.org_id;
  let IDENTIFIER_ID = getId();

  let identifierData = {
    TableName: DYNAMO_TABLE_SESSION,
    Item: {
      PK: `ORG#${ORG_ID}`,
      SK: `IDEN#${IDENTIFIER_ID}`,
      org_id: ORG_ID,
      identifier_id: IDENTIFIER_ID,
      identifier_key: data.identifier_key,
      data: `IDEN#${data.identifier_key}`,
      created_at: new Date().getTime(),
      updated_at: new Date().getTime(),
    },
  };
  return await dynamodb.save(identifierData);
};

const createAsset = async (event) => {
  const data = event.body ? event.body : event;

  /**@TODO Validate Informations.*/

  let ORG_ID = data.org_id;
  let ASSET_ID = getId();
  let API_KEY = getApiKey();

  let params = {
    TableName: DYNAMO_TABLE_SESSION,
    Item: {
      PK: `ORG#${ORG_ID}`,
      SK: `ASSE#${ASSET_ID}`,
      org_id: ORG_ID,
      asset_id: ASSET_ID,
      name: data.asset_name,
      api_key: API_KEY,
      data: `ASSE#${API_KEY}`,
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
};

(async () => {
  const resultArray = [];

  for await (organization of body) {
    const {
      company_id,
      name,
      domain_name,
      country,
      assets,
      identifiers,
    } = organization;

    let { org_id } = await createOrganization({
      company_id,
      name,
      domain_name,
      country,
    });

    const assetApiKeys = [];

    for await (asse of assets) {
      const asset = await createAsset({
        org_id,
        ...asse,
      });
      assetApiKeys.push(asset);
    }

    for await (iden of identifiers) {
      const identifier = await createIdentifier({
        org_id,
        identifier_key: iden,
      });
    }

    resultArray.push({
      org_id,
      company_id,
      name,
      domain_name,
      country,
      assets: assetApiKeys,
    });
  }

  console.log("RESULT --> ", JSON.stringify(resultArray, null, 2));
})();

/**  MOCK DUMMY DATA ORGANIZATION
[{"company_id":"02877565000187","name":"Medicos Sem Fronteiras","domain_name":"msf.org.br","country":"Brazil"},
{"company_id":"02367196000182","name":"VAGAS Tecnologia","domain_name":"vagas.com.br","country":"Brazil"},
{"company_id":"84981171000139","name":"Leroy Merlin Cia Brasileira de Bricolagem","domain_name":"leroymerlin.com.br","country":"Brazil"},
{"company_id":"16880307000164","name":"Hospital Israelita Albert Einstein","domain_name":"einstein.br", "country":"Brazil"},
{"company_id":"98789278000194","name":"Central Nacional Unimed","domain_name":"cnu.com.br","country":"Brazil"}]
 */
