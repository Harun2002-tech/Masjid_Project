import admin from "firebase-admin";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ማስተካከያ፦ ከ config -> ወደ Backend -> ወደ ዋናው ማውጫ (Root) ለመውጣት ሁለት ጊዜ ".." ተጠቅመናል
const serviceAccount = JSON.parse(
  readFileSync(
    join(__dirname, "..", "..", "firebase-service-account.json"),
    "utf8"
  )
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const auth = admin.auth();

export { db, auth };
export default admin;
