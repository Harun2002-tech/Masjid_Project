import admin from "firebase-admin";
import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const possiblePaths = [
  process.env.GOOGLE_APPLICATION_CREDENTIALS,
  join(__dirname, "firebase-service-account.json"),
  join(process.cwd(), "Backend", "config", "firebase-service-account.json"),
  join(process.cwd(), "Backend", "firebase-service-account.json"),
  join(process.cwd(), "firebase-service-account.json"),
].filter(Boolean);

const serviceAccountPath = possiblePaths.find((p) => existsSync(p));
if (!serviceAccountPath) {
  throw new Error(
    `Firebase service account not found. Tried:\n${possiblePaths.join("\n")}`
  );
}

const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf8"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const auth = admin.auth();

export { db, auth };
export default admin;
