import { Injectable, Logger } from '@nestjs/common'
import * as admin from 'firebase-admin'
import User from 'src/entities/User'
import { EntityNotFoundException } from 'src/exceptions/entity.exception'
import { LIMIT_USER_PER_REQUEST } from 'src/utils/constants'

@Injectable()
export default class UserRepository {
  private logger: Logger = new Logger(UserRepository.name)
  private readonly collection = admin.firestore().collection('user')
  async findUserByID(id: string): Promise<User> {
    const snap = await this.collection.doc(id).get()
    const data = snap.data()
    if (!snap.exists) {
      throw new EntityNotFoundException('User not found')
    }
    return {
      id,
      email: data.email,
      loginProvider: data.loginProvider,
      name: data.name,
      picture: data.picture,
      rooms: data.rooms || [],
      friends: data.friends || [],
    }
  }
  async findUserByEmail(email: string): Promise<User> {
    const snap = await this.collection.where('email', '==', email).limit(1).get()
    if (snap.empty) {
      throw new EntityNotFoundException('User not found')
    } else {
      const data = snap.docs[0].data()
      return {
        id: snap.docs[0].id,
        email: data.email,
        loginProvider: data.loginProvider,
        name: data.name,
        picture: data.picture,
        rooms: data.rooms || [],
        friends: data.friends || [],
      }
    }
  }
  async getAll(id: string, offset: number, limit: number = LIMIT_USER_PER_REQUEST) {
    const snapUser = await this.collection.doc(id).get()
    const user = snapUser.data()
    const friends = user.friends || []
    const snaps = await this.collection
      .where('id', 'not-in', [...friends, id])
      .offset((offset - 1) * limit)
      .limit(limit)
      .get()
    if (snaps.empty) {
      return []
    }
    const users = snaps.docs.map((o) => o.data())
    return users
  }
  async insert(user: Partial<User>): Promise<string> {
    const res = await this.collection.add(user)
    return res.id
  }
  async update(id: string, user: User): Promise<boolean> {
    const snap = this.collection.doc(id)
    await snap.set(user, { merge: true })
    return true
  }
}
