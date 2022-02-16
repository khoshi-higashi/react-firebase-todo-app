import "./App.css";
import React, { useState } from "react";
import { Input, FormControl, InputLabel, Button } from "@mui/material";
import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const Form = ({ user }) => {
  const [inputTitle, setInputTitle] = useState("");
  const [inputAuthor, setInputAuthor] = useState("");
  const [inputBody, setInputBody] = useState("");
  const maps = [];

  for (let i = 0; i < inputBody.length; i++) {
    if (i === 0) {
      maps.push(`${inputBody[i]}`);
    } else if (i + 1 <= inputBody.length) {
      maps.push(`${inputBody[i - 1]}${inputBody[i]}`);
    }
  }

  for (let i = 0; i < inputTitle.length; i++) {
    if (i === 0) {
      maps.push(`${inputTitle[i]}`);
    } else if (i + 1 <= inputTitle.length) {
      maps.push(`${inputTitle[i - 1]}${inputTitle[i]}`);
    }
  }

  for (let i = 0; i < inputAuthor.length; i++) {
    if (i === 0) {
      maps.push(`${inputAuthor[i]}`);
    } else if (i + 1 <= inputAuthor.length) {
      maps.push(`${inputAuthor[i - 1]}${inputAuthor[i]}`);
    }
  }

  console.log(maps);

  const addBook = (event) => {
    event.preventDefault(); // will stop the REFRESH
    addDoc(collection(db, "books"), {
      title: inputTitle,
      author: inputAuthor,
      body: inputBody,
      timestamp: serverTimestamp(),
      user: user.displayName,
      userid: user.uid,
      maps: maps,
    });
    setInputBody("");
  };

  return (
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
      {!inputBody ? (
        <></>
      ) : (
        <p>
          <Button
            type="submit"
            onClick={addBook}
            variant="contained"
            color="primary"
            disabled={!inputBody}
          >
            Add Highlight
          </Button>
        </p>
      )}
      {!inputBody && !inputAuthor && !inputTitle ? (
        <></>
      ) : (
        <p>
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
        </p>
      )}
    </form>
  );
};

export default Form;
