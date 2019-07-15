import { Table } from 'typeorm';
import { TABLE_NAME as FILE_TABLE_NAME } from '../entities/file';

/**
 * https://github.com/typeorm/typeorm/blob/master/docs/migrations.md
 * https://github.com/typeorm/typeorm/blob/master/src/driver/types/ColumnTypes.ts
 */
class Seed1561817377602 {
    async up(queryRunner) {
        await queryRunner.createTable(
            new Table({
                name: FILE_TABLE_NAME,
                columns: [
                    {
                        name: 'id',
                        type: 'integer',
                        isNullable: false,
                        isGenerated: true,
                        isPrimary: true,
                        isUnique: true,
                        isArray: false,
                        length: '',
                        zerofill: false,
                        unsigned: true,
                        generated: 'increment',
                    },
                    {
                        name: 'url',
                        type: 'varchar',
                        isNullable: false,
                        isGenerated: false,
                        isPrimary: false,
                        isUnique: false,
                        isArray: false,
                        length: '300',
                        zerofill: false,
                    },
                    {
                        name: 'mime',
                        type: 'varchar',
                        isNullable: false,
                        isGenerated: false,
                        isPrimary: false,
                        isUnique: false,
                        isArray: false,
                        length: '50',
                        zerofill: false,
                    },
                    {
                        name: 'placeholder',
                        type: 'bytea',
                        isNullable: true,
                        isGenerated: false,
                        isPrimary: false,
                        isUnique: false,
                        isArray: false,
                        length: '',
                        zerofill: false,
                    },
                ],
            }),
            true,
        );

        logger.info('🌱 Seed migration applied');
    }

    async down(queryRunner) {
    }
}

export default Seed1561817377602;
