import {randomUUID} from 'crypto';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export interface EmployeeProps {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  dn: string;
  number: string;
  fullName?: string;
  givenName?: string;
}
export class Employee extends BaseEntity {
  @PrimaryGeneratedColumn('uuid') readonly id!: string;
  @CreateDateColumn() readonly createdAt!: Date;
  @UpdateDateColumn() readonly updatedAt!: Date;
  @Column({unique: true}) readonly number!: string;
  @Column() readonly dn!: string;
  @Column() readonly fullName!: string | null;
  @Column() readonly givenName!: string | null;

  constructor(props: EmployeeProps) {
    super();
    if (props) {
      this.id = props.id ?? randomUUID();
      this.createdAt = props.createdAt ?? new Date();
      this.updatedAt = props.updatedAt ?? new Date();
      this.number = props.number;
      this.fullName = props.fullName ?? null;
      this.givenName = props.givenName ?? null;
    }
  }
}
