import React, { useState } from 'react';
import { storage, fs } from '../Config/Config';

export default function AddProducts() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [tamaño, setTamaño] = useState('');
  const [presupuesto, setPresupuesto] = useState('');
  const [tipo, setTipo] = useState('');
  const [tipoRiego, setTipoRiego] = useState('');
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
                presupuesto,
                tipo,
                tipoRiego,
                price: Number(price),
                url,
              })
              .then(() => {
                setSuccessMsg('El producto se añadió correctamente');
                setTitle('');
                setDescription('');
                setTamaño('');
                setPresupuesto('');
                setTipo('');
                setTipoRiego('');
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
          <option value="">Seleccione una de las opciones</option>
          <option>10-50m^2</option>
          <option>50-100m^2</option>
          <option>100-400m^2</option>
          <option>400+m^2</option>
        </select>
        <br></br>
        <label>Presupuesto del cultivo objetivo del producto</label>
        <select
          className="form-control"
          required
          value={presupuesto}
          onChange={(e) => setPresupuesto(e.target.value)}
        >
          <option value="">Seleccione una de las opciones</option>
          <option>$ 500.000 - $ 1.000.000</option>
          <option>$ 1.000.000 - $ 5.000.000</option>
          <option>$ 5.000.000 - $ 10.000.000</option>
          <option>$ 10.000.000 - $ 20.000.000</option>
          <option>$ 20.000.000+</option>
        </select>
        <br></br>
        <label>Tipo de cultivo objetivo del producto</label>
        <select
          className="form-control"
          required
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
        >
          <option value="">Seleccione una de las opciones</option>
          <option>De cereales</option>
          <option>Frutal</option>
          <option>Ornamental</option>
          <option>Raíces y tubérculos</option>
          <option>Pastos</option>
        </select>
        <br></br>
        <label>Tipo de riego objetivo del producto</label>
        <select
          className="form-control"
          required
          value={tipoRiego}
          onChange={(e) => setTipoRiego(e.target.value)}
        >
          <option value="">Seleccione una de las opciones</option>
          <option>Por aspersión</option>
          <option>Por difusor</option>
          <option>Por goteo</option>
          <option>Por cintas de exudación</option>
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
