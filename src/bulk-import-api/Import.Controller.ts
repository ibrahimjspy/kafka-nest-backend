import { Controller, Get } from '@nestjs/common';
import { delay } from 'rxjs';
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
    await this.appService.productBulkCreate(data.slice(5100, 5150));
    await delay(5000);
    await this.appService.productBulkCreate(data.slice(5150, 5200));
    await delay(5000);
    // await this.appService.productBulkCreate(data.slice(4800, 4850));
    // await delay(5000);
    // await this.appService.productBulkCreate(data.slice(4850, 4900));
    // await delay(5000);
    // await this.appService.productBulkCreate(data.slice(4100, 2000));
    // 4750

    return `${data.length} products created`;
  }

  @Get('shops')
  async createShops() {
    const data: any = await fetchBulkVendors();
    // await this.appService.ShopBulkCreate(data.slice(180, 186));
    return `${data.length} shops created`;
  }
}
