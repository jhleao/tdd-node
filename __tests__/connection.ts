import { createConnection, getConnection, getConnectionOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

const connection = {
  async create() {
    const opts = await getConnectionOptions(process.env.NODE_ENV);
    await createConnection({ ...opts, name: 'default', namingStrategy: new SnakeNamingStrategy() });
  },

  async close() {
    await getConnection().close();
  },

  async clear() {
    const conn = getConnection();
    const entities = conn.entityMetadatas;

    try {
      await Promise.all(entities.map(async (entity) => {
        const repository = conn.getRepository(entity.name);
        await repository.query(`DELETE FROM "${entity.tableName}"`);
      }));
    } catch (e) {
      console.log({ error: e });
    }
  },
};
export default connection;
