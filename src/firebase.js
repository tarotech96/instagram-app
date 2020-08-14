import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyAIrsjHi0Z5p2MCdK9v4PPZ88sESgwLmvs",
    authDomain: "netflix-clone-9de6c.firebaseapp.com",
    databaseURL: "https://netflix-clone-9de6c.firebaseio.com",
    projectId: "netflix-clone-9de6c",
    storageBucket: "netflix-clone-9de6c.appspot.com",
    messagingSenderId: "364729508610",
    appId: "1:364729508610:web:0244fb9e28a2719ca8d81b",
    measurementId: "G-N2TLE6QH7T"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };