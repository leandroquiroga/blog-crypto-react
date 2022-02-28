import React, { useState } from 'react';
import {
  CardCoins,
  FullNameCoin,
  ImageCoin,
} from '../../Dashboard/DahboardStyled'
import {
  ButtonContianer,
  ButtonCotizar,
  FormCotizador,
  SearchPrice,
  SelectCoins,
} from '../PortfolioStyled';
import { ResultCurrent } from './ResultCurrent';
import { messageErrorAuth, notifySuccess } from './../../../helpers/helpers';
import { ErrorInput } from './../../Login/LoginStyled';

import {
  LeadingActions,
  SwipeableList,
  SwipeableListItem,
  SwipeAction,
  TrailingActions,
} from 'react-swipeable-list';
import 'react-swipeable-list/dist/styles.css';
import { useStorage } from './../../../hooks/useStorage';
import { useAuth } from './../../../hooks/useAuth';
import { ToastContainer } from 'react-toastify';


export const CardPorfolio = ({ coins }) => {
  const { name, symbol, rank, image, id } = coins;

  const { user } = useAuth();
  const { deleteDocument, arrCryptos } = useStorage();

  const { email } = user;
  const [error, setError] = useState('');
  const [showSearh, setShowSearch] = useState(false);
  const [fetchSuccess, setFetchSuccess] = useState(false);
  const [option, setOption] = useState('');
  const [coinsSeletcted, setCoinsSeletcted] = useState({});


  // Filtra todos elementos exeptuando el id selecciondo,
  // se cominica con la bases de datos para eliminarlo y 
  // actualiza el arrCrypto
  
  const handleDeleteCrypto = (id) => {
    
    const newArray = arrCryptos.filter(crypto => crypto.id !== id);
    deleteDocument(email, newArray);

    notifySuccess('Se ha eliminado una crypto de tu porfolio')
  }

  // Permite activar y desactivar el menu para cotizar
  // las criptomonedas segun el valor de la moneda seleccionada
  const handleSearch = () => {
    setShowSearch(!showSearh);
    setFetchSuccess(false);
    setOption('')
    setCoinsSeletcted({
      optionCurrently: '',
      cryptoCurrently: '',
    });
  };
  // Antes de enviar la informacion al endpoin
  // verificamos si esta vacio, si no hace la peticion
  // a la api
  const handleFetchCurrency = (e) => {

    e.preventDefault();
    if ([option].includes('')) {
      setFetchSuccess(false);
      messageErrorAuth('fetch-invalid', setError);
      return
    };

    setShowSearch(!showSearh);
    setCoinsSeletcted({
      optionCurrently: option,
      cryptoCurrently: symbol.toUpperCase(),
    });
    setFetchSuccess(true);
  };  

  // Cuando deslizemos el componente hacia ambos lados
  // vamos a poder eliminar el elemento. 

  const leadingActions = () => (
    <LeadingActions>
      <SwipeAction
        destructive={true}
        onClick={() => handleDeleteCrypto(id)}
      >
        Eliminar
      </SwipeAction>
    </LeadingActions>
  )

  const trailingActions = () => (
    <TrailingActions>
      <SwipeAction
        destructive={true}
        onClick={() => handleDeleteCrypto(id)}
      >
        Eliminar
      </SwipeAction>
    </TrailingActions>
  )


  // Realizar un formulario en para cuando se realze un submit 
  // recuperemos los valores de la moneda actual y el crypto actual
  return (
    <>
      <SwipeableList>
      
        <SwipeableListItem
          leadingActions={leadingActions()}
          trailingActions={trailingActions()}
        >
          <CardCoins>

        
            <ButtonContianer onClick={handleSearch}>
              <FullNameCoin>
                {name} <br />
                <small>{symbol}{' | '}Rank: {`#${rank}`}</small> 
              </FullNameCoin>
              <ImageCoin 
                src={image}
                alt={`${symbol}`}
              />
            </ButtonContianer>
              
            {(showSearh) &&
              <SearchPrice>
                  <FormCotizador onSubmit={handleFetchCurrency}>
                    
                    <SelectCoins onChange={(e) => setOption(e.target.value)} >
                      <option value="">Escoja su moneda</option>
                      <option value="ARG">Peso Argentino</option>
                      <option value="EUR">Euro</option>
                      <option value="MXN">Peso Mexicano</option>
                      <option value="GBP">Libra Esterlina</option>
                      <option value="JPY">Yenes</option>
                    </SelectCoins> 

                    <ButtonCotizar >
                      Cotizar
                    </ButtonCotizar>

                  </FormCotizador>
                  {(error) && <ErrorInput> {error} </ErrorInput>}             
              </SearchPrice>
            }
            {(fetchSuccess) && 
              <ResultCurrent
                coinsSeletcted={coinsSeletcted}
                setShowSearch={setShowSearch}
                showSearh={showSearh}
                setFetchSuccess={setFetchSuccess}
              />
            } 
      
          </CardCoins>

        </SwipeableListItem>
      </SwipeableList>
      <ToastContainer />
    </>
  )
}
