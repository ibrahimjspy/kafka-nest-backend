import { Controller, Get } from '@nestjs/common';
import { AppService } from 'src/app.service';
import {
  fetchBulkProductsData,
  fetchBulkVendors,
} from 'src/database/mssql/bulk-import/methods';

// endpoints to trigger data bulk imports
@Controller()
export class BulkImportController {
  constructor(private readonly appService: AppService) {}
  @Get()
  async app() {
    return 'kafka client service running';
  }

  @Get('products')
  async createProducts() {
    const data: any = await fetchBulkProductsData();
    await this.appService.productBulkCreate(data.slice(850, 855));
    return `${data.length} products created`;
  }

  @Get('shops')
  async createShops() {
    const data: any = await fetchBulkVendors();
    await this.appService.ShopBulkCreate(data.slice(180, 186));
    return `${data.length} shops created`;
  }
}
