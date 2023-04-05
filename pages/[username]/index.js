import UserProfile from "../../components/UserProfile";
import PostFeed from "../../components/PostFeed";
import { getUserWithUsername } from "@/lib/firebase";
import { postToJSON, firestore } from "../../lib/firebase";

export async function getServerSideProps({ query }) {
    //need to fetch the information to give it to the props
    const { username } = query;

    const userDoc = await getUserWithUsername(username);

    let user = null;
    let posts = null;

    if(!userDoc) {
        return {
            notFound: true
        }
    }
    if(userDoc) {
        user = userDoc.data();
        const postsQuery = userDoc.ref
            .collection("posts")
            .where("published", "==", true)
            .orderBy("createdAt", "desc")
            .limit(5); //descending
        
        posts = (await postsQuery.get()).docs.map(postToJSON);
    }

    return {
        props: { user, posts }, //will be passed to the page component as props 
    }
}
export default function UsernamePage({user, posts}) {
    return (
        <main>
            <UserProfile user={user}/>
            <PostFeed posts={posts}/>
        </main>
    )
}