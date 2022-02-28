import React, { useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useStorage } from './../../hooks/useStorage';
import { Navbar } from '../Navbar/Navbar'
import { CardPorfolio } from './components/CardPorfolio';
import { CardPorfolioCoins, TitleCardCoins } from './PortfolioStyled';
import { Title } from '../Dashboard/DahboardStyled';

export const Portfolio = () => {
 
  const {arrCryptos, setArrCryptos ,searchDocumentOrCreateDocument } = useStorage();
  const { user } = useAuth();

  // Devuelve si un documento existente si el usuario exite,
  // sino crea un nuevo documento
  useEffect(() => {
    const {email} = user;
    const fetchDocument = async () => {
      const dataCrypto = await searchDocumentOrCreateDocument(email);
      setArrCryptos(dataCrypto);
    };
    fetchDocument();
  }, [searchDocumentOrCreateDocument, setArrCryptos, user]);

  return (
    <>
      <Navbar /> 
      <CardPorfolioCoins>
        {   
          (arrCryptos.length === 0) ?
            <Title>No hay elementos registrados</Title>
            :
              <>
                <TitleCardCoins> Cotiza tus cryptomonedas favoritas en tu moneda local </TitleCardCoins>
                {( 
                  arrCryptos.map(coins => (
                    <CardPorfolio 
                      key={coins.id}
                      coins={coins}
                    />
                  ))
                )}
              
              </>
        }
      </CardPorfolioCoins>

    </>
  )
}
