export default class TokenUtil {
  static getTokenString = (token: string): Array<any> => {
    const [schema, tokenValue] = token?.split(' ') || []
    return [schema, tokenValue]
  }
}
