'use strict';
const { getId, getApiKey } = require('../lib/encryption');
const dynamodb = require('../lib/dynamo');
const util = require('../lib/util');
const DYNAMO_TABLE = process.env.DYNAMO_TABLE;

/**
 * Consent CRUD Abstraction
 * @Author: Alexsandro Carvalho de Freitas
 *
 * @create() - Register Consent on DynamoDB
 * @TODO @get() -
 * @TODO @find() -
 * @TODO @update() -
 * @TODO @listAssetsById() -
 * @TODO @listIdentifiersById() -
 * @TODO @listPersonsById() -
 */
const create = async (event) => {
	try {
		const data = event.body ? event.body : event;

		const {
			org_id,
			consent_type_id,
			description,
			is_active,
			is_deleted,
		} = util.getValidAtributes(
			data,
			'org_id',
			'consent_type_id',
			'description',
			'is_active',
			'is_deleted'
		);

		let consentTypeData = {
			TableName: DYNAMO_TABLE,
			Item: {
				PK: `ORG#${org_id}`,
				SK: `CONS#TYPE#${consent_type_id}`,
				org_id,
				consent_type_id,
				description,
				is_active,
				is_deleted,
				data_key: `CONS#TYPE#${org_id}`,
				created_at: new Date().getTime(),
				updated_at: new Date().getTime(),
			},
		};
		let consTypeData = await dynamodb.save(consentTypeData);

		return { ...consTypeData.Item };
	} catch (error) {
		throw new Error('Consent Group  not recorded try again');
	}
};

const update = async (event) => {
	try {
		const data = event.body ? event.body : event;

		/**@TODO Validate Informations.*/

		const {
			org_id,
			consent_type_id,
			description,
			is_active,
			is_deleted,
		} = util.getValidAtributes(
			data,
			'org_id',
			'consent_type_id',
			'description',
			'is_active',
			'is_deleted'
		);
		const expression = util.generateUpdateQuery({
			org_id,
			consent_type_id,
			description,
			is_active,
			is_deleted,
			data_key: `CONS#TYPE#${org_id}`,
			updated_at: new Date().getTime(),
		});

		let params = {
			TableName: DYNAMO_TABLE,
			Key: { PK: `ORG#${org_id}`, SK: `CONS#TYPE#${consent_type_id}` },
			...expression,
			ReturnValues: 'ALL_NEW',
		};

		const consTypeData = await dynamodb.update(params);
		return { ...consTypeData.Attributes };
	} catch (error) {
		throw new Error('Consent Type not updated try again');
	}
};

module.exports = {
	create,
	// get,
	// find,
	update,
	// listAssetsById,
	// listIdentifiersById,
	// listPersonsById
};
