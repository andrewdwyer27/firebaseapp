import { googleAuthProvider } from "../lib/firebase";
import { auth } from "../lib/firebase";
import {UserContext} from "../lib/context";
import {firestore} from "../lib/firebase";
import {useContext} from "react";
import {useState, useEffect} from "react";
import {useCallback} from "react";
import debounce from 'lodash.debounce';

export default function EnterPage(props) {
    // 1. User signed out <SignInButton/>
    // 2. User signed in but missing username <UsernameForm/>
    // 3. User signed in and has username <SignOutButton/>
    const {user, username} = useContext(UserContext);

    return (
        <main>
            { user ? 
                !username ? <UsernameForm/> : <SignOutButton/>
                : 
                <SignInButton/>
            }

        </main>
    )
}

//Sign in with google button
function SignInButton() {
    const signInWithGoogle = async () => {
        console.log("signing in with google");
        var provider = await auth.signInWithPopup(googleAuthProvider);
        console.log(provider); 
        //triggers pop up in browser

    };
    return (
        <button className="btn-google" onClick={signInWithGoogle}>
            <img src = {'/google.png'}/> Sign in with Google
        </button>
    )
}

//Sign out button
function SignOutButton() {
    return (
        <button onClick={() => auth.signOut()}>
            Sign Out
        </button>
    )
}

function UsernameForm() {
    const [formValue, setFormValue] = useState(""); //value user types into form 
    const [isValid, setIsValid] = useState(false); //whether or not that username is a valid selection
    const [loading, setLoading] = useState(false); //true when were asynchronously checking if the username exists

    const {user, username} = useContext(UserContext);
    
    const onSubmit = async (evt) => {
        evt.preventDefault();

        //Create refs for both documents
        const userDoc = firestore.doc(`users/${user.uid}`);
        const usernameDoc = firestore.doc(`usernames/${formValue}`);

        //Commit both docs together as a batch write 
        const batch = firestore.batch();
        batch.set(userDoc, {username: formValue, photoURL: user.photoURL, displayName: user.displayName});
        batch.set(usernameDoc, {uid: user.uid});

        await batch.commit();

    }

    const onChange = (evt) => {
        const val = evt.target.value.toLowerCase();
        //Only update the form value if the user enters a valid character 
        const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

        //Only set form value if length > 3 OR it passes regex
        if(val.length < 3) {
            //if what the user types is less than 3, they can type it, but it's not valid 
            setFormValue(val);
            setLoading(false);
            setIsValid(false);
        }

        if(re.test(val)) {
            setFormValue(val);
            setLoading(true);
            setIsValid(false);
        }

        //debounce prevents the exectution of the function until the last form value has changed at a delay of 500ms
                //it waits for the user to stop typing for 500 ms before running the checkUsername function
                //useCallback is needed for debounce to work 
    }

    useEffect(() => {
        checkUsername(formValue);
    }, [formValue]);

    const checkUsername = useCallback(
        debounce(async (formValue) => {
            if(formValue.length >= 3) {
                const ref = firestore.doc(`usernames/${formValue}`);
                const {exists} = await ref.get(); //see if the username exists 
                console.log("Firestore read executed!");
                setIsValid(!exists);
                setLoading(false);
            }
        }, 500),
        []
    );

    return (
        !username && (
            <section>
                <h3>Choose Username</h3>
                <form onSubmit = {onSubmit}>
                    <input name = "username" value = {formValue} onChange = {onChange}/>

                    <UsernameMessage username = {formValue} isValid = {isValid} loading = {loading}/>
                    <button type = "submit" className = "btn-green" disabled = {!isValid}>Choose</button>

                </form>
            </section>
        )
    )    
}

function UsernameMessage({username, isValid, loading}) {
    if(loading) {
        return <p>Checking...</p>;
    } else if (isValid) {
        return <p className="text-success">{username} is available</p>;
    } else if (username && !isValid) {
        return <p className = "text-danger">That username is already taken!</p>;
    } else {
        return <p></p>;
    }
}