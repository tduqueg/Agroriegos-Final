import React, { useState } from "react";
import { auth, fs } from "../Config/Config";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Navbar } from "./Navbar";
export default function Signup() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();
    //console.log(fullName, email, password);
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((credentials) => {
        console.log(credentials);
        fs.collection("Users")
          .doc(credentials.user.uid)
          .set({
            FullName: fullName,
            Email: email,
            Password: password,
          })
          .then(() => {
            setSuccessMsg(
              "Su registro fue exitoso, serás redireccionado al inicio de sesión"
            );
            setFullName("");
            setEmail("");
            setPassword("");
            setErrorMsg("");
            setTimeout(() => {
              setSuccessMsg("");
              navigate("/login");
            }, 3000);
          })
          .catch((error) => setErrorMsg(error.message));
      })
      .catch((error) => {
        setErrorMsg(error.message);
      });
  };
  return (
    <div className="container">
      <Navbar />
      <br></br>
      <br></br>
      <h1>Registrarse</h1>
      <hr></hr>
      {successMsg && (
        <>
          <div className="succes-msg">{successMsg}</div>
          <br></br>
        </>
      )}
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
              {" "}
              Aquí
            </Link>
          </span>
          <button type="submit" className="btn btn-success btn-md">
            Registrate
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
