import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
// import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: 'AIzaSyD2k7GtlbEstio-sCk-a0TlRdbNsUd3T2A',
  authDomain: 'sikander247-spin.firebaseapp.com',
  projectId: 'sikander247-spin',
  storageBucket: 'sikander247-spin.appspot.com',
  messagingSenderId: '1002696734170',
  appId: '1:1002696734170:web:6d81ec6b2ef19d5db17ce3',
  measurementId: 'G-HJE14RNEWC',
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
// const storage = firebase.storage();

const fieldValue = firebase.firestore.FieldValue;
const timestamp = fieldValue.serverTimestamp();

export { db, firebase, auth, fieldValue, timestamp };
