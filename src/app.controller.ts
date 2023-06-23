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
  private readonly logger = new Logger(AppService.name);

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

  @MessagePattern('healthCheck') // topic name
  healthCheck() {
    Logger.verbose('kafka healthCheck');
    return 'service running';
  }

  @MessagePattern(TB_STYLE_NO_TOPIC_NAME)
  async tbStyleNoMessage(@Payload() message) {
    try {
      this.logger.log(
        'Kafka message for product sync received',
        message.payload.TBItem_ID,
      );
      this.appService.handleProductCDC(message);
      return 'Added bulk products for listing update';
    } catch (error) {
      Logger.error(error);
    }
  }
}
