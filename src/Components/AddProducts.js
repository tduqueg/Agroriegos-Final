import React from 'react';

export default function AddProducts() {
  return (
    <div className="container">
      <br></br>
      <br></br>
      <h1>Añadir productos</h1>
      <hr></hr>

      <form autoComplete="off" className="form-group">
        <label>Titulo del producto</label>
        <input type="text" className="form-control" required></input>
        <br></br>
        <label>Descripción del producto</label>
        <input type="text" className="form-control" required></input>
        <br></br>
        <label>Precio del producto</label>
        <input type="number" className="form-control" required></input>
        <br></br>
        <label>Subir la imagen del producto</label>
        <input type="file" id="file" className="form-control" required></input>
        <br></br>
        <div style={{ display: 'flex', jusrtifyContent: 'flex-end' }}>
          <button type="submit" className="btn btn-success btn-md">
            Subir el producto
          </button>
        </div>
      </form>
    </div>
  );
}
