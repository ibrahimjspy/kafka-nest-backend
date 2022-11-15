import { Controller, Get } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { BulkImportService } from './import.service';

// endpoints to trigger data bulk imports
@Controller()
export class BulkImportController {
  constructor(
    private readonly appService: AppService,
    private readonly importService: BulkImportService,
  ) {}
  @Get()
  async app() {
    return await this.importService.healthCheck();
  }

  @Get('products')
  async createProducts() {
    return await this.importService.createBulkProducts();
  }

  @Get('shops')
  async createShops() {
    return await this.importService.createBulkShops();
  }
}
