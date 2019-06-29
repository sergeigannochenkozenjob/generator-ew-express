import { createConnection } from 'typeorm';
import migrations from './migrations';
import entities from './entities';

export class Database {
  constructor({ url, password} = {}) {
    this.connection = null;
    this.url = url;
    this.password = password;
  }

  async connect() {
    this.connection = createConnection({
      entities,
      migrations,
      url: this.injectPassword(this.url, this.password),
      type: 'postgres',
    });
  }

  async migrate() {
    return this.getConnection().runMigrations();
  }

  injectPassword(url, password = '') {
    if (typeof password === 'string' && password.length) {
      const oUrl = new URL(url);
      oUrl.password = password;

      url = oUrl.toString();
    }

    return url;
  }

  getConnection() {
    return this.connection;
  }

  getRepository(entityName) {
    const entity = this.getEntityList()[entityName];
    if (entity) {
      return this.getConnection().getRepository(entity);
    }

    return null;
  }

  getEntityList() {
    if (!this.entityList) {
      this.entityList = entities.reduce((result, entity) => {
        return {
          ...result,
          [entity.name]: entity,
        }
      }, {});
    }

    return this.entityList;
  }
}
