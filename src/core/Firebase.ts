import * as admin from 'firebase-admin'

class Firebase {
  public boot() {
    const firbaseConfig = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    }

    admin.initializeApp(firbaseConfig)
  }
}

export default new Firebase()
