import { Injectable } from '@nestjs/common'
import * as admin from 'firebase-admin'
import User from 'src/entities/User'
import { EntityNotFoundException } from 'src/exceptions/entity.exception'

@Injectable()
export default class UserRepository {
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
  async insert(user: User): Promise<string> {
    const res = await this.collection.add(user)
    return res.id
  }
  async update(id: string, user: User): Promise<boolean> {
    const snap = this.collection.doc(id)
    await snap.set(user, { merge: true })
    return true
  }
}
