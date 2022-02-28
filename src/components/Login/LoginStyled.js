import styled  from 'styled-components';

const backgroundPath = `/assets/svg/back-banner-violet.svg`
// const backgroundPath = `/assets/img/background.jpg`

export const LoginScreen = styled.section`
  background-image: url(${backgroundPath});
  background-repeat: no-repeat;
  background-position: center center;
  background-attachment: fixed;
  background-size: cover;
  height: 100vh;
  background-color: #202020;

  @media(max-width: 593px){
    height: 75vh;
  }
`

export const ContainerForm = styled.article`
  background-color: #2d1b3380;  
  backdrop-filter: blur(20px);
  border-radius: 10px;
  margin: 8vh auto;
  max-width: 500px;
  width: 90%;

  @media(max-width: 593px){
    margin: 5vh auto;
  }
`

export const Container = styled.article`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  margin: 0 auto;

`

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 500px;
  padding: 10px;
  margin: 0 auto;


  @media (max-width: 593px) {
    width: 90%;
  }
`

export const TitleForm = styled.h2`
  font-size: 1.5rem;
  color: #fff;
  text-align: center;
  width: 100%;
  
  @media(max-width: 593px){
    font-size: 1.3rem;
  }
`

export const ImgLogin = styled.img`
  padding: 10px;
  width: 75px;

  @media(max-width: 593px){
    width: 60px;
  }
`

export const Input = styled.input`
  width: 80%;
  border: none;
  border-bottom: 1px solid #FFF ;
  margin: 10px;
  font-size: 1rem;
  background-color: transparent;
  color: #FFF;
  outline: none;
  padding: 8px;

  &::placeholder{
    color: #CCC
  }

  @media(max-width: 593px){
    width: 100%;
  }
`

export const Button = styled.button`
  width: 80%;
  padding: 8px;
  background-color: #FFF;
  color: #202020;
  cursor: pointer;
  border: none;
  outline: none;
  border-radius: 15px;
  margin-top: 10px;

  @media(max-width: 593px){
    width: 100%;
  }
`

export const TextInfo = styled.p`
  color: #FFF;
  font-size: .9rem;
  font-weight: 400;
  margin: 10px auto;
  text-align: center;

  a {
    color: #FFF;
    text-decoration: none;    
    transition: all 1s ease-in-out;
  }
`

export const ButtonLoginGoogle = styled.button`
  width: 50%;
  padding: 8px;
  background-color: #FFF;
  color: #202020;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border: none;
  outline: none;
  cursor: pointer;
  margin: 5px auto;
  border-radius: 10px;

  @media(max-width: 490px){
    width: 65%;
  }
`

export const ImageGoogle = styled.img`  
  width: 25px;
  margin: 0 5px;
`

export const TextInfoGoogle = styled.p`
  font-size: .9rem;
  font-weight: 400;
  margin: 0 5px;
`

export const ErrorInput = styled.div`
  background-color: #ff2c2cd2;
  border-color: #FF0000;
  color: #fff;
  text-align: center;
  text-transform: uppercase;
  width: 75%;
  margin: 0 auto;
  font-size: .9rem;
  border-radius: 8px;
  padding: 8px;
`
export const TextForgotPassword = styled.div`
  text-align: center;
  
  a{
    margin: 8px auto;
    font-size: .9rem;
    text-decoration: none;
    color: #FFF;
    cursor: pointer;
    transition: all 1s ease-in-out;
    
  }
`

export const SuccessSendEmail = styled.div`
  background-color: #4fff5e77;
  border: #02f817;
  color: #fff;
  text-align: center;
  text-transform: uppercase;
  width: 75%;
  margin: 10px auto;
  font-size: .9rem;
  border-radius: 8px;
  padding: 8px;
`