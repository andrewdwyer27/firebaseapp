import PostFeed from "../components/PostFeed";
import Loader from "../components/Loader";
import { firestore, fromMillis, postToJSON } from "../lib/firebase";
import { useState } from "react";

//max post to query per page
const LIMIT = 1;

//function that runs right before component. gets props from like a database, and then it passes it to the page when it loads 
export async function getServerSideProps(context) {
  const postsQuery = firestore
    .collectionGroup("posts") //grab any subcollection no matter where its nested in the tree of docs that has a name of posts (because posts is nested under individual users)
    .where("published", "==", true)
    .orderBy("createdAt", "desc")
    .limit(LIMIT);
  
  const postsDoc = await postsQuery.get();
  console.log("here");
  postsDoc.forEach((post) => {
    console.log(JSON.stringify(post.data()));
  })
  const posts = postsDoc.docs.map(postToJSON);
  return {
    props: { posts }
  }
}
  
export default function Home(props) {
  //set the props as state 
  const [posts, setPosts] = useState(props.posts);
  const [loading, setLoading] = useState(false);
  const [postsEnd, setPostsEnd] = useState(false);
  const getMorePosts = async() => {
    setLoading(true);
    const last = posts.length > 0 ? posts[posts.length-1] : null;

    const cursor = typeof last?.createdAt === "number" ? fromMillis(last?.createdAt) : last?.createdAt;

    const query = firestore
      .collectionGroup("posts")
      .where("published", "==", true)
      .orderBy("createdAt", "desc")
      .startAfter(cursor) //10 posts already, instead of loading 0-10, you load like 10-20 
      .limit(LIMIT);

    const newPosts = (await query.get()).docs.map((doc) => doc.data());

    setPosts(posts.concat(newPosts));
    setLoading(false);

    if(newPosts.length < LIMIT) {
      setPostsEnd(true);
    }
  }
  return (
    <main>
      <PostFeed posts={posts}/>

      {!loading && !postsEnd && <button onClick={getMorePosts}>Load more</button>}

      <Loader show={loading} />

      {postsEnd && "You have reached the end"}
    </main>
  )
}
