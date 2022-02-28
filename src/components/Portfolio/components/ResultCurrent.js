import React, { useEffect, useState } from 'react'
import {
  DownVolume,
  UpVolume,
  ValueContainer,
  ValueInfo
} from '../../Dashboard/DahboardStyled';
import { ButtonReCotizar } from '../PortfolioStyled';

export const ResultCurrent = ({  coinsSeletcted, setShowSearch, showSearh, setFetchSuccess }) => {
  
  const { optionCurrently, cryptoCurrently } = coinsSeletcted;
  const [data, setData] = useState({});

  // Si el objeto tiene alguna llave, entonces ejecuta el codigo
  // esta pendiente a que cambien los valores del objeto
  useEffect(() => {
    if (Object.keys.length > 0) {
      const fetchApi = async () => {  
        const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${cryptoCurrently}&tsyms=${optionCurrently}`
        const response = await fetch(url);
        const result = await response.json();
        setData(result);

      }
      fetchApi();
    }
  }, [optionCurrently, cryptoCurrently]);
  
  const handleCotizarAgain = () => {
    setShowSearch(!showSearh);
    setFetchSuccess(false);
  }
  return (
    <>  
       {
        (!data.DISPLAY) ?
          <div>Cargando...</div>
          :
          <ValueContainer>
            <ValueInfo>
              <small>Conversion type: </small>
              <small>
                From {cryptoCurrently} to {optionCurrently}
              </small>
            </ValueInfo>
            <ValueInfo>
              <small>Price: </small>
              <small>
                {data.DISPLAY[cryptoCurrently][optionCurrently].PRICE}
              </small>
            </ValueInfo>
            <ValueInfo>
              <small>Update:</small>
              <small>{data.DISPLAY[cryptoCurrently][optionCurrently].LASTUPDATE}</small>
            </ValueInfo>
            <ValueInfo>
              <small>Last volume:</small>
                {
                  (data.DISPLAY[cryptoCurrently][optionCurrently].CHANGEPCT24HOUR > 0) ?
                    <UpVolume>
                        {data.DISPLAY[cryptoCurrently][optionCurrently].CHANGEPCT24HOUR}
                    </UpVolume>
                    :
                    <DownVolume>
                      {data.DISPLAY[cryptoCurrently][optionCurrently].CHANGEPCT24HOUR}
                    </DownVolume>
                }
            </ValueInfo>
            <ValueInfo>
              <small>Volumen 24hs:</small>
                {
                  (data.RAW[cryptoCurrently][optionCurrently].CHANGE24HOUR > 0) ?
                    <UpVolume>▲ {data.RAW[cryptoCurrently][optionCurrently].CHANGE24HOUR.toFixed(3)}</UpVolume> :
                    <DownVolume>▼ {data.RAW[cryptoCurrently][optionCurrently].CHANGE24HOUR.toFixed(3)} </DownVolume>
                }
            </ValueInfo>
            <ButtonReCotizar onClick={handleCotizarAgain}>
              Volver a cotizar
            </ButtonReCotizar>
          </ValueContainer> 
      } 
      
    </>
  )
}