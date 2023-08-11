import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'saleor.product_productvariantchannellisting' })
export class ProductProductVariantChannelListing {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  currency: string;

  @Column({ nullable: true, type: 'numeric', precision: 12, scale: 3 })
  price_amount: number;

  @Column({ nullable: false })
  channel_id: number;

  @Column({ nullable: false })
  variant_id: number;

  @Column({ nullable: true, type: 'numeric', precision: 12, scale: 3 })
  cost_price_amount: number;

  @Column({ nullable: true })
  preorder_quantity_threshold: number;
}
