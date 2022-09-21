/* eslint-disable @typescript-eslint/no-unused-vars */
import { gql } from 'graphql-request';

export const createProductMutation = (kafkaPayload) => {
  // <!> Debezium kafka message parse
  const productData = kafkaPayload.after;
  const fallbackJSON = '{"phonetype":"N95","cat":"WP"}';

  return gql`
    mutation{
  productCreate(
    input: {
      attributes: [
        id: A1
        values: ["{productData.color}"]
      ]
      category: {productData.category || null}

      description: "{productData.description || fallbackJSON}"
      name: "{productData.name}"
      seo: {
        title: "{productData.brand.seo_title || ''}"
        description: "{productData.brand.seo_description || ''}"
      }
      rating: "{productData.order_review.score || null}"
      productType: "UHJvZHVjdFR5cGU6MQ=="
    }
  )
}
    `;
};
