import {useState} from "react";
import {auth, storage, STATE_CHANGED} from "../lib/firebase";
import Loader from "./Loader";

export default function ImageUploader() {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [downloadURL, setDownloadURL] = useState(null);

    const uploadFile = async (evt) => {
        const file = Array.from(evt.target.files)[0]; //Grab first element, which is a file object
        const extension = file.type.split("/")[1]; //Grab the extension (png)

        const ref = storage.ref(`uploads/${auth.currentUser.uid}/${Date.now()}.${extension}`);
        setUploading(true);

        const task = ref.put(file);
        task.on(STATE_CHANGED, (snapshot) => {
            const pct = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0);
            setProgress(pct);

            task.then((d) => ref.getDownloadURL()).then((url) => {
                setDownloadURL(url);
                setUploading(false);
            });
        }); //Listen to progress of file upload. When state changes, calls the callback
        
    }
    return (
        <div className="box">
            <Loader show={uploading}/>
            {uploading && <h3>{progress}%</h3>}

            {!uploading && (
                <>
                    <label className="btn">Upload Image</label>
                    <input type="file" onChange={uploadFile} accept="image/x-png,image/gif,image/jpeg"/>
                </>
            )}

            {downloadURL && <code className="upload-snippet">{`!alt](${downloadURL})`}</code>}
        </div>
    )
}