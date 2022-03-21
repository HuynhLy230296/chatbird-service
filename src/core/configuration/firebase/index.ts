import admin from 'firebase-admin';
import serviceAccount from './serviceAccountKey.json';
import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';

export const firebaseLoader: MicroframeworkLoader = (
  settings: MicroframeworkSettings | undefined,
) => {
  if (settings) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: serviceAccount.project_id,
        clientEmail: serviceAccount.client_email,
        privateKey: serviceAccount.private_key,
      }),
    });
    settings.setData('firebaseAuth', admin);
  }
};
