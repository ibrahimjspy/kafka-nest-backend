import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @MessagePattern('products') // topic name
  productCDC(@Payload() message) {
    // console.log(message.payload.after);
    return this.appService.handleProductCDC(message.payload);
  }
  @MessagePattern('category_master') // topic name
  masterCategoryCDC(@Payload() message) {
    // console.log(message.payload);
    return this.appService.handleMasterCategoryCDC(message.payload);
  }
  @MessagePattern('category_sub') // topic name
  subCategoryCDC(@Payload() message) {
    return this.appService.handleSubCategoryCDC(message.payload);
  }
  @MessagePattern('color_select') // topic name
  handleProductUpdate(@Payload() message) {
    // console.log(message.payload);
    return this.appService.handleProductCDC(message.value);
  }
  @MessagePattern('vendor') // topic name
  handleVendorUpdate(@Payload() message) {
    // console.log(message.payload.after);
    return this.appService.handleShopCDC(message.payload);
  }
  @MessagePattern('healthCheck') // topic name
  healthCheck() {
    return 'service running';
  }
}
