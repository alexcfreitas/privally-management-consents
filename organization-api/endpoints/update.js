const { Organization, Asset, Identifier } = require('common').Service;
const response = require('common').Response;
const util = require('common').Util;

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

		const { organization } = data;

		const {
			organizationId,
			isActive,
			isDeleted,
			consentGroups,
			consentTypes,
			assets,
			identifiers,
		} = organization;

		const assetApiKeys = [];
		const identifiersUpdated = [];
		const consentGroupsUpdated = [];
		const consentTypesUpdated = [];
		const consentGroupConsentTypeUpdated = [];

		const org_data = await Organization.update({
			org_id: organizationId,
			is_active: isActive,
			is_deleted: isDeleted,
		});

		if (assets.length > 0) {
			for await (let asset of assets) {
				const { assetId, url, isActive, isDeleted } = asset;

				const assetData = await Asset.update({
					org_id: organizationId,
					asset_id: assetId,
					url: url,
					is_active: isActive,
					is_deleted: isDeleted,
				});
				assetApiKeys.push(assetData);
			}
		}

		if (identifiers.length > 0) {
			for await (let iden of identifiers) {
				const { identifierId, key, isActive, isDeleted } = iden;

				const identifierData = await Identifier.update({
					org_id: organizationId,
					identifier_key: identifierId,
					identifier_key: key,
					is_active: isActive,
					is_deleted: isDeleted,
				});
				identifiersUpdated.push(identifierData);
			}
		}

		if (consentGroups.length > 0) {
			for await (let consentGroup of consentGroups) {
				const {
					consentGroupId,
					description,
					isActive,
					isDeleted,
					consentTypes,
				} = consentGroup;
				let _consentTypes = consentTypes;
				for await (let _consentType of _consentTypes) {
					const { consentTypeId, consentGroupConsentTypeId } = _consentType;
					const consentGroupConsentTypeData = await ConsentGroupConsentType.update(
						{
							org_id: organizationId,
							cons_group_cons_type_id: consentGroupConsentTypeId,
							consent_group_id: consentGroupId,
							consent_type_id: consentTypeId,
						}
					);
					consentGroupConsentTypeUpdated.push(consentGroupConsentTypeData);
				}

				const consentGroupData = await ConsentGroup.update({
					org_id: organizationId,
					consent_group_id: consentGroupId,
					description,
					consent_types: consentGroupConsentTypeUpdated,
					is_active: isActive,
					is_deleted: isDeleted,
				});
				consentGroupsUpdated.push(consentGroupData);
			}
		}

		if (consentTypes.length > 0) {
			for await (let consentType of consentTypes) {
				const { consentTypeId, description, isActive, isDeleted } = consentType;
				const consentTypeData = await ConsentType.update({
					org_id: organizationId,
					consent_type_id: consentTypeId,
					description,
					is_active: isActive,
					is_deleted: isDeleted,
				});
				consentTypesUpdated.push(consentTypeData);
			}
		}

		return response.json(
			callback,
			{
				result: {
					code: 2001,
					message:
						'Organizations, Assets, Identifiers, ConsentGroups and ConsentTypes successfully updated',
					organization: {
						org_id: organizationId,
						assets: assetApiKeys,
						identifiers: identifiersUpdated,
						consent_groups: consentGroupsUpdated,
						consent_types: consentTypesUpdated,
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
						: 'Organizations, Assets and Identifiers not recorded try again ',
					error,
				},
			},
			500
		);
	}
};
