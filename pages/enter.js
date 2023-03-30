import { googleAuthProvider } from "../lib/firebase";
import { auth } from "../lib/firebase";
import {UserContext} from "../lib/context";
import {useContext} from "react";

export default function EnterPage(props) {
    // 1. User signed out <SignInButton/>
    // 2. User signed in but missing username <UsernameForm/>
    // 3. User signed in and has username <SignOutButton/>
    const {user, username} = useContext(UserContext);

    return (
        <main>
            { user ? 
                <SignOutButton/>
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
    return null;
    
}