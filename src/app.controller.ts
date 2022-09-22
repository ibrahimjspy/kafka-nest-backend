import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { ProductService } from './services/Product';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly productService: ProductService,
  ) {}
  @MessagePattern('product') // topic name
  addProductTest(@Payload() message) {
    return this.appService.addProductCatalog(message);
  }
  @MessagePattern('seo_description') // topic name
  addSeoDescription(@Payload() message) {
    // console.log(message);
    return this.appService.addProductCatalog(message);
  }
  @MessagePattern('product_media') // topic name
  addProductMedia(@Payload() message) {
    // console.log(message);
    return this.appService.addProductCatalog(message);
  }
  @MessagePattern('TBStyleNo') // topic name
  handleProductUpdate(@Payload() message) {
    // console.log(message);
    return this.productService.handleProductChange(message.value);
  }
}
