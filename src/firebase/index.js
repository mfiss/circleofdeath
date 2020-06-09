import firebase from "firebase/app";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCi7HRvgrIEtHtAk9kLnYjh_qXJQrJKFUE",
  authDomain: "circelofdeath-666.firebaseapp.com",
  databaseURL: "https://circelofdeath-666.firebaseio.com",
  projectId: "circelofdeath-666",
  storageBucket: "circelofdeath-666.appspot.com",
  messagingSenderId: "64467442716",
  appId: "1:64467442716:web:a9d8ff8bb7602c1aa193d9",
};

firebase.initializeApp(firebaseConfig);

export const firestore = firebase.firestore();
export default firebase;
