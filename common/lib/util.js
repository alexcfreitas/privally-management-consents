'use strict';

const _ = require('lodash');

const generateUpdateQuery = (fields) => {
	let exp = {
		UpdateExpression: 'set',
		ExpressionAttributeNames: {},
		ExpressionAttributeValues: {},
	};
	Object.entries(fields).forEach(([key, item]) => {
		exp.UpdateExpression += ` #${key} = :${key},`;
		exp.ExpressionAttributeNames[`#${key}`] = key;
		exp.ExpressionAttributeValues[`:${key}`] = item;
	});
	exp.UpdateExpression = exp.UpdateExpression.slice(0, -1);
	return exp;
};

const getValidAtributes = (data, ...atributesPossibles) => {
	return _.chain(data)
		.pick([...atributesPossibles])
		.pickBy(_.identity)
		.value();
};

module.exports = {
	generateUpdateQuery,
	getValidAtributes,
};
