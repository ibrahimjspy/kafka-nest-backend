import { Injectable, Logger, Param } from '@nestjs/common';
import { ADMIN_EMAIL, S3_VENDOR_URL } from '../../../common.env';
import {
  shippingZoneTransformedDto,
  shippingZoneDto,
  shopDto,
  shopTransformed,
  shopSettingsDto,
  vendorSettingsEnum,
  SharoveTypeEnum,
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
      SharoveType,
      OSFulfillmentType,
      VendorFlatShipping,
    } = object;
    const vendorSettings = await this.getVendorSettings(TBVendor_ID);
    Logger.log('vendor settings', vendorSettings);
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
      sizeChartName: vendorSettings.sizeChartName,
      returnPolicyPlain: vendorSettings.returnPolicyPlain,
      type: SharoveType as SharoveTypeEnum,
      flat: OSFulfillmentType ? true : false,
      ownFlat: VendorFlatShipping ? true : false,
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
    // Replace line breaks with escaped characters
    // eslint-disable-next-line prettier/prettier
    const escapedStr = description.replace(/\n/g, "\\n").replace(/\r/g, "\\r");

    // Convert the string to JSON format
    const jsonStr = JSON.stringify(escapedStr);

    // Remove the surrounding double quotes
    return jsonStr.slice(1, -1);
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
      returnPolicyPlain: string;
      returnPolicy: string;
      sizeChart: string;
      sizeChartName?: string;
    } = { returnPolicy: '', sizeChart: '', returnPolicyPlain: '' };
    vendorSettings.map((vendorSetting) => {
      if (vendorSetting.Type == vendorSettingsEnum.RETURN_POLICY) {
        vendorDetails.returnPolicy = this.returnPolicyTransformer(
          vendorSetting.Content,
        );
        vendorDetails.returnPolicyPlain = this.returnPolicyPlainTransformer(
          vendorSetting.Content,
        );
      }
      if (vendorSetting.Type == vendorSettingsEnum.SIZE_CHART) {
        const { table, sizeChartName } = this.sizeChartTransformer(
          vendorSetting.Content,
        );
        vendorDetails.sizeChart = table;
        vendorDetails.sizeChartName = sizeChartName;
      }
    });
    Logger.log('VendorSettings', vendorDetails);
    return vendorDetails;
  }

  private sizeChartTransformer(@Param() content: string) {
    const parsed = JSON.parse(content);

    if (parsed) {
      const tables = [];
      const tableNames = [];
      parsed.map((entry) => {
        tables.push(entry.table);
        tableNames.push(entry.name);
      });
      return {
        table: JSON.stringify(tables),
        sizeChartName: JSON.stringify(tableNames),
      };
    }
    return { table: '', sizeChartName: '' };
  }

  private returnPolicyTransformer(@Param() content: string) {
    const parsed = JSON.parse(content);
    const returnPolicy = parsed.return_policy;
    return this.textTransformer(returnPolicy);
  }

  private returnPolicyPlainTransformer(@Param() content: string) {
    const parsed = JSON.parse(content);
    const returnPolicy = parsed.return_policy;
    // eslint-disable-next-line prettier/prettier
    return returnPolicy.replace(/\s+/g, ' ').replace(/"/g, "'").replace(/\r?\n/g, "\n")
  }
}
