import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import {
  setupEnvironment,
  setupEnvironmentSync,
} from '@deuna/node-environments-lib';

export type ConnectionOptions = PostgresConnectionOptions &
  TypeOrmModuleOptions & { seeds: string[] };

export const cloudConfiguration = async (
  migrate = false,
): Promise<ConnectionOptions> => {
  await setupEnvironment();
  return getConnectionData(migrate);
};

const localConfiguration = (): ConnectionOptions => {
  setupEnvironmentSync();
  return getConnectionData(true);
};

const getConnectionData = (migrate = false): ConnectionOptions => {
  return {
    type: 'postgres',
    name: 'bo-mc-tasks-db',
    host: process.env.TYPEORM_HOST.toString(),
    port: parseInt(process.env.TYPEORM_PORT.toString(), 10),
    username: process.env.TYPEORM_USERNAME.toString(),
    password: process.env.TYPEORM_PASSWORD.toString(),
    database: process.env.TYPEORM_DATABASE.toString(),
    synchronize: false,
    migrationsRun: migrate,
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
};

export const config = cloudConfiguration();
export const configSync = cloudConfiguration(true);
export const localConfig = localConfiguration();
