import React, { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import Products from './Products';
import { auth, fs } from '../Config/Config';

export default function Home() {
  function GetCurrentUser() {
    const [user, setUser] = useState(null);
    useEffect(() => {
      auth.onAuthStateChanged((user) => {
        if (user) {
          fs.collection('Users')
            .doc(user.uid)
            .get()
            .then((snapshot) => {
              setUser(snapshot.data().FullName);
            });
        } else {
          setUser(null);
        }
      });
    }, []);
    return user;
  }

  const user = GetCurrentUser();
  // console.log(user);

  return (
    <>
      <Navbar user={user} />
      <Products />
    </>
  );
}
