export default class User {
  id?: string
  email: string
  loginProvider: string
  name: string
  picture: string
  rooms?: Array<string>
  friends?: Array<string>
}
