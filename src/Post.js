import React, { useState, useEffect } from 'react'
import './Post.css';
import Avatar from '@material-ui/core/Avatar';
import { db } from './firebase';
import firebase from 'firebase';
function Post({ postId, user, imageUrl, username, caption }) {
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    useEffect(() => {
        let unsubscribe;
        if (postId) {
            unsubscribe = db.collection('posts')
                .doc(postId)
                .collection('comments')
                .orderBy('timestamp', 'desc')
                .onSnapshot(snapshot => {
                    setComments(snapshot.docs.map(doc => doc.data()));
                })
        }

        return () => {
            unsubscribe();
        }
    }, [postId]);

    const postComment = (event) => {
        event.preventDefault();

        db.collection('posts').doc(postId)
            .collection('comments').add({
                text: comment,
                username: user.displayName,
                timestamp: firebase.firestore.FieldValue.serverTimestamp.toString()
            });

        setComment('');
    }
    return (
        <div className="post">
            <div className="post__header">
                <Avatar
                    className="post__avatar"
                    alt="taro"
                    src="https://www.instagram.com/p/CC2kYblpzsu/"
                />
                <h3>{username}</h3>
            </div>
            <img
                className="post__image"
                src={imageUrl}
                alt=""
            />
            <h4 className="post__text"><strong>{username}</strong> {caption}</h4>

            {
                comments.map(comment => (
                    <p className="post__comments">
                        <strong key={comment.id}>{comment.username}</strong> {comment.text}
                    </p>
                ))
            }
            {user && (
                <form className="post__commentBox">
                    <input
                        className="post__input"
                        type="text"
                        placeholder="Add a comment..."
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                    />
                    <button
                        className="post__button"
                        disabled={!comment}
                        type="submit"
                        onClick={postComment}
                    >
                        Post
                </button>
                </form>
            )}
        </div>
    )
}

export default Post
