import { Injectable, Param } from '@nestjs/common';
import { productDto, productTransformed } from 'src/types/transformers/product';
/**
 *  Injectable class handling product transformation
 *  @Injectable in app scope or in kafka connection to reach kafka messages
 */
@Injectable()
export class ProductTransformerService {
  public healthCheck(): string {
    return 'Service running';
  }
  /**
   * transforms and validates productView responses and existence
   * @value id
   * @value description
   * @value name
   * @params object,  Composite object containing cdc changeData, productView data
   */
  public async productGeneralTransformerMethod(@Param() object: productDto) {
    const productObject: productTransformed = {};
    const { TBItem_ID, nStyleName, nItemDescription } = object;

    productObject['id'] = TBItem_ID.toString();
    productObject['name'] = nStyleName.toString();
    productObject['description'] = await this.descriptionTransformer(
      nItemDescription,
    );

    return productObject;
  }

  /**
   * description transformed from string format to richText(destination format)
   * @params string to be transformed
   */
  public async descriptionTransformer(@Param() description: string) {
    if (description) {
      return `{\"time\": 1662995227870, \"blocks\": [{\"id\": \"cqWmV3MIPH\", \"data\": {\"text\": \"${description}\"}, \"type\": \"paragraph\"}], \"version\": \"2.24.3\"}`;
    }
    return `{\"time\": 1662995227870, \"blocks\": [{\"id\": \"cqWmV3MIPH\", \"data\": {\"text\": \"test product\"}, \"type\": \"paragraph\"}], \"version\": \"2.24.3\"}`;
  }

  /**
   * media object transformed to a mappable array from object
   * @params object to be transformed and mapped
   * @returns media composite array
   */
  public async productMediaTransformerMethod(@Param() mediaObject) {
    const { medium, tiny, large } = mediaObject;
    let media = [];
    if (medium && tiny && large) {
      media = [...medium, ...tiny, ...large];
    }
    return media;
  }

  /**
   * This function returns variants based on color and its sizes
   * @params color to be created as variant
   * @params array of sizes to be mapped with color
   * @returns collection of variants to be created <Array>
   */
  public async productColorTransformerMethod(color: string, sizes: string[]) {
    const array = [];
    try {
      sizes.map((s) => {
        const object: any = { color: color };
        object.size = s;
        array.push(object);
      });
    } catch (error) {
      console.warn(error);
    }

    return array;
  }
}
