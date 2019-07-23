import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * https://github.com/typeorm/typeorm/blob/master/docs/migrations.md
 * https://github.com/typeorm/typeorm/blob/master/src/driver/types/ColumnTypes.ts
 */
class Seed1561817377602 implements MigrationInterface {
    async up(queryRunner: QueryRunner) {
        await queryRunner.connection.synchronize(true);

        logger.info('🌱 Seed migration applied');
    }

    async down() {}
}

export default Seed1561817377602;
