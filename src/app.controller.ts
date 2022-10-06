import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @MessagePattern('products') // topic name
  productCDC(@Payload() message) {
    // console.log(message.payload.after);
    return this.appService.handleProductCDC(message.payload.after);
  }
  @MessagePattern('category_master') // topic name
  masterCategoryCDC(@Payload() message) {
    // Logger.log(message);
    return this.appService.handleMasterCategoryCDC(message.payload.after);
  }
  @MessagePattern('category_sub') // topic name
  subCategoryCDC(@Payload() message) {
    return this.appService.handleSubCategoryCDC(message.payload.after);
  }
  @MessagePattern('TBStyleNo') // topic name
  handleProductUpdate(@Payload() message) {
    // Logger.log(message);
    return this.appService.handleProductCDC(message.value);
  }
  @MessagePattern('healthCheck') // topic name
  healthCheck() {
    return 'service running';
  }
}
