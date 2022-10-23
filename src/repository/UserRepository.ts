import * as admin from 'firebase-admin'
import User from 'src/entities/User'

export default class UserRepository {
  private readonly collection = admin.firestore().collection('user')
  async findUserByID(id: string): Promise<User> {
    const snap = await admin.firestore().collection('user').doc(id).get()
    const data = snap.data()
    return {
      id,
      email: data.email,
      loginProvider: data.loginProvider,
      name: data.name,
      picture: data.picture,
    }
  }
  async findUserByEmail(email: string): Promise<User> {
    const snap = await this.collection.where('email', '==', email).limit(1).get()

    if (snap.empty) {
      return null
    } else {
      const data = snap.docs[0].data()
      return {
        id: snap.docs[0].id,
        email: data.email,
        loginProvider: data.loginProvider,
        name: data.name,
        picture: data.picture,
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
