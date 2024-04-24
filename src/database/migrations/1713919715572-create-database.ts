import {MigrationInterface, QueryRunner} from 'typeorm';

export class CreateDatabase1713919715572 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.createDatabase('authenticate');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.dropDatabase('authenticate');
  }
}
