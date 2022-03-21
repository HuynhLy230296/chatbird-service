import * as dotenv from 'dotenv';
import * as path from 'path';
import EnvironmentUtils from './utils/envUtils';
import Utils from './utils';

dotenv.config({
  path: path.join(process.cwd(), `.env${process.env.NODE_ENV === 'test' ? '.test' : ''}`),
});

/**
 * Environment variables
 */
export const env = {
  node: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
  isDevelopment: process.env.NODE_ENV === 'development',
  app: {
    name: EnvironmentUtils.getOsEnv('APP_NAME'),
    host: EnvironmentUtils.getOsEnv('APP_HOST'),
    version: EnvironmentUtils.getOsEnv('VERSION'),
    routePrefix: EnvironmentUtils.getOsEnv('APP_ROUTE_PREFIX'),
    port: EnvironmentUtils.normalizePort(process.env.PORT || EnvironmentUtils.getOsEnv('APP_PORT')),
  },
  log: {
    level: EnvironmentUtils.getOsEnv('LOG_LEVEL'),
    output: EnvironmentUtils.getOsEnv('LOG_OUTPUT'),
  },
  swagger: {
    enabled: Utils.toBool(EnvironmentUtils.getOsEnv('SWAGGER_ENABLED')),
    route: EnvironmentUtils.getOsEnv('SWAGGER_ROUTE'),
    username: EnvironmentUtils.getOsEnv('SWAGGER_USERNAME'),
    password: EnvironmentUtils.getOsEnv('SWAGGER_PASSWORD'),
  },
};
