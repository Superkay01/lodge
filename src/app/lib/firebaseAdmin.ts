import 'server-only';
import { getApps, initializeApp, cert, applicationDefault } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Define a type for the service account credentials
interface FirebaseServiceAccount {
  project_id: string;
  client_email: string;
  private_key: string;
}

// Function to load the Firebase service account credentials
function loadServiceAccount(): FirebaseServiceAccount | null {
  const json = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (json) {
    try {
      return JSON.parse(json);
    } catch (err) {
      console.error('Error parsing JSON service account:', err);
    }
  }

  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
  if (b64) {
    try {
      return JSON.parse(Buffer.from(b64, 'base64').toString('utf8'));
    } catch (err) {
      console.error('Error parsing base64 encoded service account:', err);
    }
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY || '';
  privateKey = privateKey.replace(/\\n/g, '\n'); // Critical to fix PEM newlines

  if (projectId && clientEmail && privateKey) {
    return { project_id: projectId, client_email: clientEmail, private_key: privateKey };
  }
  return null;
}

// Get the service account or use default credentials
const svc = loadServiceAccount();

const app = getApps()[0] || initializeApp(
  svc
    ? { credential: cert({
        projectId: svc.project_id,
        clientEmail: svc.client_email,
        privateKey: svc.private_key,
      }) }
    : { credential: applicationDefault() } // works if GOOGLE_APPLICATION_CREDENTIALS is set
);

export const adminAuth = getAuth(app);
export const adminDb = getFirestore(app);
