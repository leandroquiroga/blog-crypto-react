import React, { useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from './../../hooks/useAuth';
import { auth } from './../../firabase.config';
import { firsLetter } from '../../helpers/helpers';
import { useStorage } from './../../hooks/useStorage';
import {
  Nav,
  SectionNav,
  Logout,
  CicleLetter,
  CicleImg,
  SectionIcons,
  ButtonMenuBar
} from './NavStyled'

export const Navbar = () => {
  
  const [showMenu, setShowMenu] = useState(false)
  const { logOut, user } = useAuth();
  const { setArrCryptos } = useStorage();
  const menuNav = useRef(null);
  const { displayName, email, photoURL } = user;
  const imgPath = `/assets/svg/icon-title.svg`
  const logutPath = `/assets/svg/logout.svg`;
  const menuPath = `/assets/svg/menu.svg`;
  

  // Realiza un Logout del usuario, al reiniciar el estado
  // del arreglo a un arreglo vacio es en caso que el 
  // usuario nuevo no traiga ningun elemento desde la base de datos. 
  const handleLogout = async () => {

    try {
      await logOut(auth);
      setArrCryptos([])
    } catch (error) {
      console.log(error)
    }
  }

  // Muestra el menu en caso que se encuentre desde un dispositivo movil
  const handleShowMenu = () => {
    setShowMenu(!showMenu);
    
    if (showMenu) {
      menuNav.current.style = 'transform: translateY(0)'
    } else {
      menuNav.current.style = 'transform: translateY(-6000%)';
    };

  }
  return (
    <Nav>
      <Link
        className='nav-navbar--img'
        to='/'
      >
        <img 
          src={imgPath}
          alt='icon title navbar'
        />
      </Link>
      <SectionNav
        ref={menuNav}
      >
        <NavLink
          to='/'
        >
          Noticias
        </NavLink>
        <NavLink
          to='/dashboard'
        >
          Dashboard
        </NavLink>
        <NavLink
          to='/portfolio'
        >
          Portfolio
        </NavLink>
      </SectionNav>
      <SectionIcons>
        {(
          {/* 
              Si iniciamos con google muestra su foto de perfil, en caso contrario, 
              mostrara la primera letra de su nombre
           */}
          (displayName) ?
            <CicleImg
              src={photoURL}
              alt= 'photo perfil'
            />
          :
            <CicleLetter>{firsLetter(email)}</CicleLetter>
        )}
        <Logout
          src={logutPath}
          alt='Logout icon'
          onClick={handleLogout}
        />
        <ButtonMenuBar onClick={handleShowMenu}>

          <img 
            src={menuPath}
            alt='menu'
          />
        </ButtonMenuBar>
      </SectionIcons>

    </Nav>
  )
}
