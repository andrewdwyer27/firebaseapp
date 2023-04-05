import Image from "next/image";

export default function UserProfile({ user }) {
    return (
        <div className="box-center">
            <div>
                <Image src={user.photoURL} className="card-img-center" width={100} height={100}/>
            </div>
            <p>
                <i>@{user.username}</i>
            </p>
            <h1>{user.displayName}</h1>
        </div>
    )
}