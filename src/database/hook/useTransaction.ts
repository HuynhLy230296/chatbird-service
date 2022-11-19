import * as admin from 'firebase-admin'
export default async function useTransaction(f: Function) {
  return admin.firestore().runTransaction(() => {
    return f()
  })
}
