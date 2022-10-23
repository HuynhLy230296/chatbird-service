import { Injectable } from '@nestjs/common'
import * as admin from 'firebase-admin'
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier'

@Injectable()
export class FirebaseAuth {
  public async vetifyIdToken(idToken: string): Promise<DecodedIdToken> {
    const profile = await admin.auth().verifyIdToken(idToken)
    return profile
  }
}
