import { Injectable } from '@nestjs/common';
import { TransformerService } from 'src/transformer/Transformer.service';
import { retailerDTO } from 'src/transformer/types/retailer';
import { UserService } from '../user/User.Service';
@Injectable()
export class RetailerService {
  constructor(
    private readonly transformerService: TransformerService,
    private readonly userService: UserService,
  ) {}
  public async retailerCreate(customer: retailerDTO) {
    const retailerData = this.transformerService.retailerTransformer(customer);
    await this.userService.create(retailerData);
    await this.userService.addRetailerToGroups(retailerData);

    return;
  }

  public async retailerDelete(customer: retailerDTO) {
    const retailerData = this.transformerService.retailerTransformer(customer);
    await this.userService.delete(retailerData);

    return;
  }
}
