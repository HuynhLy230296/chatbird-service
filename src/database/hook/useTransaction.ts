import * as admin from 'firebase-admin'
export default async function useTransaction(f: Function) {
  await admin.firestore().runTransaction(async () => {
    f()
  })
}
