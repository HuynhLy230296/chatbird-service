export interface RoomResponse {
  id: string
  title: string
  users: UserResponse[]
}
export interface UserResponse {
  id: string
  email: string
  loginProvider: string
  name: string
  picture: string
  rooms: String[]
}
export interface FriendResponse {
  id: string
  picture: string
  name: string
}
