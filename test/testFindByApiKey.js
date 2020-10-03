const AssetService = require("../session-api/services/asset.service");

const DYNAMO_TABLE = "test-privacy-apis-ERD";



(async () => {

  let test = await AssetService.findAssetByApiKey({
    api_key: "S82DD1J6WDMHD1QGXM67MPK8PATP",
    // api_key: "S82DD1J6WDMHD1QGXM67MPK8PATPs",
  });

  console.log("RESULT --> ", JSON.stringify(test, null, 2));
})();
