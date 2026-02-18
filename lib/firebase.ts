<<<<<<< HEAD
import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import { getAuth, type Auth } from "firebase/auth"
import { getDatabase, type Database } from "firebase/database"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

let app: FirebaseApp | null = null
let auth: Auth | null = null
let database: Database | null = null

function getFirebaseApp(): FirebaseApp {
  if (app) return app
  if (!firebaseConfig.apiKey) {
    throw new Error("Firebase API key is not configured. Please set your NEXT_PUBLIC_FIREBASE_API_KEY environment variable.")
  }
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
  return app
}

export function getFirebaseAuth(): Auth {
  if (auth) return auth
  auth = getAuth(getFirebaseApp())
  return auth
}

export function getFirebaseDatabase(): Database {
  if (database) return database
  database = getDatabase(getFirebaseApp())
  return database
}

export function isFirebaseConfigured(): boolean {
  return !!firebaseConfig.apiKey
}
=======
import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import { getAuth, type Auth } from "firebase/auth"
import { getDatabase, type Database } from "firebase/database"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

let app: FirebaseApp | null = null
let auth: Auth | null = null
let database: Database | null = null

function getFirebaseApp(): FirebaseApp {
  if (app) return app
  if (!firebaseConfig.apiKey) {
    throw new Error("Firebase API key is not configured. Please set your NEXT_PUBLIC_FIREBASE_API_KEY environment variable.")
  }
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
  return app
}

export function getFirebaseAuth(): Auth {
  if (auth) return auth
  auth = getAuth(getFirebaseApp())
  return auth
}

export function getFirebaseDatabase(): Database {
  if (database) return database
  database = getDatabase(getFirebaseApp())
  return database
}

export function isFirebaseConfigured(): boolean {
  return !!firebaseConfig.apiKey
}
>>>>>>> d9c409a34aecc0e321ad11ef035d23b954fa5079
