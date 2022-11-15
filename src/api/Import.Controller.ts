import { Controller, Get } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { fetchBulkProductsData, fetchBulkVendors } from 'src/mssql/import';

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
    const data: any = await fetchBulkProductsData();
    await this.appService.productBulkCreate(data.slice(8500, 9000));
    return `${data.length} products created`;
  }

  @Get('shops')
  async createShops() {
    const data: any = await fetchBulkVendors();
    await this.appService.ShopBulkCreate(data.slice(180, 186));
    return `${data.length} shops created`;
  }
}
