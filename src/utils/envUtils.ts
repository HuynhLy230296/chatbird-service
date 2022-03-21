import { join } from 'path';
import Constant from './constants';

export default class EnvironmentUtils {
  static getOsEnv(key: string): string {
    if (typeof process.env[key] === 'undefined') {
      throw new Error(`Environment variable ${key} is not set.`);
    }
    return process.env[key] as string;
  }

  static getOsEnvOptional(key: string): string {
    return process?.env[key] ?? Constant.STR_EMPTY;
  }

  static getPath(path: string): string {
    return process.env.NODE_ENV === 'production'
      ? join(process.cwd(), path.replace('src/', 'dist/').slice(0, -3) + '.js')
      : join(process.cwd(), path);
  }

  static getPaths(paths: string[]): string[] {
    return paths.map((p) => this.getPath(p));
  }

  static getOsPath(key: string): string {
    return this.getPath(this.getOsEnv(key));
  }

  static getOsPaths(key: string): string[] {
    return this.getPaths(this.getOsEnvArray(key));
  }

  static getOsEnvArray(key: string, delimiter: string = ','): string[] {
    return (process?.env[key] as string).split(delimiter) || [];
  }

  static normalizePort(port: string): number | string | boolean {
    const parsedPort = parseInt(port, 10);
    if (isNaN(parsedPort)) {
      return port;
    }
    if (parsedPort >= 0) {
      return parsedPort;
    }
    return false;
  }
}
