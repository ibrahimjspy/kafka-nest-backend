import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @MessagePattern('products') // topic name
  addProductTest(@Payload() message) {
    // const king = JSON.parse(message);
    console.log(message.payload.after);
    // Logger.log(king.payload);
    // return this.appService.handleProductCDC(message);
  }
  @MessagePattern('seo_description') // topic name
  addSeoDescription(@Payload() message) {
    Logger.log(message);
    return this.appService.addProductCatalog(message);
  }
  @MessagePattern('product_media') // topic name
  addProductMedia(@Payload() message) {
    const king = JSON.parse(message);
    Logger.log(king);
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
