"use strict";
const {Consent, PersonIdentifier, PersonConsent } = require('common').Service;

const response = require('common').Response;
/**
 * Register a single Consent and Person-Consent on DynamoDB
 * This endpoint receibe a simple POST Payload like this:
 * {
 *   "identifier":{
 *      "key":"cbenef",
 *      "value":"54654564645"
 *   },
 *   "consent": {
 *      "is_accept": true,
 *      "data": {"field1":"", "field2":"", "field3":""}
 *   }
 * }
 * After receive a simple payload:
 * Register on DynamoDB Table
 */
module.exports.run = async (event, context, callback) => {
    try {
      const body = event.body ? event.body : event;
      const asset = JSON.parse(event.requestContext.authorizer.asset);
      const data = JSON.parse(body);
  
      const personConsent = await PersonConsent.findPersonConsentByIdenValue(
        {
          org_id: asset.org_id,
          person_identifier_value: data.identifier.value,
        }
      );
  
      if (Object.keys(personConsent).length > 0) {
        return response.json(
          callback,
          {
            result: {
              code: 4001,
              message: "this person's consent has already been created",
            },
          },
          400
        );
      }
  
      // Find Person-Identifier
      const person_identifier = await PersonIdentifier.findPersonIdentifierByIdenValue({
        org_id: asset.org_id,
        person_identifier_value: data.identifier.value,
      });
  
      if (Object.keys(person_identifier).length === 0) {
        return response.json(
          callback,
          {
            result: {
              code: 4001,
              message: `this person's session has not started`,
            },
          },
          400
        );
      }
  
      // Save Consent
      const {consent_id} = await Consent.create({
        org_id: asset.org_id,
        person_id: person_identifier.person_id,
      });
  
      // Save Person-Consent
      const person_consent = await PersonConsent.create({
        org_id: asset.org_id,
        person_id: person_identifier.person_id,
        consent_id,
        person_identifier_key: data.identifier.key,
        person_identifier_value: data.identifier.value,
        is_accept: data.consent.is_accept,
        consent_data: data.consent.data,
      });
  
      return response.json(
        callback,
        {
          result: {
            code: 2001,
            message: "consent successfully recorded",
            consent: person_consent
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
            message: "person consent not founded try again",
            error,
          },
        },
        500
      );
    }
  };