import React, { useEffect, useState } from 'react';
import { auth, fs } from '../Config/Config';
import CartProducts from './CartProducts';
import { Navbar } from './Navbar';
import StripeCheckout from 'react-stripe-checkout';

export default function Cart() {
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

  // Productos del carrito
  const [cartProducts, setCartProducts] = useState([]);

  //Sacando los productos de Firebase para colocarlos en el carrito

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        fs.collection('Cart ' + user.uid).onSnapshot((snapshot) => {
          const newCartProduct = snapshot.docs.map((doc) => ({
            ID: doc.id,
            ...doc.data(),
          }));
          setCartProducts(newCartProduct);
        });
      } else {
        console.log(
          'El usuario deberá iniciar sesión para visualizar el carrito '
        );
      }
    });
  }, []);

  //console.log(cartProducts);

  //Función para obtener la cantidad total de productos del carrito
  const qty = cartProducts.map((cartProduct) => {
    return cartProduct.qty;
  });

  const reducerOfQty = (accumulator, currentValue) =>
    accumulator + currentValue;

  const totalQty = qty.reduce(reducerOfQty, 0);

  //Función para obtener el precio total de los productos del carrito
  const price = cartProducts.map((cartProduct) => {
    return cartProduct.TotalProductPrice;
  });

  const reducerOfPrice = (accumulator, currentValue) =>
    accumulator + currentValue;

  const totalPrice = price.reduce(reducerOfPrice, 0);
  //Variable global
  let Product;

  //Función para incrementar la cantidad de unidades de un elemento
  const cartProductIncrease = (cartProduct) => {
    //console.log(cartProduct);
    Product = cartProduct;
    Product.qty = Product.qty + 1;
    Product.TotalProductPrice = Product.qty * Product.price;

    //Actualizar en la base de datos
    auth.onAuthStateChanged((user) => {
      if (user) {
        fs.collection('Cart ' + user.uid)
          .doc(cartProduct.ID)
          .update(Product)
          .then(() => {
            console.log('Incremento de unidades realizado');
          });
      } else {
        console.log(
          'El usuario no ha iniciado sesión para modificar las cantidades del carrito'
        );
      }
    });
  };

  //Función para decrementar la cantidad de unidades de un elemento
  const cartProductDecrease = (cartProduct) => {
    Product = cartProduct;
    if (Product.qty > 1) {
      Product.qty = Product.qty - 1;
      Product.TotalProductPrice = Product.qty * Product.price;

      //actualizando la base de datos Firebase
      auth.onAuthStateChanged((user) => {
        if (user) {
          fs.collection('Cart ' + user.uid)
            .doc(cartProduct.ID)
            .update(Product)
            .then(() => {
              console.log('Decremento de unidades realizado');
            });
        } else {
          console.log(
            'El usuario no ha iniciado sesión para modificar las cantidades del carrito'
          );
        }
      });
    }
  };

  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        fs.collection('Cart ' + user.uid).onSnapshot((snapshot) => {
          const qty = snapshot.docs.length;
          setTotalProducts(qty);
        });
      }
    });
  }, []);

  return (
    <>
      <Navbar user={user} totalProducts={totalProducts} />
      <br></br>
      {cartProducts.length > 0 && (
        <div className="container-fluid">
          <h1 className="text-center">Carrito</h1>
          <div className="products-box">
            <CartProducts
              cartProducts={cartProducts}
              cartProductIncrease={cartProductIncrease}
              cartProductDecrease={cartProductDecrease}
            />
          </div>
          <div className="summary-box">
            <h5>Resumen del carrito</h5>
            <br></br>
            <div>
              Cantidad total de productos <span>{totalQty}</span>
            </div>
            <div>
              Costo total del carrito <span>$ {totalPrice}</span>
            </div>
            <br></br>
            <StripeCheckout></StripeCheckout>
          </div>
        </div>
      )}
      {cartProducts.length < 1 && (
        <div className="container-fluid">
          No tienes productos en el carrito :(
        </div>
      )}
    </>
  );
}
