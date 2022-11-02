/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { getBulkProductsData } from './mssql/import/tbStyleNo.fetch';
import { getBulkVendors } from './mssql/import/tbVendor.fetch';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
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
  @MessagePattern('product_bulk_create') // topic name
  async productBulkCreate(@Payload() message) {
    const data = await getBulkVendors();
    console.log(data.length);
    // await this.appService.productBulkCreate(data.slice(37, 38));
    await this.appService.ShopBulkCreate(data);
  }
  @MessagePattern('healthCheck') // topic name
  healthCheck() {
    return 'service running';
  }
}
