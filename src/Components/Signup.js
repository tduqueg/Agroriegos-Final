import React, { useState } from 'react';
import { Link } from 'react-router-dom';
export default function Signup() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSignup = (e) => {
    e.preventDefault();
    console.log(fullName, email, password);
  };
  return (
    <div className="container">
      <br></br>
      <br></br>
      <h1>Registrarse</h1>
      <hr></hr>
      <form className="form-group" autoComplete="off" onSubmit={handleSignup}>
        <label>Nombre completo</label>
        <input
          type="text"
          className="form-control"
          required
          onChange={(e) => setFullName(e.target.value)}
          value={fullName}
        ></input>
        <br></br>
        <label>Correo Eléctronico</label>
        <input
          type="email"
          className="form-control"
          required
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        ></input>
        <br></br>
        <label>Contraseña</label>
        <input
          type="password"
          className="form-control"
          required
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        ></input>
        <br></br>
        <div className="btn-box">
          <span>
            ¿Ya tienes una cuenta? Inicia Sesión
            <Link to="/login" className="link">
              {' '}
              Aquí
            </Link>
          </span>
          <button type="submit" className="btn btn-success btn-md">
            Registrate
          </button>
        </div>
      </form>
    </div>
  );
}
