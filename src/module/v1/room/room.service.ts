import { Injectable } from '@nestjs/common'
import useTransaction from 'src/database/hook/useTransaction'
import Room from 'src/entities/Room'
import User from 'src/entities/User'
import RoomRepository from 'src/repository/room.repository'
import UserRepository from 'src/repository/user.repository'

import { generateUUID } from 'src/utils'
import { CreateRoomDTO, UpdateRoomDTO } from './room.dto'
@Injectable()
export class RoomService {
  constructor(
    private readonly roomRepository: RoomRepository,
    private readonly userRepository: UserRepository
  ) {}
  async getRoomInfo(roomID: string) {
    const room = await this.roomRepository.findRoomByID(roomID)

    const usersOfRoom = room.users || []
    const promises: Promise<User>[] = usersOfRoom.map((id: string) =>
      this.userRepository.findUserByID(id).catch((e) => {
        return null
      })
    )

    let users: Partial<User>[] = await Promise.all(promises)
    users = users.map((user) =>
      user
        ? ({
            id: user.id,
            name: user.name,
            picture: user.picture,
          } as Partial<User>)
        : user
    )

    return {
      id: room.id,
      title: room.title || null,
      users,
    }
  }

  async createRoom(roomInfo: CreateRoomDTO) {
    const room = {
      title: roomInfo.title,
      users: roomInfo.users,
      presentGroup: generateUUID(),
    } as Partial<Room>
    const id = await useTransaction(async () => {
      return this.roomRepository.insert(room)
    })
    return { id, ...room } as Room
  }

  async addMember(roomID: string, userID: string) {
    const room = await this.roomRepository.findRoomByID(roomID)
    const usersOfRoom = room.users || []

    room.users = [...new Set([...usersOfRoom, userID])]

    await useTransaction(async () => {
      return this.roomRepository.update(roomID, room)
    })
    const roomInfo = await this.getRoomInfo(roomID)
    return roomInfo
  }

  async removeMember(roomID: string, userID: string) {
    const room = await this.roomRepository.findRoomByID(roomID)
    const usersOfRoom = room.users || []

    room.users = usersOfRoom.filter((id) => id !== userID)

    await useTransaction(async () => {
      return this.roomRepository.update(roomID, room)
    })
    const roomInfo = await this.getRoomInfo(roomID)
    return roomInfo
  }

  async updateRoomInfo(roomID: string, roomDTO: UpdateRoomDTO) {
    const room = await this.roomRepository.findRoomByID(roomID)
    room.title = roomDTO.title || room.title
    await useTransaction(async () => {
      return this.roomRepository.update(roomID, room)
    })
    const roomInfo = await this.getRoomInfo(roomID)
    return roomInfo
  }
}
