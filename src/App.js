import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Post';
import { db, auth } from './firebase';
import Modal from '@material-ui/core/Modal';
import { makeStyles, Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';
const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}
function App() {
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);
  const [openSignIn, setOpenSignIn] = useState(false);
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);

  const signUp = (event) => {
    event.preventDefault();

    auth.createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username
        })
      })
      .catch((error) => {
        alert(error.message)
      })

    setOpen(true);
  }

  const signIn = (event) => {
    event.preventDefault();

    auth.signInWithEmailAndPassword(email, password)
      .catch(error => {
        alert(error.message);
      })

    setOpenSignIn(false);
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);

        if (authUser.displayName) {

        } else {
          return authUser.updateProfile({
            displayName: username
          })
        }
      } else {
        setUser(null)
      }
    })

    return () => {
      unsubscribe();
    }
  }, [user, username]);
  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    })
  }, []);

  return (
    <div className="app">
      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
                alt="logo"
              />
              <Input
                type="username"
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
              <Input
                type="password"
                placeholder="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <Input
                type="email"
                placeholder="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <Button onClick={signUp}>Sign up</Button>
            </center>
          </form>
        </div>
      </Modal>
      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signIn">
            <center>
              <img
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
                alt="logo"
              />
              <Input
                type="password"
                placeholder="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <Input
                type="email"
                placeholder="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <Button onClick={signIn}>Sign In</Button>
            </center>
          </form>
        </div>
      </Modal>
      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
          alt="logo"
        />
        {user ? (
          <Button onClick={() => auth.signOut()}>Login out</Button>
        ) : (
            <div className="app__loginContainer">
              <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
              <Button onClick={() => setOpen(true)}>Sign up</Button>
            </div>
          )}
      </div>

      {user?.displayName ? (
        <div className="app__postStatus">
          <ImageUpload username={user.displayName} />
        </div>
      ) : (
          ''
        )}

      <div className="app__posts">
        <div className="app__postsLeft">
          {
            posts.map((item) => (
              <Post
                key={item.id}
                user={user}
                postId={item.id}
                username={item.post.username}
                caption={item.post.caption}
                imageUrl={item.post.imageUrl} />
            ))
          }
        </div>
        <div className="app__postsRight">
          <InstagramEmbed
            url='https://instagr.am/p/Zw9o4/'
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => { }}
            onSuccess={() => { }}
            onAfterRender={() => { }}
            onFailure={() => { }}
          />
        </div>
      </div>

    </div>
  );
}

export default App;
