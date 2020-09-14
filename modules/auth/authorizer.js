const _ = require('lodash');
const auth = require('../../shared/lib/auth');
const dynamo = require('../../shared/lib/dynamo');
const DYNAMO_TABLE_SESSION = process.env.DYNAMO_TABLE_SESSION;

const authorizeAsset = (asset, methodArn) => {
	// TODO: Validate Bussines Rules in Assets
	return !asset.isBlocked;
};

module.exports.authorizer = async (event, context, callback) => {
	const assetKey = event.authorizationToken;

	try {
		/** @TODO @find() - Find Asset by Key
		 *
		 */

		const asset = await dynamo.find(assetKey, DYNAMO_TABLE_SESSION);
		const isAllowed = authorizeAsset(asset, event.methodArn);
		const effect = isAllowed ? 'Allow' : 'Deny';
		const policyDocument = auth.buildIAMPolicy(
			asset.asset_id,
			effect,
			event.methodArn
		);

		callback(null, policyDocument);
	} catch (err) {
		callback('Unauthorized'); // Return a 401 Unauthorized response
	}
};
