import firebase from "firebase/app";
import "firebase/database";

var firebaseConfig = {
  apiKey: "AIzaSyDKuMW5hF-OYGgGwFCNNTAOJHuCXGlIchg",
  authDomain: "green-9a7ae.firebaseapp.com",
  databaseURL: "https://green-9a7ae-default-rtdb.firebaseio.com",
  projectId: "green-9a7ae",
  storageBucket: "green-9a7ae.appspot.com",
  messagingSenderId: "386104967483",
  appId: "1:386104967483:web:5638031fb50acf186db71e"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

window.firebase = firebase;

export const Firebase = () => {
  const db = firebase.database();

  const setData = (json) => {
    db.ref("drawing/content").set(json);
  };

  const setBackground = (obj) => {
    db.ref("drawing/background").set(obj);
  };

  const getData = () => {
    return new Promise((resolved) => {
      db.ref("drawing").on("value", (snapshot) => {
        const data = snapshot.val();
        resolved(data.content);
      });
    });
  };

  const getBackground = () => {
    return new Promise((resolved) => {
      db.ref("drawing").on("value", (snapshot) => {
        const data = snapshot.val();
        resolved(data.background);
      });
    });
  };

  return {
    setData,
    getData,
    setBackground,
    getBackground
  };
};
