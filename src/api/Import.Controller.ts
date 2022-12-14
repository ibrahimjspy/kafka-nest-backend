import { Controller, Get } from '@nestjs/common';
import { AppService } from 'src/app.service';
import {
  fetchBulkProductsData,
  fetchBulkShippingMethods,
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
    await this.appService.productBulkCreate(data.slice(2, 3));
    return `${data.length} products created`;
  }

  @Get('shops')
  async createShops() {
    const data: any = await fetchBulkVendors();
    await this.appService.shopBulkCreate(data.slice(180, 181));
    return `${data.length} shops created`;
  }

  @Get('shipping')
  async createShipping() {
    const data: any = await fetchBulkShippingMethods();
    this.appService.shippingMethodBulkCreate(data);
    return `${data.length} shops created`;
  }
}
