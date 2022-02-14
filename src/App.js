import "./App.css";
import React, { useEffect, useState } from "react";
import { Input, FormControl, InputLabel, Button } from "@mui/material";
import Book from "./Book";
import Main from "./Main";
import { db, auth, provider } from "./firebase";
import {
  collection,
  onSnapshot,
  addDoc,
  serverTimestamp,
  orderBy,
  query,
} from "firebase/firestore";
import { signInWithPopup, onAuthStateChanged } from "firebase/auth";

function App() {
  const [inputTitle, setInputTitle] = useState("");
  const [inputAuthor, setInputAuthor] = useState("");
  const [inputBody, setInputBody] = useState("");
  const [books, setBooks] = useState([]);
  const [user, setUser] = useState(null);
  const booksCollectionRef = collection(db, "books");
  const [selectedItem, setSelectedItem] = useState(0);

  const items = (
    <ul className="books">
      {books.map((book) => (
        <Book
          book={book}
          setSelectedItem={setSelectedItem}
          selectedItem={selectedItem}
        />
      ))}
    </ul>
  );

  // When the app loads, we need to listen to the database and fetch new todos as they get added/removed
  useEffect(() => {
    // This code here... fires when the app.js loads
    onSnapshot(
      query(booksCollectionRef, orderBy("timestamp", "desc")),
      (snapshot) => {
        setBooks(
          snapshot.docs.map((doc) => {
            return {
              id: doc.id,
              ...doc.data(),
            };
          })
        );
      }
    );
  }, []);

  const addBook = (event) => {
    event.preventDefault(); // will stop the REFRESH
    addDoc(collection(db, "books"), {
      title: inputTitle,
      author: inputAuthor,
      body: inputBody,
      timestamp: serverTimestamp(),
      user: user.displayName,
    });
    // setInputTitle(""); // clear up the input after clicking add todo button
    // setInputAuthor(""); // clear up the input after clicking add todo button
    setInputBody(""); // clear up the input after clicking add todo button
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          name: user.displayName,
          photoUrl: user.photoURL,
        });
      } else {
        setUser(null);
      }
    });
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        // user has logged in...
        setUser(authUser);
      } else {
        // user has logged out...
        setUser(null);
      }
    });

    return () => {
      // person some cleanup actions
      unsubscribe();
    };
  }, [user]);

  return (
    <div className="App">
      <h1>Book highlight submission site 📚</h1>
      <div className="app__header">
        <div className="app__loginContainer">
          {!user ? (
            <Button onClick={() => signInWithPopup(auth, provider)}>
              Sign In
            </Button>
          ) : (
            <>
              <p>{user && user.displayName}</p>
              <Button onClick={() => auth.signOut()}>Logout</Button>
            </>
          )}
        </div>
      </div>

      {user ? (
        <>
          <form>
            <FormControl>
              <InputLabel>✅ Write a Title</InputLabel>
              <Input
                value={inputTitle}
                onChange={(event) => setInputTitle(event.target.value)}
              />
            </FormControl>
            <FormControl>
              <InputLabel>✅ Write a Author</InputLabel>
              <Input
                value={inputAuthor}
                onChange={(event) => setInputAuthor(event.target.value)}
              />
            </FormControl>
            <FormControl>
              <InputLabel>✅ Write Body</InputLabel>
              <Input
                value={inputBody}
                onChange={(event) => setInputBody(event.target.value)}
              />
            </FormControl>

            <Button
              type="submit"
              onClick={addBook}
              variant="contained"
              color="primary"
              disabled={!inputBody}
            >
              Add Highlight
            </Button>
            <Button
              type="button"
              onClick={() => {
                setInputAuthor("");
                setInputTitle("");
                setInputBody("");
              }}
              variant="contained"
              color="secondary"
              disabled={!inputBody && !inputAuthor && !inputTitle}
            >
              Reset
            </Button>
          </form>
          <Main selectedItem={selectedItem} />
          <>{items}</>
        </>
      ) : (
        <div>You need to login...</div>
      )}
    </div>
  );
}

export default App;
