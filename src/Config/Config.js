import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDMnZIpWmL6DEod-duzY9H7XC8BCszwxWQ',
  authDomain: 'agroriegos-f0196.firebaseapp.com',
  projectId: 'agroriegos-f0196',
  storageBucket: 'agroriegos-f0196.appspot.com',
  messagingSenderId: '1051404985271',
  appId: '1:1051404985271:web:f2ec748d8b9f34be35be32',
  measurementId: 'G-J3SL6VKTF6',
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const fs = firebaseApp.firestore();
const storage = firebase.storage();

export { auth, fs, storage };
