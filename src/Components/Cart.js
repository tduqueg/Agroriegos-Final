import React, { useEffect, useState } from 'react';
import { auth, fs } from '../Config/Config';
import CartProducts from './CartProducts';
import { Navbar } from './Navbar';
import StripeCheckout from 'react-stripe-checkout';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

toast.configure();

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

  //Realizando el cobro
  const navigate = useNavigate();

  const handleToken = async (token) => {
    //console.log(token);

    const cart = { name: 'All products', totalPrice };
    const response = await axios.post('http://localhost:8080/checkout', {
      token,
      cart,
    });
    console.log(response);
    let { status } = response.data;
    console.log(status);
    if (status === 'success') {
      navigate('/');
      toast.success('Tu orden ha sido tomada con exito', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
      });

      const uid = auth.currentUser.uid;
      const carts = await fs.collection('Cart ' + uid).get();
      for (var snap of carts.doc) {
        fs.collection('Cart ' + uid)
          .doc(snap.id)
          .delete();
      }
    } else {
      alert('Algo salió mal realizando la compra :(');
    }
  };

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
            <StripeCheckout
              stripeKey="pk_test_51LthRxHRPBXA1owAo7qQDi1Sxf6lub4JQtdG7poFRiKjedo33hCmDT7ctYvfVGHDzCjhu32sEYMPcWrAcRYO9aZN00jLVxG38x"
              token={handleToken}
              billingAddress
              shippingAddress
              name="Todos los productos"
              amount={totalPrice * 100}
              currency="COP"
            ></StripeCheckout>
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
