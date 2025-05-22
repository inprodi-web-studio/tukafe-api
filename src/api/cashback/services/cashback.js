'use strict';

/**
 * cashback service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::cashback.cashback');
