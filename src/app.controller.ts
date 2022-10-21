import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @MessagePattern('products') // topic name
  productCDC(@Payload() message) {
    // Logger.log(message.payload.after);
    return this.appService.handleProductCDC(message.payload);
  }
  @MessagePattern('category_master') // topic name
  masterCategoryCDC(@Payload() message) {
    return this.appService.handleMasterCategoryCDC(message.payload);
  }
  @MessagePattern('category_sub') // topic name
  subCategoryCDC(@Payload() message) {
    return this.appService.handleSubCategoryCDC(message.payload);
  }
  @MessagePattern('color_select') // topic name
  handleProductUpdate(@Payload() message) {
    return this.appService.handleSelectColorCDC(message.payload);
  }
  @MessagePattern('vendor') // topic name
  handleVendorUpdate(@Payload() message) {
    return this.appService.handleShopCDC(message.payload);
  }
  @MessagePattern('healthCheck') // topic name
  healthCheck() {
    return 'service running';
  }
}
