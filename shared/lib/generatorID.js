'use strict';
import * as uuid from 'uuid';

const create = () => uuid.v4();

const createApiKey = () => uuid.v4().replace('-','');

const validate = (id) => uuid.validate(id);

module.exports = {
	create,
	createApiKey,
	validate
};
