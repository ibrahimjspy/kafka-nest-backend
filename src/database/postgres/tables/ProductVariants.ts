import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'product_productvariant', schema: 'saleor' })
export class ProductProductVariant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  sku: string;

  @Column()
  name: string;

  @Column()
  product_id: number;

  @Column({ default: false })
  track_inventory: boolean;

  @Column({ nullable: true })
  weight: number;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  private_metadata: Record<string, any>;

  @Column({ nullable: true })
  sort_order: number;

  @Column({ default: false })
  is_preorder: boolean;

  @Column({ nullable: true })
  preorder_end_date: Date;

  @Column({ nullable: true })
  preorder_global_threshold: number;

  @Column({ nullable: true })
  quantity_limit_per_customer: number;

  @Column({ type: 'timestamptz' })
  created_at: Date;

  @Column({ type: 'timestamptz' })
  updated_at: Date;

  @Column({ nullable: true })
  external_reference: string;
}
