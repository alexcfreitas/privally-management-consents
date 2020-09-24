"use strict";
const {
  PersonIdentifier,
  PersonConsent,
} = require("common").Service;

const response = require("common").Response;
/**
 * Register a single Session on DynamoDB
 * This endpoint receibe a simple POST Payload like this:
 *
 * {
 *   "identifier":{
 *      "key":"cbenef",
 *      "value":"54654564645"
 *   }
 * }
 *
 * After receibe a simple payload:
 * Register on DynamoDB Table
 */
module.exports.run = async (event, context, callback) => {
  try {
    const body = event.body ? event.body : event;
    const asset = JSON.parse(event.requestContext.authorizer.asset);
    const data = JSON.parse(body);

    const personIdentifier = await PersonIdentifier.findPersonIdentifierByIdenValue(
      {
        org_id: asset.org_id,
        person_identifier_value: data.identifier.value,
      }
    );

    if (Object.keys(personIdentifier).length === 0) {
      return response.json(
        callback,
        {
          result: {
            code: 4041,
            message: "Person not founded",
          },
        },
        404
      );
    }

    let isSameIdentifierKey =
      personIdentifier.person_identifier_key === data.identifier.key;

    if (!isSameIdentifierKey) {
      return response.json(
        callback,
        {
          result: {
            code: 4001,
            message: `Person founded but is not same Identifier Key try again`,
          },
        },
        400
      );
    }

    // Find Person-Consent
    const person_consent = await PersonConsent.findPersonConsentByIdenValue({
      org_id: asset.org_id,
      person_identifier_value: data.identifier.value,
    });

    if (Object.keys(person_consent).length === 0) {
      return response.json(
        callback,
        {
          result: {
            code: 4001,
            message: `person consent does not exist`,
          },
        },
        400
      );
    }

    return response.json(
      callback,
      {
        result: {
          code: 2001,
          message: "person consent founded",
          consent: person_consent,
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
