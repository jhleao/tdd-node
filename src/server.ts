import app from '@src/app';
import { createConnection, getConnectionOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

const PORT = process.env.PORT || 3000;

getConnectionOptions(process.env.NODE_ENV)
  .then((opts) => createConnection({ ...opts, name: 'default', namingStrategy: new SnakeNamingStrategy() })
    .then(() => {
      console.log('Database connected!');
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    }));
