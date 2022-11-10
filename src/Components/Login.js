import React, { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../Config/Config";
import { useNavigate } from "react-router-dom";
import { Navbar } from "./Navbar";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    //console.log(email, password);
    auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        setSuccessMsg(
          "Inicio de sesión exitoso, serás redireccionado a la página principal"
        );
        setEmail("");
        setPassword("");
        setErrorMsg("");
        setTimeout(() => {
          setSuccessMsg("");
          navigate("/");
        }, 3000);
      })
      .catch((error) => setErrorMsg(error.message));
  };

  return (
    <div className="container">
      <Navbar />
      <br></br>
      <br></br>
      <h1>Iniciar Sesión</h1>
      <hr></hr>
      {successMsg && (
        <>
          <div className="succes-msg">{successMsg}</div>
          <br></br>
        </>
      )}
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
              {" "}
              Aquí
            </Link>
          </span>
          <button type="submit" className="btn btn-success btn-md">
            Inicia Sesión
          </button>
        </div>
      </form>
      {errorMsg && (
        <>
          <br></br>
          <div className="error-msg">{errorMsg}</div>
        </>
      )}
    </div>
  );
}
