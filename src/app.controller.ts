/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Get } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { fetchBulkProductsData } from './database/mssql/bulk-import/methods';
import { Logger } from '@nestjs/common';
import { ProductService } from './services/product/Product.Service';
import { TB_STYLE_NO_TOPIC_NAME } from 'common.env';
import { ProductOperationEnum } from './api/import.dtos';
import { productDto } from './transformer/types/product';
import { ShopService } from './services/shop/Shop.Service';
import { fetchStyleDetailsById } from './database/mssql/api_methods/getProductById';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly productService: ProductService,
    private readonly shopService: ShopService,
  ) {}
  @MessagePattern('products') // topic name
  async productCdc(@Payload() message) {
    // Logger.log(message.payload.after);
    return this.appService.handleProductCDC(message.payload);
  }

  @MessagePattern('category_master') // topic name
  masterCategoryCdc(@Payload() message) {
    return this.appService.handleMasterCategoryCDC(message.payload);
  }

  @MessagePattern('category_sub') // topic name
  async subCategoryCdc(@Payload() message) {
    return this.appService.handleSubCategoryCDC(message.payload);
  }

  @MessagePattern('color_select') // topic name
  colorSelectCdc(@Payload() message) {
    return this.appService.handleSelectColorCDC(message.payload);
  }

  @MessagePattern('vendor') // topic name
  vendorCdc(@Payload() message) {
    return this.appService.handleShopCDC(message.payload);
  }

  @MessagePattern('healthCheck') // topic name
  healthCheck() {
    Logger.verbose('kafka healthCheck');
    return 'service running';
  }

  @MessagePattern(TB_STYLE_NO_TOPIC_NAME)
  async tbStyleNoMessage(@Payload() message) {
    try {
      const payload = message.payload as productDto;
      Logger.log('kafka tb style number event received', payload);
      const validateVendor = await this.shopService.validateSharoveVendor(
        payload.TBVendor_ID,
      );
      if (!validateVendor) return;
      const productPayload = message.payload as productDto;
      const sourceProductDetails = (await fetchStyleDetailsById(
        productPayload.TBItem_ID,
      )) as productDto;
      return await this.productService.handleProductCDC(
        sourceProductDetails,
        ProductOperationEnum.SYNC,
      );
    } catch (error) {
      Logger.error(error);
    }
  }
}
