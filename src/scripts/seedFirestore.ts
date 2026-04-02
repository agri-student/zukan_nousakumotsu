#!/usr/bin/env ts-node
/**
 * Firestore Seed Script
 *
 * Usage:
 *   FIREBASE_ADMIN_PROJECT_ID=xxx \
 *   FIREBASE_ADMIN_CLIENT_EMAIL=xxx \
 *   FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..." \
 *   npx ts-node --compiler-options '{"module":"CommonJS"}' src/scripts/seedFirestore.ts
 *
 * または Firebase エミュレータを使う場合:
 *   FIRESTORE_EMULATOR_HOST=localhost:8080 npx ts-node ...
 */

import * as admin from "firebase-admin";
import { SAMPLE_CROPS } from "../lib/cropData";

const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(
  /\\n/g,
  "\n"
);

if (!projectId || !clientEmail || !privateKey) {
  console.error(
    "❌ 環境変数が不足しています。.env.local を確認してください。"
  );
  console.error(
    "   必要な変数: FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, FIREBASE_ADMIN_PRIVATE_KEY"
  );
  process.exit(1);
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
  });
}

const db = admin.firestore();

async function seed() {
  console.log("🌱 Firestore にサンプルデータをインポート中...");

  const batch = db.batch();
  const collection = db.collection("crops");

  for (const crop of SAMPLE_CROPS) {
    const ref = collection.doc();
    batch.set(ref, {
      ...crop,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log(`  + ${crop.nameJa} (${crop.nameEn})`);
  }

  await batch.commit();
  console.log(`✅ ${SAMPLE_CROPS.length}件のデータをインポートしました！`);
}

seed().catch((err) => {
  console.error("❌ エラーが発生しました:", err);
  process.exit(1);
});
