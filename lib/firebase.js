import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyAsBdJBiS7XliTNJYtr9NyLU7bB2r-hrWQ",
    authDomain: "fir-app-4e11b.firebaseapp.com",
    projectId: "fir-app-4e11b",
    storageBucket: "fir-app-4e11b.appspot.com",
    messagingSenderId: "55313064442",
    appId: "1:55313064442:web:7078aeda9f4551c29dc443",
    measurementId: "G-EMN2V1S211"
};

if(!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider(); //just added this
export const firestore = firebase.firestore();
export const storage = firebase.storage();