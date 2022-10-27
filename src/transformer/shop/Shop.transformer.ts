import { Injectable, Param } from '@nestjs/common';
import { shopDto, shopTransformed } from 'src/types/transformers/shop';
/**
 *  Injectable class handling shop transformation\
 *  @requires Injectable in app scope or in kafka connection to reach kafka messages
 */
@Injectable()
export class ShopTransformerService {
  public healthCheck(): string {
    return 'Service running';
  }

  /**
   * transforms and validates shop responses and existence
   * @value id
   * @value description
   * @value name
   * @value seo_description
   * @value seo_title
   * @value url
   * @value minOrder
   * @value storePolicy
   * @value madeIn
   * @value returnPolicy
   * @value email
   * @params object,  Composite object containing cdc changeData, categoryMaster data
   * @returns transformed object
   */
  public async shopTransformerMethod(@Param() object: shopDto) {
    const shopObject: shopTransformed = {};
    const {
      TBVendor_ID,
      VDEMail,
      VDFrontDescription,
      VDVendorURL,
      OSminOrderAMT,
      VDStorePolicy,
      SEOTitle,
      SEODescription,
      VDName,
      VDMadeIn,
      VDReturnPolicy,
    } = object;
    shopObject['id'] = TBVendor_ID?.toString();
    shopObject['name'] = VDName?.toString();
    shopObject['description'] = VDFrontDescription?.toString();
    shopObject['seo_description'] = SEODescription?.toString();
    shopObject['seo_title'] = SEOTitle?.toString();
    shopObject['email'] = VDEMail?.toString();
    shopObject['url'] = VDVendorURL?.toString();
    shopObject['minOrder'] = OSminOrderAMT?.toString();
    shopObject['storePolicy'] = VDStorePolicy?.toString();
    shopObject['madeIn'] = VDMadeIn?.toString();
    shopObject['returnPolicy'] = VDReturnPolicy?.toString();
    return shopObject;
  }
}
