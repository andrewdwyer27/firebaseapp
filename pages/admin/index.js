import AuthCheck from "../../components/AuthCheck";

import styles from '../../styles/Admin.module.css';
import PostFeed from '../../components/PostFeed';
import { UserContext } from '../../lib/context';
import { firestore, auth, serverTimestamp } from '../../lib/firebase';

import { useContext, useState } from 'react';
import { useRouter } from 'next/router';

import { useCollection } from 'react-firebase-hooks/firestore';
import kebabCase from 'lodash.kebabcase';
import toast from 'react-hot-toast';

//post list is the posts that the user has created
export default function AdminPage(props) {
    return (
        <main>
            <AuthCheck>
                <PostList/>
                <CreateNewPost/>
            </AuthCheck>
        </main>
    )
}

function PostList() {
    const ref = firestore.collection("users").doc(auth.currentUser.uid).collection("posts");
    const query = ref.orderBy("createdAt");
    const [querySnapshot] = useCollection(query); //useCollection is a hook from react that reads that collection in real time

    const posts = querySnapshot?.docs.map((doc) => doc.data());

    return (
        <>
            <h1>Manage your posts</h1>
            <PostFeed posts={posts} admin/>
        </>
    )
}

function CreateNewPost() {
    const router = useRouter();
    const { username } = useContext(UserContext);
    const [title, setTitle] = useState(""); //value user is typing in form 

    const slug = encodeURI(kebabCase(title)); //encodeURI makes sure what user types is URL safe(strips out ?!/) and in kebab form

    const isValid = title.length > 3 && title.length < 100;

    function onChange(evt) {
        setTitle(evt.target.value);
    }

    const createPost = async (evt) => {
        evt.preventDefault();
        const uid = auth.currentUser.uid;
        const ref = firestore.collection("users").doc(uid).collection("posts").doc(slug);

        const data = {
            title,
            slug,
            uid,
            username,
            published: false,
            content: "# hello world!",
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            heartCount: 0
        };

        await ref.set(data);

        toast.success("Post created");
        router.push(`/admin/${slug}`);
    }
    return (
        <form onSubmit={createPost}>
            <input value={title} onChange={onChange} placeholder="My awesome article!" className={styles.input}>
            
            </input>
            <p>
                <strong>Slug: </strong>{slug}
            </p>
            <button type="submit" disabled={!isValid} className="btn-green">
                Create new post
            </button>
        </form>
    )

}