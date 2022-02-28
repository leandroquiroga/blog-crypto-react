import React from 'react'

import { formatDate, formatPrice, notifyError, notifySuccess } from '../../../helpers/helpers';
import { useAuth } from '../../../hooks/useAuth';
import {
  CardCoins,
  FullNameCoin,
  InfoContainer,
  ImagePortfolio,
  ValueContainer,
  ValueInfo,
  ButtonAddPortfolio,
  ImageCoin,
  UpVolume,
  DownVolume,
} from '../DahboardStyled';

export const CardsCrypto = ({ coins, addNewDocument, arrCryptos }) => {
  
  const { user } = useAuth();
  const { email } = user;
  const imgPath = `/assets/svg/portfolio.svg`

  const {
    name,
    symbol,
    market_cap_rank,
    image,
    current_price,
    last_updated,
    price_change_percentage_24h,
    price_change_24h,
    high_24h,
    low_24h,
  } = coins;

    // Revisa si el elemento ya existe antes de agregarlo si existe
  // retorna un mensaje de error y no dejara seguir agregandolo
  // en caso contrario podas agregar un nueva criptomoneda
  const handleAddCrypto = (coins) => {
    
    const coinsExists = arrCryptos.some(crypto => crypto.id === coins.id);

    if (coinsExists) {
      notifyError('Lo siento, no se puede agregar un elemento ya exisite');
      return;
    } else {
      const arrayCoins = [
        ...arrCryptos,
        {
          id: coins.id,
          rank: coins.market_cap_rank,
          name: coins.name,
          symbol: coins.symbol,
          image: coins.image,
        }
      ];
  
      addNewDocument(email, arrayCoins);
      
      notifySuccess('Se ha añadido una nueva crypto a tu porfolio')
      
      return;
    }
  }; 
  return (
    <>
      <CardCoins>
                      
        <InfoContainer>
          <FullNameCoin>
            {name} <br />
            <small>{symbol}{' | '}Rank: {`#${market_cap_rank}`}</small> 
          </FullNameCoin>
          <ImageCoin 
            src={image}
            alt={`${symbol}`}
          />
        </InfoContainer>
        
        <ValueContainer>
          <ValueInfo>
            <small>Price:</small>
            <small>{formatPrice(current_price)}</small>
          </ValueInfo>
          <ValueInfo>
            <small>Update:</small>
            <small>{formatDate(last_updated)}</small>
          </ValueInfo>
          <ValueInfo>
            <small>Last volume:</small>
            {
              (price_change_percentage_24h > 0) ?
                <UpVolume>
                    {formatPrice(price_change_percentage_24h)}
                </UpVolume>
                :
                <DownVolume>
                    {formatPrice(price_change_percentage_24h)}
                </DownVolume>
            }
          </ValueInfo>
          <ValueInfo>
            <small>Volumen 24hs:</small>
            {
              (price_change_24h > 0) ?
                <UpVolume>▲ {price_change_24h.toFixed(4)}</UpVolume> :
                <DownVolume>▼ {price_change_24h.toFixed(4)} </DownVolume>
            }
          </ValueInfo>
          <ValueInfo>
            <small>High day:</small>
            <small>{formatPrice(high_24h)}</small>
          </ValueInfo>
          <ValueInfo>
            <small>Low day:</small>
            <small>{formatPrice(low_24h)}</small>
          </ValueInfo>
        </ValueContainer>

        <ButtonAddPortfolio onClick={() => handleAddCrypto(coins)}>
          <small> Agregar al portfolio </small>
          <ImagePortfolio
            src={imgPath}
            alt= 'portfolio'
          />
        </ButtonAddPortfolio>
      </CardCoins>
    </>            
  )
}
