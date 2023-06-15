import { Injectable, Logger, Param } from '@nestjs/common';
import { ADMIN_EMAIL, S3_VENDOR_URL } from '../../../common.env';
import {
  shippingZoneTransformedDto,
  shippingZoneDto,
  shopDto,
  shopTransformed,
  shopSettingsDto,
  vendorSettingsEnum,
} from 'src/transformer/types/shop';
import { brandPickupZoneMapping } from './Shop.transformer.utils';
import {
  fetchVendorMinimumOrderAmount,
  fetchVendorSettings,
} from 'src/database/mssql/bulk-import/methods';
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
      VDStorePolicy,
      SEOTitle,
      SEODescription,
      VDName,
      VDMadeIn,
      VDPhone,
      Brand_Rep_Image,
      VDCity,
      VDState,
    } = object;
    const vendorSettings = await this.getVendorSettings(TBVendor_ID);
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
      email: `${this.shopEmailTransformer(VDVendorEmail, VDName)}`,
      url: `${this.shopUrlTransformer(VDVendorURL, VDName)}`,
      minOrder: await this.getMinimumOrderAmount(VDName),
      banners: this.shopBannerTransformer(object),
      vendorMainImage: this.shopImageTransformer(Brand_Rep_Image) || '',
      storePolicy: VDStorePolicy ? this.textTransformer(VDStorePolicy) : '',
      madeIn: VDMadeIn || '',
      returnPolicy: vendorSettings.returnPolicy,
      shippedFrom: `${VDCity},${VDState}`,
      sizeChart: vendorSettings.sizeChart,
    };

    return shopObject;
  }

  public shopEmailTransformer(@Param() email, name) {
    if (email == ADMIN_EMAIL) {
      const emailTransformed = name.replace(/ /g, '_');
      return `${emailTransformed.toLowerCase()}@gmail.com`;
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

  /**
   * this takes url and returns a url which is s3 image url of source, this helps us in frontend integration with shop service, especially in case of media mapping
   * @param name -> shop name -- VDName
   * @returns minimum order amount
   */
  public async getMinimumOrderAmount(@Param() name: string) {
    return await fetchVendorMinimumOrderAmount(name);
  }

  /**
   * returns vendor settings which includes size chart and return policy
   */
  private async getVendorSettings(@Param() vendorId: string) {
    const vendorSettings = await fetchVendorSettings(vendorId);
    return this.vendorSettingsTransformer(vendorSettings as shopSettingsDto[]);
  }

  private vendorSettingsTransformer(
    @Param() vendorSettings: shopSettingsDto[],
  ) {
    const vendorDetails: {
      returnPolicy: string;
      sizeChart: string;
    } = { returnPolicy: '', sizeChart: '' };
    vendorSettings.map((vendorSetting) => {
      if (vendorSetting.Type == vendorSettingsEnum.RETURN_POLICY) {
        vendorDetails.returnPolicy = this.vendorSettingsContentTransformer(
          vendorSetting.Content,
        );
      }
      if (vendorSetting.Type == vendorSettingsEnum.SIZE_CHART) {
        vendorDetails.sizeChart = this.vendorSettingsContentTransformer(
          vendorSetting.Content,
        );
      }
    });
    Logger.log('VendorSettings', vendorDetails);
    return vendorDetails;
  }

  private vendorSettingsContentTransformer(@Param() returnPolicy: string) {
    // eslint-disable-next-line prettier/prettier
    return returnPolicy.replace(/\\/g, '').replace(/"/g, "'").replace(/\\'/g, "'");
  }
}
