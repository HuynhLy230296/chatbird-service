import { Module } from '@nestjs/common'
import { FirebaseAuth } from './firebaseAuth.service'

@Module({
  providers: [FirebaseAuth],
  exports: [FirebaseAuth],
})
export class FirebaseAuthModule {}
