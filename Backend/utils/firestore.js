import { db } from "../config/firebase.js";
import bcrypt from "bcryptjs";

const collections = {
  users: "users",
  students: "students",
  teachers: "teachers",
  courses: "courses",
  news: "news",
  enrollments: "enrollments",
  events: "events",
  books: "books",
  messages: "messages",
  schedules: "schedules",
  masjids: "masjids",
  testimonials: "testimonials",
  newsletters: "newsletters",
  donations: "donations",
  achievements: "achievements",
};

const getDoc = async (col, id) => {
  const snap = await db.collection(col).doc(id).get();
  if (!snap.exists) return null;
  return { id: snap.id, ...snap.data() };
};

const getDocs = async (col, opts = {}) => {
  let query = db.collection(col);
  if (opts.orderBy) query = query.orderBy(opts.orderBy, opts.orderDir || "desc");
  if (opts.limit) query = query.limit(opts.limit);
  if (opts.where) {
    opts.where.forEach((w) => {
      query = query.where(w.field, w.op || "==", w.value);
    });
  }
  const snap = await query.get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

const addDoc = async (col, data) => {
  const ref = await db.collection(col).add({
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  const doc = await ref.get();
  return { id: ref.id, ...doc.data() };
};

const setDoc = async (col, id, data) => {
  await db.collection(col).doc(id).set(
    {
      ...data,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
  return await getDoc(col, id);
};

const updateDoc = async (col, id, data) => {
  await db.collection(col).doc(id).update({
    ...data,
    updatedAt: new Date().toISOString(),
  });
  return await getDoc(col, id);
};

const deleteDoc = async (col, id) => {
  await db.collection(col).doc(id).delete();
  return true;
};

const countDocs = async (col, opts = {}) => {
  let query = db.collection(col);
  if (opts.where) {
    opts.where.forEach((w) => {
      query = query.where(w.field, w.op || "==", w.value);
    });
  }
  const snap = await query.count().get();
  return snap.data().count;
};

const findOne = async (col, field, value) => {
  const snap = await db.collection(col).where(field, "==", value).limit(1).get();
  if (snap.empty) return null;
  const doc = snap.docs[0];
  return { id: doc.id, ...doc.data() };
};

const hashPassword = async (password) => {
  if (!password) return null;
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const comparePassword = async (password, hash) => {
  if (!password || !hash) return false;
  return await bcrypt.compare(password, hash);
};

const generateId = async (col, prefix) => {
  const all = await getDocs(col, { orderBy: "createdAt", orderDir: "desc", limit: 1 });
  let next = 1;
  if (all.length > 0 && all[0][`${prefix.toLowerCase()}ID`]) {
    const last = all[0][`${prefix.toLowerCase()}ID`];
    const parts = last.split("-");
    const num = parseInt(parts[1]);
    if (!isNaN(num)) next = num + 1;
  }
  return `${prefix}-${String(next).padStart(3, "0")}`;
};

export {
  db,
  collections,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  countDocs,
  findOne,
  hashPassword,
  comparePassword,
  generateId,
};
