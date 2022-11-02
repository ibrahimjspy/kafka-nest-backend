import { Controller, Get } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { getBulkProductsData } from 'src/mssql/import/tbStyleNo.fetch';
import { getBulkVendors } from 'src/mssql/import/tbVendor.fetch';

// endpoints to trigger data bulk imports
@Controller()
export class BulkImportController {
  constructor(private readonly appService: AppService) {}
  @Get()
  async app() {
    return 'Application running';
  }

  @Get('products')
  async createProducts() {
    const data = await getBulkProductsData();
    await this.appService.productBulkCreate(data.slice(210, 280));
    return `${data.length} products created`;
  }

  @Get('shops')
  async createShops() {
    const data = await getBulkVendors();
    await this.appService.ShopBulkCreate(data);
    return `${data.length} products created`;
  }
}
