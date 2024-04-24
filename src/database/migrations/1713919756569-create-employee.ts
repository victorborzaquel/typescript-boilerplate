import {MigrationInterface, QueryRunner, Table} from 'typeorm';

export class CreateEmployee1713919756569 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.createTable(
      new Table({
        name: 'employee',
        columns: [
          {
            name: 'id',
            type: 'uniqueidentifier',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {name: 'created_at', type: 'datetime2', default: 'GETDATE()'},
          {
            name: 'updated_at',
            type: 'datetime2',
            default: 'GETDATE()',
            onUpdate: 'GETDATE()',
          },
          {name: 'number', type: 'varchar', isUnique: true},
          {name: 'dn', type: 'nvarchar'},
          {name: 'full_name', type: 'nvarchar', isNullable: true},
          {name: 'given_name', type: 'nvarchar', isNullable: true},
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
