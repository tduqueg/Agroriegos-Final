import React from 'react';
import { Link } from 'react-router-dom';

export const Navbar = () => {
  return (
    <div>
      <Link to="signup">Registrarse</Link>
      <Link to="login">Iniciar Sesión</Link>
    </div>
  );
};
