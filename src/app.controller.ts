import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('product') // topic name
  addProduct(@Payload() message) {
    console.log(message);
    return this.appService.addProductCatalog(message);
  }
  @MessagePattern('seo_description') // topic name
  addSeoDescription(@Payload() message) {
    console.log(message);
    return this.appService;
  }
}
