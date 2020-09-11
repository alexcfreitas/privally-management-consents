'use strict';

const buildIAMPolicy = (assetKey, effect, resource) => {
	const policy = {
		principalId: assetKey,
		policyDocument: {
			Version: '2012-10-17',
			Statement: [
				{
					Action: 'execute-api:Invoke',
					Effect: effect,
					Resource: resource,
				},
			],
		},
	};

	return policy;
};

module.exports = {
	buildIAMPolicy,
};
