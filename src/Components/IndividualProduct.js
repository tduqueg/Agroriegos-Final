import React from 'react';

export default function IndividualProduct({ individualProduct }) {
  console.log(IndividualProduct);
  return (
    <div className="product">
      <div className="product-img">
        <img src={individualProduct.url} alt="product-img" />
      </div>
      <div className="product-text title">{individualProduct.title}</div>
      <div className="product-text description">
        {individualProduct.description}
      </div>
      <div className="product-text price">$ {individualProduct.price}</div>
      <div className="btn btn-danger btn-md cart-btn">Añadir al carrito</div>
    </div>
  );
}
