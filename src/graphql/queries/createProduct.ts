/* eslint-disable @typescript-eslint/no-unused-vars */
import { gql } from 'graphql-request';

export const createProductCatalogQuery = (kafkaPayload) => {
  // <!> Debezium kafka message parse
  const productData = kafkaPayload.after;

  return gql`
    mutation{
  productCreate(
    input: {
      attributes: [
        id: A1
        values: ["{productData.color}"]
      ]
      category: {productData.category}
      description: "{productData.description}"
      name: "{productData.name}"
      seo: {
        title: "{productData.brand.seo_title || null}"
        description: "{productData.brand.seo_description || null}"
      }
      rating: "{productData.order_review.score || null}"
      productType: "UHJvZHVjdFR5cGU6MQ=="
    }
  )
}
    `;
};
