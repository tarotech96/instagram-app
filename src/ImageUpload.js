import React, { useState } from 'react'
import { Button } from '@material-ui/core'
import { storage, db } from './firebase';
import firebase from 'firebase';
function ImageUpload({ username}) {
    const [image, setImage] = useState(null);
    const [caption, setCaption] = useState('');
    const [progress, setProgress] = useState(0);

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0])
        }
    };

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // process function
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                setProgress(progress);
            },
            (error) => {
                // error function
                console.log(error.message)
            },
            () => {
                // complete function
                storage.ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        // post image inside
                        db.collection('posts').add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp.toString(),
                            caption: caption,
                            imageUrl: url,
                            username: username
                        });

                        setProgress(0);
                        setCaption('');
                        setImage(null)
                    })
            }
        )
    }
    return (
        <div className="uploadImage">
            <progress value={progress} max={100} />
            <input type="text" value={caption} placeholder="Enter a caption" onChange={event => setCaption(event.target.value)} />
            <input type="file" onChange={handleChange} />
            <Button className="uploadImage__button" onClick={handleUpload}>
                Upload
            </Button>
        </div>
    )
}

export default ImageUpload
