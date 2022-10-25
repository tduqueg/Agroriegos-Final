import React, { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import Products from './Products';
import { auth, fs } from '../Config/Config';
import IndividualFilteredProducts from './IndividualFilteredProducts';

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

  let Product;

  //Función para añadir al carrito
  const addToCart = (product) => {
    if (uid !== null) {
      //console.log(product);
      Product = product;
      Product['qty'] = 1;
      Product['TotalProductPrice'] = Product.qty * Product.price;
      fs.collection('Cart ' + uid)
        .doc(product.ID)
        .set(Product)
        .then(() => {
          console.log('Producto añadido al carro correctamente');
        });
    } else {
      props.history.push('/login');
    }
  };

  //filtros usando span tag

  const [spansTamaño] = useState([
    { id: 'diezcincuenta', text: '10-50m^2' },
    { id: 'cincuentacien', text: '50-100m^2' },
    { id: 'ciencuatrocientos', text: '100-400m^2' },
    { id: 'cuatrocientos', text: '400+m^2' },
  ]);
  const [spansPresupuesto] = useState([
    { id: 'quinientosmillon', text: '$ 500.000 - $ 1.000.000' },
    { id: 'milloncincomillones', text: '$ 1.000.000 - $ 5.000.000' },
    { id: 'cincomillonesdiezmillones', text: '$ 5.000.000 - $ 10.000.000' },
    { id: 'diezmillonesveintemillones', text: '$ 10.000.000 - $ 20.000.000' },
    { id: 'veintemillones', text: '$ 20.000.000+' },
  ]);
  const [spansTipo] = useState([
    { id: 'DeCereales', text: 'De Cereales' },
    { id: 'Frutal', text: 'Frutal' },
    { id: 'Ornamental', text: 'Ornamental' },
    { id: 'RaicesYTuberculos', text: 'Raíces y tubérculos' },
    { id: 'Pastos', text: 'Pastos' },
  ]);
  const [spansTipoRiego] = useState([
    { id: 'PorAspersion', text: 'Por aspersión' },
    { id: 'PorDifusor', text: 'Por difusor' },
    { id: 'PorGoteo', text: 'Por goteo' },
    { id: 'PorCintasDeExudacion', text: 'Por cintas de exudación' },
  ]);

  const [active, setActive] = useState('');



  const handleChangeTamaño = (individualSpansTamaño) => {
    setActive(individualSpansTamaño.id);
    filterFunctionTamaño(individualSpansTamaño.text);
  };

  const [presupuesto, setPresupuesto] = useState('');

  const handleChangePresupuesto = (individualSpansPresupuesto) => {
    setActive(individualSpansPresupuesto.id);
    setPresupuesto(individualSpansPresupuesto.text);
    filterFunctionPresupuesto(individualSpansPresupuesto.text);
  };

  const [tipo, setTipo] = useState('');

  const handleChangeTipo = (individualSpansTipo) => {
    setActive(individualSpansTipo.id);
    setTipo(individualSpansTipo.text);
    filterFunctionTipo(individualSpansTipo.text);
  };

  const [tipoRiego, setTipoRiego] = useState('');

  const handleChangeTipoRiego = (individualSpansTipoRiego) => {
    setActive(individualSpansTipoRiego.id);
    setTipoRiego(individualSpansTipoRiego.text);
    filterFunctionTipoRiego(individualSpansTipoRiego.text);
  };

  const handleChange = (individualSpans) => {
    filterFunction(individualSpans.text);
  };
  //filtro de productos
  const [filteredProductsTamaño, setFilteredProductsTamaño] = useState([]);
  const [filteredProductsPresupuesto, setFilteredProductsPresupuesto] =
    useState([]);
  const [filteredProductsTipo, setFilteredProductsTipo] = useState([]);
  const [filteredProductsTipoRiego, setFilteredProductsTipoRiego] = useState(
    []
  );
  const [filteredProducts, setFilteredProducts] = useState([]);

  const filterFunction = (text) => {};
  //función para filtrar productos

  const filterFunctionTamaño = (text) => {
    const filterTamaño = products.filter((product) => product.tamaño === text);
    setFilteredProductsTamaño(filterTamaño);
  };

  const filterFunctionPresupuesto = (text) => {
    const filterPresupuesto = products.filter(
      (product) => product.presupuesto === text
    );
    setFilteredProductsPresupuesto(filterPresupuesto);
  };
  const filterFunctionTipo = (text) => {
    const filterTipo = products.filter((product) => product.tipo === text);
    setFilteredProductsTipo(filterTipo);
  };
  const filterFunctionTipoRiego = (text) => {
    const filterTipoRiego = products.filter(
      (product) => product.tipoRiego === text
    );
    setFilteredProductsTipoRiego(filterTipoRiego);
  };

  return (
    <>
      <Navbar user={user} totalProducts={totalProducts} />
      <br></br>
      <div className="container-fluid filter-products-main-box">
        <div className="filter-box">
          <h6>Filtrar por tamaño de cultivo </h6>

          {spansTamaño.map((individualSpansTamaño, index) => (
            <span
              key={index}
              id={individualSpansTamaño.id}
              onClick={() => handleChangeTamaño(individualSpansTamaño)}
              className={
                individualSpansTamaño.id === active ? active : 'deactive'
              }
            >
              {individualSpansTamaño.text}
            </span>
          ))}
          <h6>Filtrar por presupuesto del cultivo </h6>
          {spansPresupuesto.map((individualSpansPresupuesto, index) => (
            <span
              key={index}
              id={individualSpansPresupuesto.id}
              onClick={() =>
                handleChangePresupuesto(individualSpansPresupuesto)
              }
              className={
                individualSpansPresupuesto.id === active ? active : 'deactive'
              }
            >
              {individualSpansPresupuesto.text}
            </span>
          ))}
          <h6>Filtrar por tipo de cultivo </h6>
          {spansTipo.map((individualSpansTipo, index) => (
            <span
              key={index}
              id={individualSpansTipo.id}
              onClick={() => handleChangeTipo(individualSpansTipo)}
              className={
                individualSpansTipo.id === active ? active : 'deactive'
              }
            >
              {individualSpansTipo.text}
            </span>
          ))}
          <h6>Filtrar por tipo de riego </h6>
          {spansTipoRiego.map((individualSpansTipoRiego, index) => (
            <span
              key={index}
              id={individualSpansTipoRiego.id}
              onClick={() => handleChangeTipoRiego(individualSpansTipoRiego)}
              className={
                individualSpansTipoRiego.id === active ? active : 'deactive'
              }
            >
              {individualSpansTipoRiego.text}
            </span>
          ))}
        </div>
        {filteredProducts.length > 0 && <IndividualFilteredProducts />}
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
