/**
 * https://github.com/typeorm/typeorm/blob/master/docs/entities.md
 */

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export const TABLE_NAME = 'demo_model';

@Entity({ name: TABLE_NAME })
export class DemoModel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 300, nullable: false })
    url: string;

    @Column({ type: 'varchar', length: 50, nullable: false })
    mime: string;

    @Column({ type: 'bytea' })
    placeholder: string;
}
