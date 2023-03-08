import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { setupEnvironment } from '@deuna/node-environments-lib';

export type ConnectionOptions = PostgresConnectionOptions &
  TypeOrmModuleOptions & { seeds: string[] };

export const userConfig = async (sync = false): Promise<ConnectionOptions> => {
  await setupEnvironment();
  const base: ConnectionOptions = {
    type: 'postgres',
    name: 'bo-mc-client-db',
    host: process.env.TYPEORM_HOST.toString(),
    port: parseInt(process.env.TYPEORM_PORT, 10),
    username: process.env.TYPEORM_USERNAME.toString(),
    password: process.env.TYPEORM_PASSWORD.toString(),
    database: process.env.TYPEORM_DATABASE.toString(),
    synchronize: sync,
    logging: true,
    entities: [__dirname + '/../db/**/*.entity.[tj]s'],
    migrations: [__dirname + '/../db/migration/**/*.[tj]s'],
    seeds: [__dirname + '/../db/seeds/**/*.[tj]s'],
    cli: {
      migrationsDir: __dirname + '/../db/migration',
    },
    ssl: process.env.DB_SSL_ENABLED.toString() === 'true' ? true : false,
    extra:
      process.env.DB_SSL_ENABLED.toString() === 'true'
        ? {
            ssl: {
              rejectUnauthorized: false,
            },
          }
        : {},
    keepConnectionAlive: true,
  };
  return base;
};
export const config = userConfig();
export const configSync = userConfig(true);
