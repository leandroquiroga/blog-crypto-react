import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../helpers/helpers';
import { useForm } from '../../hooks/useForm'
import { useAuth } from './../../hooks/useAuth';
import {
  Button,
  ButtonLoginGoogle,
  Container,
  ContainerForm,
  ErrorInput,
  Form,
  ImageGoogle,
  ImgLogin,
  Input,
  LoginScreen,
  TextForgotPassword,
  TextInfo,
  TextInfoGoogle,
  TitleForm
} from './LoginStyled'

export const Login = () => {

  const { logIn, loginWithGoogle } = useAuth();
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [valueForm, changeValue] = useForm({
    email: '',
    password: ''
  });

  const svgGooglePath = `/assets/svg/google-icon.svg`
  const { email, password } = valueForm;


  // Loggea al usuario
  const handleSubmit = (e) => {
    e.preventDefault();

    loginUser(valueForm, setError, logIn, navigate)
  };

  // loggea al usuario desde una cuenta viculada a google
  const handleLoginWithGoogle =  async() => {
    await loginWithGoogle();
  }
  const imgLogoPath = `/assets/svg/icon-title.svg`
  return (
    <LoginScreen>
      <Container>
        <ContainerForm>
          <Form onSubmit={handleSubmit}>
            <TitleForm>Inicia Sesión</TitleForm>

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

            <Input
              type='password'
              name='password'
              value={password}
              onChange={changeValue}
              placeholder='Ingrese su contraseña ...'
            />
            {
              error &&
                <ErrorInput>
                  {error}  
                </ErrorInput>
            }
            <Button>
              Iniciar sesión
            </Button>
            <TextForgotPassword >
              <Link to='/login/reset-password'>
                ¿Olvidaste tu contraseña?
              </Link>
            </TextForgotPassword>
          </Form>
          <ButtonLoginGoogle onClick={handleLoginWithGoogle}>
              <ImageGoogle 
                src={svgGooglePath}
                alt='icon google'
              />
              <TextInfoGoogle>
                Inicia sesión con Google
              </TextInfoGoogle>
          </ButtonLoginGoogle>
          <TextInfo >
            ¿No tienes cuenta? {' '}
            <Link to='/register'>
                Registrate
            </Link>
          </TextInfo>
        </ContainerForm> 
      </Container>
    </LoginScreen>
  )
}
