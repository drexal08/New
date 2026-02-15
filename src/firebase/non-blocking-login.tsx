'use client';
import {
  Auth,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  User,
  UserCredential,
} from 'firebase/auth';

/** Initiate anonymous sign-in (returns promise for better UI feedback). */
export function initiateAnonymousSignIn(authInstance: Auth): Promise<UserCredential> {
  return signInAnonymously(authInstance);
}

/** Initiate email/password sign-up (returns promise for better UI feedback). */
export function initiateEmailSignUp(authInstance: Auth, email: string, password: string): Promise<UserCredential> {
  return createUserWithEmailAndPassword(authInstance, email, password);
}

/** Initiate email/password sign-in (returns promise for better UI feedback). */
export function initiateEmailSignIn(authInstance: Auth, email: string, password: string): Promise<UserCredential> {
  return signInWithEmailAndPassword(authInstance, email, password);
}

/** Initiate password reset email (non-blocking). */
export function initiatePasswordReset(authInstance: Auth, email: string): Promise<void> {
  return sendPasswordResetEmail(authInstance, email);
}

/** Initiate email verification for the current user (non-blocking). */
export function initiateEmailVerification(user: User): Promise<void> {
  return sendEmailVerification(user);
}
