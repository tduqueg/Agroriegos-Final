import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    console.log(email, password);
  };

  return (
    <div className="container">
      <br></br>
      <br></br>
      <h1>Iniciar Sesión</h1>
      <hr></hr>
      <form className="form-group" autoComplete="off" onSubmit={handleLogin}>
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
            ¿No tienes una cuenta? Registrate
            <Link to="/signup" className="link">
              {' '}
              Aquí
            </Link>
          </span>
          <button type="submit" className="btn btn-success btn-md">
            Inicia Sesión
          </button>
        </div>
      </form>
    </div>
  );
}
