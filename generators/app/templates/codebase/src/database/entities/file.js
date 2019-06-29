import { EntitySchema } from 'typeorm';

export const TABLE_NAME = 'file';
export const schema = {
  name: TABLE_NAME,
  columns: {
    id: {
      primary: true,
      type: 'integer',
      generated: 'increment',
      nullable: false,
    },
    url: {
      type: 'varchar',
      length: 300,
      nullable: false,
    },
    mime: {
      type: 'varchar',
      length: 50,
      nullable: false,
    },
    placeholder: {
      type: 'bytea',
      nullable: true,
    },
  },
};
export const entity = new EntitySchema(schema);
