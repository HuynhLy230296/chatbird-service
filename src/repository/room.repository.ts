import { Injectable } from '@nestjs/common'
import * as admin from 'firebase-admin'
import Room from 'src/entities/Room'
import { EntityNotFoundException } from 'src/exceptions/entity.exception'

@Injectable()
export default class RoomRepository {
  private readonly collection = admin.firestore().collection('room')

  async findRoomByID(id: string): Promise<Room> {
    const snap = await this.collection.doc(id).get()
    if (!snap.exists) {
      throw new EntityNotFoundException('User not found')
    }
    const data = snap.data()

    return {
      id: snap.id,
      title: data.title,
      users: data.users,
      presentGroup: data.presentGroup,
    }
  }
  async insert(room: Partial<Room>): Promise<string> {
    const res = await this.collection.add(room)
    return res.id
  }
  async update(id: string, room: Partial<Room>): Promise<boolean> {
    const snap = this.collection.doc(id)
    await snap.set(room, { merge: true })
    return true
  }
}
