import styled from 'styled-components';

export const Nav = styled.nav`
  width: 100%;
  height: 50px;
  background-color: #5f127c;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  .nav-navbar--img{
    cursor: pointer;
  } 
  
`
export const SectionNav = styled.section`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  transition: .5s all ease-out; 

  
  a {
    color: #FFF;
    font-size: .9rem;
    margin: 0 10px;
    text-align: center;
    text-decoration: none;
    border: none;
    transition: all .1s ease-in-out;

    &:hover{
      color: #CCC;
      transition: all .1s ease-in-out;
      border-bottom: 1px solid #FFF;
    }
    
  }

  @media(max-width: 893px){
    background-color: #5f127c;
    height: 35px;
    width: 100%;
    display: block;
    position: absolute;
    top: 50px;
    right: 0;
    transition: .5s all ease-out; 
    transform: translateY(-6000%);
    text-align: center;
  } 

  
`

export const CicleLetter = styled.div`
  background-color: #FFF;
  width: 30px;
  text-align: center;
  text-transform: uppercase;
  font-weight: 600;
  border-radius: 50%;
  cursor: pointer;
  transition: all .5s ease-in-out;
  margin: 0 10px;

  &:hover{
    background-color: #5f127c;
    color: #FFF;
    border: 1px solid #FFF;
    transition: all .5s ease-in-out;
  }
`

export const CicleImg = styled.img`
  width: 30px;
  border-radius: 80%;
  margin: 0 10px;
`

export const Logout = styled.img`
  margin: 0 15px;
  cursor: pointer;
`

export const ButtonMenuBar = styled.button`
  background-color: transparent;
  outline: none;
  border: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
  display: none;
  opacity: 0;

  @media(max-width: 893px){
    display: block;
    overflow: visible;
    opacity: 1;
    cursor: pointer;
  }
`


export const SectionIcons = styled.article`
  display: flex;
  justify-content: center;
`