import { Injectable, Param } from '@nestjs/common';
import { S3_VENDOR_URL } from '../../../common.env';
import {
  shippingZoneTransformedDto,
  shippingZoneDto,
  shopDto,
  shopTransformed,
} from 'src/transformer/types/shop';
import { brandPickupZoneMapping } from './Shop.transformer.utils';
/**
 *  Injectable class handling shop transformation\
 *  @requires Injectable in app scope or in kafka connection to reach kafka messages
 */
@Injectable()
export class ShopTransformerService {
  /**
   * Transforms and validates shop responses and existence.
   *
   * @param {shopDto} object - Composite object containing cdc changeData, categoryMaster data.
   * @returns {Promise<shopTransformed>} - Transformed object.
   */
  public async shopTransformerMethod(
    object: shopDto,
  ): Promise<shopTransformed> {
    const {
      TBVendor_ID,
      VDVendorEmail,
      OSDescription,
      VDVendorURL,
      VDMinimumOrderAmount,
      VDStorePolicy,
      SEOTitle,
      SEODescription,
      VDName,
      VDMadeIn,
      VDPhone,
      VDReturnPolicy,
      Brand_Rep_Image,
      ShippedFrom,
    } = object;

    /**
     * Transformed shop object.
     *
     * @type {shopTransformed}
     */
    const shopObject: shopTransformed = {
      id: TBVendor_ID?.toString(),
      name: VDName?.toString(),
      phoneNumber: this.shopPhoneNumberTransformer(VDPhone),
      description: OSDescription ? this.textTransformer(OSDescription) : '',
      seo_description: SEODescription || '',
      seo_title: SEOTitle || '',
      email: `${VDVendorEmail}`,
      url: `${this.shopUrlTransformer(VDVendorURL, VDName)}`,
      minOrder: VDMinimumOrderAmount || '0',
      banners: this.shopBannerTransformer(object),
      vendorMainImage: this.shopImageTransformer(Brand_Rep_Image) || '',
      storePolicy: VDStorePolicy ? this.textTransformer(VDStorePolicy) : '',
      madeIn: VDMadeIn || '',
      returnPolicy: VDReturnPolicy ? this.textTransformer(VDReturnPolicy) : '',
      shippedFrom: ShippedFrom,
    };

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

  public textTransformer(@Param() description: string) {
    return description.replace(/(\r\n|\n|\r)/gm, '').replace(/"/g, "'");
  }

  /**
   * Transforms the shop phone number.
   *
   * @param {string} phoneNumber - The phone number to transform.
   * @returns {string} - The transformed phone number.
   */
  public shopPhoneNumberTransformer(phoneNumber: string): string {
    const phone = phoneNumber.split(',')[0];
    const isEmail = /\.COM/;

    if (isEmail.test(phoneNumber)) {
      return '1234';
    }

    return `+1${phone.replace(/-/g, '')}`;
  }

  public shopBannerTransformer(@Param() shopObject: shopDto): string[] {
    const bannersArray = [];
    for (let i = 1; i < 8; i++) {
      shopObject[`BannerImg${i}`]
        ? bannersArray.push(
            this.shopImageTransformer(shopObject[`BannerImg${i}`]),
          )
        : '';
    }
    return bannersArray;
  }

  /**
   * this takes url and returns a url which is s3 image url of source, this helps us in frontend integration with shop service, especially in case of media mapping
   * @param url -> valid image url
   * @returns image url which could be integrated
   */
  public shopImageTransformer(@Param() url) {
    if (url.length) {
      return `${S3_VENDOR_URL}${url}`;
    }
  }

  public shopShippingZoneTransformer(
    @Param() shopObject: shippingZoneDto,
  ): shippingZoneTransformedDto {
    const shippingZoneData = {};
    shippingZoneData['shopId'] = shopObject.TBVendor_ID;
    shippingZoneData['zoneId'] =
      brandPickupZoneMapping[shopObject.Content] || '8';
    return shippingZoneData;
  }
}
