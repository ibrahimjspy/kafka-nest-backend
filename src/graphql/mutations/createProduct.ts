import { gql } from 'graphql-request';

export const createProductMutation = (kafkaPayload) => {
  // <!> Debezium kafka message parse
  const productData = kafkaPayload.after;

  return gql`
    mutation{
        productCreate(
          input: {
            attributes: [
              id: A1
              values: ["${productData.color || 'RED'}"]
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
        {
              product {
                name
                id
                seoTitle
              }
              errors {
                field
                message
              }
            }
      }
    `;
};
export const addOrangeShineIdMutation = (saleorResponse, productObject) => {
  const saleorId = saleorResponse.product.id;
  const orangeShineId = productObject.id;
  return gql`
    mutation {
      updateMetadata(
        id: "${saleorId}"
        input: { key: "OS_ID", value: "${orangeShineId}" }
      ) {
        item {
          __typename
        }
      }
    }
  `;
};
