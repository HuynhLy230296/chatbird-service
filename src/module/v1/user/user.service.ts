import { Injectable } from '@nestjs/common'
import useTransaction from 'src/database/hook/useTransaction'
import UserRepository from 'src/repository/user.repository'
import { UserResponse } from './user.response'

@Injectable()
export default class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  public async addFriend(userID: string, byUserID: string): Promise<UserResponse> {
    const user = await this.userRepository.findUserByID(byUserID)
    user.friends = [...(user.friends || []), userID]
    user.friends = [...new Set(user.friends)]
    await useTransaction(async () => {
      return this.userRepository.update(byUserID, user)
    })
    return this.getUserInfo(byUserID)
  }
  public async removeFriend(userID: string, byUserID: string): Promise<UserResponse> {
    const user = await this.userRepository.findUserByID(byUserID)
    user.friends = user.friends ? user.friends.filter((id) => userID !== id) : []
    await useTransaction(async () => {
      return this.userRepository.update(byUserID, user)
    })
    return this.getUserInfo(byUserID)
  }

  public async getRoomByUser(userID: string): Promise<String[]> {
    const user = await this.userRepository.findUserByID(userID)
    return user.rooms
  }
  public async getUserInfo(userID: string): Promise<UserResponse> {
    const user = await this.userRepository.findUserByID(userID)
    return {
      id: user.id,
      email: user.email,
      loginProvider: user.loginProvider,
      name: user.name,
      picture: user.picture,
      rooms: user.rooms,
      friends: user.friends,
    }
  }
}
