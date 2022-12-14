import { Injectable, Param } from '@nestjs/common';
import { shopDto, shopTransformed } from 'src/transformer/types/shop';
/**
 *  Injectable class handling shop transformation\
 *  @requires Injectable in app scope or in kafka connection to reach kafka messages
 */
@Injectable()
export class ShopTransformerService {
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
  public async shopTransformerMethod(
    @Param() object: shopDto,
  ): Promise<shopTransformed> {
    // console.dir(object, { depth: null });
    const shopObject: shopTransformed = {};
    const {
      TBVendor_ID,
      VDVendorEmail,
      VDFrontDescription,
      VDVendorURL,
      OSminOrderAMT,
      VDStorePolicy,
      SEOTitle,
      SEODescription,
      VDName,
      VDMadeIn,
      VDPhone,
      VDReturnPolicy,
    } = object;
    shopObject['id'] = TBVendor_ID?.toString();
    shopObject['name'] = `${VDName?.toString()}`;
    shopObject['phoneNumber'] = this.shopPhoneNumberTransformer(VDPhone);
    shopObject['description'] = VDFrontDescription?.toString();
    shopObject['seo_description'] = SEODescription?.toString();
    shopObject['seo_title'] = SEOTitle?.toString();
    shopObject['email'] = `${VDVendorEmail}`;
    shopObject['url'] = `${this.shopUrlTransformer(VDVendorURL, VDName)}`;
    shopObject['minOrder'] = OSminOrderAMT?.toString();
    shopObject['storePolicy'] = VDStorePolicy?.toString()
      .replace(/[\r\n]/gm, '')
      .replace(/"/g, "'");
    shopObject['madeIn'] = VDMadeIn?.toString();
    shopObject['returnPolicy'] = VDReturnPolicy?.toString()
      .replace(/[\r\n]/gm, '')
      .replace(/"/g, "'");
    return shopObject;
  }

  public shopEmailTransformer(@Param() email, name) {
    if (email.length) {
      return email;
    }
    const emailTransformed = name.replace(/ /g, '_');
    return `${emailTransformed.toLowerCase()}@gmail.com`;
  }

  public shopUrlTransformer(@Param() url, name) {
    if (url.length) {
      return url;
    }
    return `${name.toLowerCase()}.com`;
  }

  public shopPhoneNumberTransformer(@Param() phoneNumber) {
    const phone = phoneNumber.split(',')[0];
    phone.split('/')[0];
    phone.split('TEXT ONLY')[1];
    const isEmail = /\.COM/;
    if (isEmail.test(phoneNumber)) {
      return '1234';
    }
    return `+1${phone.replace(/-/g, '')}`;
  }
}
