import { Injectable } from '@nestjs/common';
import { getAttributesHandler } from './graphql/handlers/attributes';
import { camelCase } from 'lodash';
import { ProductAttributes } from './app.utils.types';

interface Attribute {
  node: {
    id: string;
    slug: string;
    type: string;
  };
}

@Injectable()
export class ConstantsService {
  private cachedConstants: ProductAttributes;

  /**
   * Fetches and returns the product attributes from the network.
   * If the attributes are already cached, returns the cached data.
   * @throws Error if unable to fetch the constants from the network.
   * @returns A Promise resolving to the ProductAttributes object.
   */
  async fetchAttributes(): Promise<ProductAttributes> {
    if (!this.cachedConstants) {
      try {
        const attributes = await getAttributesHandler();
        this.cachedConstants = this.mapAttributeSlugsToIds(attributes.edges);
      } catch (error) {
        throw new Error('Unable to fetch constants from the network');
      }
    }

    return this.cachedConstants;
  }

  /**
   * Maps attribute slugs to their corresponding ids and types.
   * @param attributes - An array of AttributeResponse objects containing attribute data.
   * @returns The ProductAttributes object containing the mapped attribute data.
   */
  private mapAttributeSlugsToIds(attributes: Attribute[]): ProductAttributes {
    const attributeIdMap = {};
    for (const attribute of attributes) {
      const transformedSlug = camelCase(attribute.node.slug); // Convert hyphen to camelCase
      attributeIdMap[transformedSlug] = {
        id: attribute.node.id,
        type: attribute.node.type,
      };
    }
    return attributeIdMap as ProductAttributes;
  }
}
