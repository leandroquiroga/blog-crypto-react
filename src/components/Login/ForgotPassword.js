import React, { useRef, useState } from 'react';
import { useForm } from '../../hooks/useForm';
import {
  Button,
  Container,
  ContainerForm,
  Form,
  ImgLogin,
  Input,
  LoginScreen,
  SuccessSendEmail,
  TitleForm,
} from './LoginStyled'

import ReCAPTCHA from 'react-google-recaptcha';
import { useAuth } from './../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export const ForgotPassword = () => { 

  const [{email}, changeValue] = useForm({
    email: '',
  });

  const navigate = useNavigate();
  const [captchaValido, setCaptchaValido] = useState(false);
  const [succesEmail, setSuccesEmail] = useState('');
  const recaptcha = useRef(null);
  const { resetPassword } = useAuth();

  const handleValidateReCaptcha = () => {

    // Si la validacion es correcta, habilita el boton
    // de recuperar contraseña
    if (recaptcha.current.getValue()) {
      setCaptchaValido(true)
      return
    }
    setCaptchaValido(false);
  };


  // Permite recuperar la contraseña desde firestore
  // si es valido, muestra una alerta de sactifaccion
  // y nos redirige al componente login
  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await resetPassword(email);
      setSuccesEmail('Se te ha enviado un correo para recuperar tu contraseña');
      setTimeout(() => {
        setSuccesEmail('');
        navigate('/login', {
          replace: true,
        });
      }, 2500);

    } catch (error) {
      console.log(error.code);
    }
  }

  const keyReCaptcha = process.env.REACT_APP_RE_CAPCHA_KEY;
  const imgLogoPath = `/assets/svg/icon-title.svg`
  return (
    <LoginScreen>
      <Container>
        <ContainerForm>
          <Form onSubmit={handleResetPassword}>
            <TitleForm>Recupera tu contraseña</TitleForm>

            <ImgLogin
              src={imgLogoPath}
              alt= 'icon login'
            />
            
            <Input
              autoFocus
              type='email'
              name='email'
              value={email}
              onChange={changeValue}
              placeholder='Ingrese su email ...'
            /> 

            <ReCAPTCHA 
              ref={recaptcha}
              sitekey={keyReCaptcha}
              onChange={handleValidateReCaptcha}
            />

            {
              (succesEmail) &&
                <SuccessSendEmail >
                  {succesEmail}
                </SuccessSendEmail>
            } 

            {
              (captchaValido && (email !== '') ) && 
                <Button>  Recuperar contraseña </Button>
            }
          </Form>
        </ContainerForm> 
      </Container>
    </LoginScreen>
  )
}
