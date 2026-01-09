import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, browserLocalPersistence, setPersistence } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { environment } from '../../../../environments/environment';


let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

if (!getApps().length) {
  app = initializeApp(environment.firebase);
} else {
  app = getApp();
}

auth = getAuth(app);
db = getFirestore(app);

setPersistence(auth, browserLocalPersistence);

export { app, auth, db };
