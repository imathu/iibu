import { auth } from './firebase';

// Sign Up
export const doCreateUserWithEmailAndPassword = (email, password) =>
  auth.createUserWithEmailAndPassword(email, password);

// Sign In
export const doSignInWithEmailAndPassword = (email, password) =>
  auth.signInWithEmailAndPassword(email, password);

// email Sign In
export const doSignInWithEmail = (email, projectId, feedbackerId) =>
  auth.sendSignInLinkToEmail(email, {
    url: `http://localhost:3000/answers/${projectId}/${feedbackerId}`,
    handleCodeInApp: true,
  });
export const isSignInWithEmailLink = email =>
  auth.isSignInWithEmailLink(email);
export const signInWithEmailLink = (email, url) =>
  auth.signInWithEmailLink(email, url);

// Sign out
export const doSignOut = () =>
  auth.signOut();

// Password Reset
export const doPasswordReset = email =>
  auth.sendPasswordResetEmail(email);

// Password Change
export const doPasswordUpdate = password =>
  auth.currentUser.updatePassword(password);
