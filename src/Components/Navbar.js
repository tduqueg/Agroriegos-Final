import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../images/logo.png';
import { Icon } from 'react-icons-kit';
import { shoppingCart } from 'react-icons-kit/feather/shoppingCart';
import { auth } from '../Config/Config';
import { useNavigate } from 'react-router-dom';

export const Navbar = ({ user, totalProducts }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.signOut().then(() => {
      navigate('/login');
    });
  };

  return (
    <div className="navbar">
      <div className="leftside">
        <div className="logo">
          <img src={logo} alt="logo" />
        </div>
      </div>
      <div className="rightside">
        <div>
          {!user && (
            <>
              <Link className="navlink" to="signup">
                Registrarse
              </Link>
              <Link className="navlink" to="login">
                Iniciar Sesión
              </Link>
            </>
          )}

          {user && (
            <>
              <div>
                <Link className="navlink" to="/">
                  {user}
                </Link>
              </div>
              <div className="cart-menu-btn">
                <Link className="navlink" to="/cart">
                  <Icon icon={shoppingCart} size={20} />
                </Link>
                <span className="cart-indicator">{totalProducts}</span>
              </div>
              <div className="btn btn-danger btn-md" onClick={handleLogout}>
                LOGOUT
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
