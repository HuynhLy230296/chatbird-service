import { Injectable, Logger } from '@nestjs/common'
import useTransaction from 'src/database/hook/useTransaction'
import Room from 'src/entities/Room'
import UserRepository from 'src/repository/user.repository'
import { MessageService } from '../message/message.service'
import { RoomService } from '../room/room.service'
import { FriendResponse, UserResponse } from './user.response'

@Injectable()
export default class UserService {
  private logger: Logger = new Logger(UserService.name)
  constructor(
    private readonly userRepository: UserRepository,
    private readonly roomService: RoomService,
    private readonly messageService: MessageService
  ) {}
  public async addFriend(userID: string, friendID: string): Promise<UserResponse> {
    if (userID === friendID) {
      throw Error('Cannot add friend with myself')
    }

    const user = await this.userRepository.findUserByID(userID)
    const userFriends = user.friends || []
    if (userFriends.some((id) => id === friendID)) {
      throw Error('Had friend')
    }

    user.friends = [...(user.friends || []), friendID]
    const friend = await this.userRepository.findUserByID(friendID)
    friend.friends = [...(friend.friends || []), userID]
    await useTransaction(async () => {
      const room = {
        title: null,
        users: [userID, friendID],
      } as Partial<Room>

      const roomCreated = await this.roomService.createRoom(room)

      user.rooms = [...(user.rooms || []), roomCreated.id]
      friend.rooms = [...(friend.rooms || []), roomCreated.id]

      const promises = [
        this.userRepository.update(userID, user),
        this.userRepository.update(friendID, friend),
      ]
      return Promise.all(promises)
    })
    return this.getUserInfo(userID)
  }
  public async removeFriend(userID: string, byUserID: string): Promise<UserResponse> {
    const user = await this.userRepository.findUserByID(byUserID)
    user.friends = user.friends ? user.friends.filter((id) => userID !== id) : []
    await useTransaction(async () => {
      return this.userRepository.update(byUserID, user)
    })
    return this.getUserInfo(byUserID)
  }
  public async getRoomsByUser(userID: string): Promise<any> {
    const user = await this.userRepository.findUserByID(userID)
    const promises = user.rooms?.map(async (roomID: string) => {
      const { messages } = await this.messageService.getLastMessages(roomID)

      const roomInfo = await this.roomService.getRoomInfo(roomID)
      const lastMessage = messages[messages.length - 1] || null
      return {
        id: roomInfo.id,
        title: roomInfo.title,
        members: roomInfo.users,
        message: lastMessage,
      }
    })
    const messages = await Promise.all(promises)
    return messages
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
    }
  }
  public async getFriends(userID: string): Promise<FriendResponse[]> {
    const user = await this.userRepository.findUserByID(userID)
    const promises = user.friends.map(async (id: string) => {
      const user = await this.userRepository.findUserByID(id)
      return {
        id: user.id,
        picture: user.picture,
        name: user.name,
      }
    })
    const users = await Promise.all(promises)
    return users
  }
  public async getUsersWithoutFriend(
    userID: string,
    offset: number
  ): Promise<Partial<UserResponse>[]> {
    if (Number.isInteger(offset)) {
      throw Error('ofset field must type integer')
    }
    if (offset <= 0) {
      throw Error('ofset field must > 0')
    }
    const users = (await this.userRepository.getAll(userID, offset)) || []
    return users?.map((o) => ({
      id: o.id,
      picture: o.picture,
      name: o.name,
      email: o.email,
    }))
  }
}
