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

  const [products, setProducts] = useState([]);

  const getProducts = async () => {
    const products = await fs.collection('Products').get();
    const productsArray = [];
    for (var snap of products.docs) {
      var data = snap.data();
      data.ID = snap.id;
      productsArray.push({
        ...data,
      });
      if (productsArray.length === products.docs.length) {
        setProducts(productsArray);
      }
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <>
      <Navbar user={user} />
      <br></br>
      {products.length > 0 && (
        <div className="container-fluid">
          <h1 className="text-center">Productos</h1>
          <div className="products-box">
            <Products products={products} />
          </div>
        </div>
      )}

      {products.length < 1 && (
        <div className="container-fluid">Por favor espera...</div>
      )}
    </>
  );
}
