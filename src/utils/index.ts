export default class Utils {
  /**
   * check value is not undefined /null or empty String or empty Array
   * @param {?String|?Array} value
   * @returns boolean
   * */
  static isTruthyValue(value: any) {
    if (typeof value === 'undefined' || value === null) {
      return false;
    }
    if (Array.isArray(value)) {
      return value.length !== 0;
    }
    if (typeof value === 'string') {
      return value.trim().length !== 0;
    }
    return true;
  }

  static toNumber(value: string): number {
    return parseInt(value);
  }

  static toBool(value: string): boolean {
    return value === 'true';
  }
}
