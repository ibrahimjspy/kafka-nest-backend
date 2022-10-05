import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @MessagePattern('products') // topic name
  addProductTest(@Payload() message) {
    // console.log(message.payload.after);
    return this.appService.handleProductCDC(message);
  }
  @MessagePattern('category_master') // topic name
  addSeoDescription(@Payload() message) {
    // Logger.log(message);
    return this.appService.addProductCatalog(message);
  }
  @MessagePattern('category_sub') // topic name
  addProductMedia(@Payload() message) {
    console.log(message.payload.after);
    return this.appService.addProductCatalog(message);
  }
  @MessagePattern('TBStyleNo') // topic name
  handleProductUpdate(@Payload() message) {
    Logger.log(message);
    return this.appService.handleProductCDC(message.value);
  }
  @MessagePattern('healthCheck') // topic name
  healthCheck() {
    return 'service running';
  }
}
