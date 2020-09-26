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
			cons_group_cons_type_id,
			consent_group_id,
			description,
			consent_type_id,
			is_active,
			is_deleted,
		} = util.getValidAtributes(
			data,
			'org_id',
			'cons_group_cons_type_id',
			'consent_group_id',
			'consent_type_id',
			'description',
			'is_active',
			'is_deleted'
		);

		let consentGroupTypeData = {
			TableName: DYNAMO_TABLE,
			Item: {
				PK: `ORG#${org_id}#CONS#GROUP#${consent_group_id}`,
				SK: `ORG#${org_id}#CONS#TYPE#${consent_type_id}`,
				org_id,
				cons_group_cons_type_id,
				consent_group_id,
				description,
				is_active,
				is_deleted,
				data_key: `CONS#GROUP#TYPE#${org_id}`,
				created_at: new Date().getTime(),
				updated_at: new Date().getTime(),
			},
		};
		let consGroupTypeData = await dynamodb.save(consentGroupTypeData);

		return { ...consGroupTypeData.Item };
	} catch (error) {
		throw new Error('Consent Group Type not recorded try again');
	}
};

const update = async (event) => {
	try {
		const data = event.body ? event.body : event;

		/**@TODO Validate Informations.*/

		const {
			org_id,
			cons_group_cons_type_id,
			consent_group_id,
			description,
			consent_type_id,
			is_active,
			is_deleted,
		} = util.getValidAtributes(
			data,
			'org_id',
			'cons_group_cons_type_id',
			'consent_group_id',
			'consent_type_id',
			'description',
			'is_active',
			'is_deleted'
		);
		const expression = util.generateUpdateQuery({
			org_id,
			cons_group_cons_type_id,
			consent_group_id,
			description,
			consent_type_id,
			is_active,
			is_deleted,
			data_key: `CONS#GROUP#TYPE#${org_id}`,
			updated_at: new Date().getTime(),
		});

		let params = {
			TableName: DYNAMO_TABLE,
			Key: {
				PK: `ORG#${org_id}#CONS#GROUP#${consent_group_id}`,
				SK: `ORG#${org_id}#CONS#TYPE#${consent_type_id}`,
			},
			...expression,
			ReturnValues: 'ALL_NEW',
		};

		const consGroupTypeData = await dynamodb.update(params);
		return { ...consGroupTypeData.Attributes };
	} catch (error) {
		throw new Error('Consent Group - Consent Type  not updated try again');
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
