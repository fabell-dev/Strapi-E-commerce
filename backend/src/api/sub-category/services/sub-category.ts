/**
 * sub-category service
 */

import { factories } from '@strapi/strapi';

// Función auxiliar para generar slug
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default factories.createCoreService('api::sub-category.sub-category', ({ strapi }) => ({
  async beforeCreate(params: any) {
    if (params.data.name && !params.data.slug) {
      params.data.slug = generateSlug(params.data.name);
    }
  },

  async beforeUpdate(params: any) {
    if (params.data.name && !params.data.slug) {
      params.data.slug = generateSlug(params.data.name);
    }
  },
}));
