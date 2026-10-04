import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {GOOGLE_CLIENT_ID} from '@env';

// Configure Google Sign-In
GoogleSignin.configure({
  webClientId: GOOGLE_CLIENT_ID, // From Google Cloud Console
  offlineAccess: true,
  scopes: ['profile', 'email'],
});

export const signInWithGoogle = async () => {
  await GoogleSignin.hasPlayServices();
  const userInfo = await GoogleSignin.signIn();
  return userInfo;
};

export const signOutFromGoogle = async () => {
  await GoogleSignin.signOut();
};
