import type { Schema, Struct } from '@strapi/strapi';

export interface ProductVariantProductVariant extends Struct.ComponentSchema {
  collectionName: 'components_product_variants';
  info: {
    description: 'Component para variantes de productos (color e imagen)';
    displayName: 'ProductVariant';
    icon: 'palette';
  };
  attributes: {
    color: Schema.Attribute.String & Schema.Attribute.Required;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'product-variant.product-variant': ProductVariantProductVariant;
    }
  }
}
