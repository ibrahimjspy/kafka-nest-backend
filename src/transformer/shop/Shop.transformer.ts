import { Injectable, Param } from '@nestjs/common';
import { S3_VENDOR_URL } from 'common.env';
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
    } = object;
    shopObject['id'] = TBVendor_ID?.toString();
    shopObject['name'] = `${VDName?.toString()}`;
    shopObject['phoneNumber'] = this.shopPhoneNumberTransformer(VDPhone);
    shopObject['description'] = OSDescription
      ? this.textTransformer(OSDescription)
      : '';
    shopObject['seo_description'] = SEODescription || '';
    shopObject['seo_title'] = SEOTitle || '';
    shopObject['email'] = `${VDVendorEmail}`;
    shopObject['url'] = `${this.shopUrlTransformer(VDVendorURL, VDName)}`;
    shopObject['minOrder'] = VDMinimumOrderAmount || '0';
    shopObject['banners'] = this.shopBannerTransformer(object);
    shopObject['vendorMainImage'] =
      this.shopImageTransformer(Brand_Rep_Image) || '';
    shopObject['storePolicy'] = VDStorePolicy
      ? this.textTransformer(VDStorePolicy)
      : '';
    shopObject['madeIn'] = VDMadeIn || '';
    shopObject['returnPolicy'] = VDReturnPolicy
      ? this.textTransformer(VDReturnPolicy)
      : '';
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
}
