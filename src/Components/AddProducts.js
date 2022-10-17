import React, { useState } from 'react';
import { storage, fs } from '../Config/Config';

export default function AddProducts() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [tamaño, setTamaño] = useState('');
  const [image, setImage] = useState(null);

  const [imageError, setImageError] = useState('');

  const [successMsg, setSuccessMsg] = useState('');
  const [uploadError, setUploadError] = useState('');

  const types = ['image/jpg', 'image/jpeg', 'image/png', 'image/PNG'];
  const handleProductImg = (e) => {
    let selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile && types.includes(selectedFile.type)) {
        setImage(selectedFile);
        setImageError('');
      } else {
        setImage(null);
        setImageError('Por favor seleccione un formato válido de imagen');
      }
    } else {
      console.log('Por favor seleccione su imagen (png o jpg)');
    }
  };

  const handleAddProducts = (e) => {
    e.preventDefault();
    //console.log(title, description, price);
    //console.log(image);
    const uploadTask = storage.ref(`product-images/${image.name}`).put(image);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(progress);
      },
      (error) => setUploadError(error.message),
      () => {
        storage
          .ref('product-images')
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            fs.collection('Products')
              .add({
                title,
                description,
                tamaño,
                price: Number(price),
                url,
              })
              .then(() => {
                setSuccessMsg('El producto se añadió correctamente');
                setTitle('');
                setDescription('');
                setTamaño('');
                setPrice('');
                document.getElementById('file').value = '';
                setImageError('');
                setUploadError('');
                setTimeout(() => {
                  setSuccessMsg('');
                }, 3000);
              })
              .catch((error) => setUploadError(error.message));
          });
      }
    );
  };

  return (
    <div className="container">
      <br></br>
      <br></br>
      <h1>Añadir productos</h1>
      <hr></hr>
      {successMsg && (
        <>
          <div className="success-msg">{successMsg}</div>
        </>
      )}
      <form
        autoComplete="off"
        className="form-group"
        onSubmit={handleAddProducts}
      >
        <label>Titulo del producto</label>
        <input
          type="text"
          className="form-control"
          required
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        ></input>
        <br></br>
        <label>Descripción del producto</label>
        <input
          type="text"
          className="form-control"
          required
          onChange={(e) => setDescription(e.target.value)}
          value={description}
        ></input>
        <br></br>
        <label>Precio del producto</label>
        <input
          type="number"
          className="form-control"
          required
          onChange={(e) => setPrice(e.target.value)}
          value={price}
        ></input>
        <br></br>
        <label>Tamaño del cultivo objetivo del producto</label>
        <select
          className="form-control"
          required
          value={tamaño}
          onChange={(e) => setTamaño(e.target.value)}
        >
          <option value="">
            Seleccione tamaño del cultivo que mejor se adapta al producto
          </option>
          <option>Entre 10-50m</option>
          <option>Entre 50-100m</option>
          <option>Entre 100-400m</option>
          <option>Entre 400+m</option>
        </select>
        <br></br>
        <label>Subir la imagen del producto</label>
        <input
          type="file"
          id="file"
          className="form-control"
          required
          onChange={handleProductImg}
        ></input>
        <br></br>
        {imageError && (
          <>
            <br></br>
            <div className="error-msg">{imageError}</div>
          </>
        )}
        <div style={{ display: 'flex', jusrtifyContent: 'flex-end' }}>
          <button type="submit" className="btn btn-success btn-md">
            Subir el producto
          </button>
        </div>
      </form>
      {uploadError && (
        <>
          <br></br>
          <div className="error-msg">{uploadError}</div>
        </>
      )}
    </div>
  );
}
