import React from "react";

export default function IndividualFilteredProduct({
  individualProduct,
  addToCart,
}) {
  //console.log(IndividualProduct);
  const handleAddToCart = () => {
    addToCart(individualProduct);
  };

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
      <div className="btn btn-md  cart-btn" onClick={handleAddToCart}>
        Añadir al carrito
      </div>
    </div>
  );
}
