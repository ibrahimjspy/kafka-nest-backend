/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Get } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { fetchBulkProductsData, fetchBulkVendors } from './mssql/import';
import { Logger } from '@nestjs/common';

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
    const data: any = await fetchBulkProductsData();
    await this.appService.productBulkCreate(data.slice(850, 855));
    return `${data.length} products created`;
  }

  @MessagePattern('shop_bulk_create') // topic name
  async shopBulkCreate(@Payload() message) {
    const data: any = await fetchBulkVendors();
    await this.appService.ShopBulkCreate(data.slice(180, 186));
    return `${data.length} shops created`;
  }

  @MessagePattern('healthCheck') // topic name
  healthCheck() {
    Logger.verbose('kafka healthCheck');
    return 'service running';
  }
}
