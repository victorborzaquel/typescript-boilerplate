import {randomUUID} from 'crypto';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
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

@Entity('employee')
export class Employee extends BaseEntity {
  @PrimaryGeneratedColumn('uuid') readonly id!: string;
  @CreateDateColumn({name: 'created_at'}) readonly createdAt!: Date;
  @UpdateDateColumn({name: 'updated_at'}) updatedAt!: Date;
  @Column({unique: true, type: 'varchar'}) readonly number!: string;
  @Column({name: 'dn', type: 'nvarchar'})
  dn!: string;
  @Column({
    name: 'full_name',
    nullable: true,
    type: 'nvarchar',
  })
  fullName!: string | null;
  @Column({
    name: 'given_name',
    nullable: true,
    type: 'nvarchar',
  })
  givenName!: string | null;

  constructor(props: EmployeeProps) {
    super();
    if (props) {
      this.id = props.id ?? randomUUID();
      this.createdAt = props.createdAt ?? new Date();
      this.updatedAt = props.updatedAt ?? new Date();
      this.number = props.number;
      this.dn = props.dn;
      this.fullName = props.fullName ?? null;
      this.givenName = props.givenName ?? null;
    }
  }

  changeDn(dn: string) {
    this.dn = dn;
    this.updatedAt = new Date();
  }

  changeFullName(fullName: string) {
    this.fullName = fullName;
    this.updatedAt = new Date();
  }

  changeGivenName(givenName: string) {
    this.givenName = givenName;
    this.updatedAt = new Date();
  }
}
