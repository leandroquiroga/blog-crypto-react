import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../../helpers/helpers';
import { useAuth } from '../../hooks/useAuth';
import { useForm } from '../../hooks/useForm'
import {
  Button,
  Container,
  ContainerForm,
  ErrorInput,
  Form,
  ImgLogin,
  Input,
  LoginScreen,
  TextInfo,
  TitleForm
} from './LoginStyled'


export const Register = () => {
  const [error, setError] = useState('');
  const [valueForm, changeValue] = useForm({
    email: '',
    password: '',
    passwordConfirm: ''
  });

  const navigate = useNavigate();
  const {signUp} = useAuth();

  const { email, password, passwordConfirm } = valueForm;

  // registra un nuevo usuario
  const handleSubmit = (e) => {
    e.preventDefault();

    registerUser(valueForm, setError, signUp, navigate);
  }

  const imgLogoPath = `/assets/svg/icon-title.svg`
  return (
    <LoginScreen>
      <Container>
        <ContainerForm>
          <Form onSubmit={handleSubmit}>
            <TitleForm>Registrate</TitleForm>

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
            
            <Input
              type='password'
              name='passwordConfirm'
              value={passwordConfirm}
              onChange={changeValue}
              placeholder='Confirma su contraseña ...'
            />
            {
              error &&
                <ErrorInput>
                  {error}  
                </ErrorInput>
            }
            <Button>
              Registrarse
            </Button>
            <TextInfo >
              ¿Ya tienes cuenta? {' '}
              <Link to='/Login'>
                Inicia sesión
              </Link>
            </TextInfo>
          </Form>
        </ContainerForm>
      </Container>
    </LoginScreen>
  )
}
