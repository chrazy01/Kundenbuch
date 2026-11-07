// Firebase-Anbindung des Kundenbuchs: Login (E-Mail/Passwort) und Firestore mit Offline-Speicher.
// Stellt window.FB bereit; die App spricht nur über diese kleine Schnittstelle mit Firebase.
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from "firebase/auth";
import {
  initializeFirestore, persistentLocalCache, persistentMultipleTabManager, memoryLocalCache,
  doc, collection, setDoc, updateDoc, deleteDoc, getDocs, query, where, onSnapshot
} from "firebase/firestore";
import firebaseConfig from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
let fs;
try {
  fs = initializeFirestore(app, { ignoreUndefinedProperties: true, localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }) });
} catch (e) {
  fs = initializeFirestore(app, { ignoreUndefinedProperties: true, localCache: memoryLocalCache() });
}

// Schreiben wartet höchstens 1,5 s auf den Server: offline landet die Änderung sofort im lokalen
// Speicher und wird übertragen, sobald wieder Netz da ist. Echte Fehler (z.B. fehlende Rechte) kommen sofort.
const settle = p => Promise.race([p, new Promise(r => setTimeout(r, 1500))]);
const wrapDoc = d => ({ id: d.id, exists: d.exists(), data: () => d.data(), metadata: d.metadata });
const wrapSnap = s => ({ docs: s.docs.map(wrapDoc), size: s.size, empty: s.empty, metadata: s.metadata });

function docRef(r) {
  return {
    id: r.id, path: r.path,
    set: d => settle(setDoc(r, d)),
    update: d => settle(updateDoc(r, d)),
    delete: () => settle(deleteDoc(r)),
    collection: n => collRef(collection(r, n)),
    onSnapshot: (cb, err) => onSnapshot(r, { includeMetadataChanges: true }, s => cb(wrapDoc(s)), err)
  };
}
function queryRef(q) {
  return {
    get: async () => wrapSnap(await getDocs(q)),
    onSnapshot: (cb, err) => onSnapshot(q, { includeMetadataChanges: true }, s => cb(wrapSnap(s)), err)
  };
}
function collRef(c) {
  return Object.assign(queryRef(c), {
    path: c.path,
    doc: id => docRef(id ? doc(c, id) : doc(c)),
    where: (f, op, v) => queryRef(query(c, where(f, op, v)))
  });
}

window.FB = {
  signIn: (email, pw) => signInWithEmailAndPassword(auth, email, pw),
  signOut: () => signOut(auth),
  reset: email => sendPasswordResetEmail(auth, email),
  onAuth: cb => onAuthStateChanged(auth, cb),
  userRoot: uid => docRef(doc(fs, "users", uid))
};
window.dispatchEvent(new Event("fb-ready"));
