import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'bundle.bundle_bundle' })
export class Bundle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamptz' })
  created_at: Date;

  @Column({ type: 'timestamptz' })
  updated_at: Date;

  @Column({ type: 'boolean' })
  is_deleted: boolean;

  @Column({ type: 'jsonb', nullable: true })
  private_metadata: object;

  @Column({ type: 'jsonb', nullable: true })
  metadata: object;

  @Column({ type: 'varchar', length: 250 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 250 })
  slug: string;

  @Column({ type: 'varchar', length: 250, nullable: true })
  shop_id: string;

  @Column({ type: 'float8' })
  price: number;

  @Column({ type: 'varchar', length: 30 })
  currency: string;
}

@Entity({ name: 'bundle.bundle_openbundle' })
export class OpenBundle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamptz' })
  created_at: Date;

  @Column({ type: 'timestamptz' })
  updated_at: Date;

  @Column({ type: 'boolean' })
  is_deleted: boolean;

  @Column({ type: 'jsonb', nullable: true })
  metadata: object;

  @Column({ type: 'jsonb', nullable: true })
  private_metadata: object;

  @Column({ type: 'varchar', length: 250 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 250 })
  slug: string;

  @Column({ type: 'varchar', length: 250, nullable: true })
  shop_id: string;

  @Column({ type: 'float8' })
  price: number;

  @Column({ type: 'varchar', length: 30 })
  currency: string;
}
