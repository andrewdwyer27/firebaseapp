import firebase from "firebase";
import "firebase/storage";

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

//Helper functions
export async function getUserWithUsername(username) {
    const userRef = firestore.collection("users");
    const query = userRef.where("username", "==", username).limit(1);
    const userDoc = (await query.get()).docs[0]; //take first document from the array of that query 
    return userDoc;
}

export function postToJSON(doc) {
    const data = doc.data();
    return {
        ...data,
        createdAt: data.createdAt.toMillis(),
        updatedAt: data.updatedAt.toMillis()
    }
}

export const fromMillis = firebase.firestore.Timestamp.fromMillis;
//save time stamp of document on server 
export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;

export const STATE_CHANGED = firebase.storage.TaskEvent.STATE_CHANGED;