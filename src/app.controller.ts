import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from "@nestjs/microservices";
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @MessagePattern('product_create') // Our topic name
  addProduct(@Payload() message) {
    console.log(message.value);
    return this.appService.addProduct(message.value)
  }
}
