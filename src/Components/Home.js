import React, { useState, useEffect } from "react";
import { Navbar } from "./Navbar";
import Products from "./Products";
import { auth, fs } from "../Config/Config";
import { IndividualFilteredProduct } from "./IndividualFilteredProduct";

export default function Home(props) {
  // obtener la UID del usuario actual

  function GetUserUid() {
    const [uid, setUid] = useState(null);
    useEffect(() => {
      auth.onAuthStateChanged((user) => {
        if (user) {
          setUid(user.uid);
        }
      });
    });
    return uid;
  }

  const uid = GetUserUid();

  function GetCurrentUser() {
    const [user, setUser] = useState(null);
    useEffect(() => {
      auth.onAuthStateChanged((user) => {
        if (user) {
          fs.collection("Users")
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
    const products = await fs.collection("Products").get();
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

  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        fs.collection("Cart " + user.uid).onSnapshot((snapshot) => {
          const qty = snapshot.docs.length;
          setTotalProducts(qty);
        });
      }
    });
  }, []);

  let Product;

  //Función para añadir al carrito
  const addToCart = (product) => {
    if (uid !== null) {
      //console.log(product);
      Product = product;
      Product["qty"] = 1;
      Product["TotalProductPrice"] = Product.qty * Product.price;
      fs.collection("Cart " + uid)
        .doc(product.ID)
        .set(Product)
        .then(() => {
          console.log("Producto añadido al carro correctamente");
        });
    } else {
      props.history.push("/login");
    }
  };

  const [spans] = useState([
    { id: "diezcincuenta", text: "10-50m^2" },
    { id: "cincuentacien", text: "50-100m^2" },
    { id: "ciencuatrocientos", text: "100-400m^2" },
    { id: "cuatrocientos", text: "400+m^2" },
  ]);

  const [spansPresupuesto] = useState([
    { id: "quinientosmillon", text: "$ 500.000 - $ 1.000.000" },
    { id: "milloncincomillones", text: "$ 1.000.000 - $ 5.000.000" },
    { id: "cincomillonesdiezmillones", text: "$ 5.000.000 - $ 10.000.000" },
    { id: "diezmillonesveintemillones", text: "$ 10.000.000 - $ 20.000.000" },
    { id: "veintemillones", text: "$ 20.000.000+" },
  ]);

  const [spansTipo] = useState([
    { id: "DeCereales", text: "De Cereales" },
    { id: "Frutal", text: "Frutal" },
    { id: "Ornamental", text: "Ornamental" },
    { id: "RaicesYTuberculos", text: "Raíces y tubérculos" },
    { id: "Pastos", text: "Pastos" },
  ]);
  const [spansTipoRiego] = useState([
    { id: "PorAspersion", text: "Por aspersión" },
    { id: "PorDifusor", text: "Por difusor" },
    { id: "PorGoteo", text: "Por goteo" },
    { id: "PorCintasDeExudacion", text: "Por cintas de exudación" },
  ]);

  // active class state
  const [active, setActive] = useState("");

  // tamaño state
  const [tamaño, setTamaño] = useState("");
  const [presupuesto, setPresupuesto] = useState("");
  const [tipo, setTipo] = useState("");
  const [tipoRiego, setTipoRiego] = useState("");

  // handle change ... it will set tamaño and active states
  const handleChange = (individualSpan) => {
    setActive(individualSpan.id);
    setTamaño(individualSpan.text);
    filterFunction(individualSpan.text);
  };
  const handleChangePresupuesto = (individualSpan) => {
    setActive(individualSpan.id);
    setPresupuesto(individualSpan.text);
    filterFunctionPresupuesto(individualSpan.text);
  };
  const handleChangeTipo = (individualSpan) => {
    setActive(individualSpan.id);
    setTipo(individualSpan.text);
    filterFunctionTipo(individualSpan.text);
  };
  const handleChangeTipoRiego = (individualSpan) => {
    setActive(individualSpan.id);
    setTipoRiego(individualSpan.text);
    filterFunctionTipoRiego(individualSpan.text);
  };
  // filtered products state
  const [filteredProducts, setFilteredProducts] = useState([]);

  // filter function
  const filterFunction = (text) => {
    if (products.length > 1) {
      const filter = products.filter((product) => product.tamaño === text);
      setFilteredProducts(filter);
    } else {
      console.log("No hay productos para filtrar");
    }
  };

  const filterFunctionPresupuesto = (text) => {
    if (products.length > 1) {
      const filter = products.filter((product) => product.presupuesto === text);
      setFilteredProducts(filter);
    } else {
      console.log("No hay productos para filtrar");
    }
  };

  const filterFunctionTipo = (text) => {
    if (products.length > 1) {
      const filter = products.filter((product) => product.tipo === text);
      setFilteredProducts(filter);
    } else {
      console.log("No hay productos para filtrar");
    }
  };

  const filterFunctionTipoRiego = (text) => {
    if (products.length > 1) {
      const filter = products.filter((product) => product.tipoRiego === text);
      setFilteredProducts(filter);
    } else {
      console.log("No hay productos para filtrar");
    }
  };
  // return to all products
  const returntoAllProducts = () => {
    setActive("");
    setTamaño("");
    setFilteredProducts([]);
  };
  return (
    <>
      <Navbar user={user} totalProducts={totalProducts} />
      <br></br>
      <div className="container-fluid filter-products-main-box">
        <div className="filter-box">
          <h6>Filtrar por tamaño</h6>
          {spans.map((individualSpan, index) => (
            <span
              key={index}
              id={individualSpan.id}
              onClick={() => handleChange(individualSpan)}
              className={individualSpan.id === active ? active : "deactive"}
            >
              {individualSpan.text}
            </span>
          ))}
          <h6>Filtrar por presupuesto</h6>
          {spansPresupuesto.map((individualSpan, index) => (
            <span
              key={index}
              id={individualSpan.id}
              onClick={() => handleChangePresupuesto(individualSpan)}
              className={individualSpan.id === active ? active : "deactive"}
            >
              {individualSpan.text}
            </span>
          ))}

          <h6>Filtrar por tipo</h6>
          {spansTipo.map((individualSpan, index) => (
            <span
              key={index}
              id={individualSpan.id}
              onClick={() => handleChangeTipo(individualSpan)}
              className={individualSpan.id === active ? active : "deactive"}
            >
              {individualSpan.text}
            </span>
          ))}

          <h6>Filtrar por tipo de riego</h6>
          {spansTipoRiego.map((individualSpan, index) => (
            <span
              key={index}
              id={individualSpan.id}
              onClick={() => handleChangeTipoRiego(individualSpan)}
              className={individualSpan.id === active ? active : "deactive"}
            >
              {individualSpan.text}
            </span>
          ))}
        </div>
        {filteredProducts.length > 0 && (
          <div className="my-products">
            <h1 className="text-center">Productos filtrados</h1>
            <a
              className="regresar-productos"
              href="javascript:void(0)"
              onClick={returntoAllProducts}
            >
              Regresar a todos los productos
            </a>
            <div className="products-box">
              {filteredProducts.map((individualFilteredProduct) => (
                <IndividualFilteredProduct
                  key={individualFilteredProduct.ID}
                  individualFilteredProduct={individualFilteredProduct}
                  addToCart={addToCart}
                />
              ))}
            </div>
          </div>
        )}
        {filteredProducts.length < 1 && (
          <>
            {products.length > 0 && (
              <div className="my-products">
                <h1 className="text-center">Todos los productos</h1>
                <div className="products-box">
                  <Products products={products} addToCart={addToCart} />
                </div>
              </div>
            )}
            {products.length < 1 && (
              <div className="my-products please-wait">Por favor espera...</div>
            )}
          </>
        )}
      </div>
    </>
  );
}
