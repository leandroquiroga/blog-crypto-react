import React, { Fragment} from 'react'
import { ToastContainer } from 'react-toastify'
import { useFetch } from '../../hooks/useFetch'
import { GridCard } from '../CardNews/CardNewsStyled'
import { Navbar } from '../Navbar/Navbar'
import { useStorage } from './../../hooks/useStorage'; 
import { CardsCrypto } from './components/CardsCrypto'
import { Title } from './DahboardStyled'
import 'react-toastify/dist/ReactToastify.css';

export const Dashboard = () => {

  const [fetchApi] = useFetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=25&page=1&sparkline=false');

  const { addNewDocument, arrCryptos} = useStorage();
  const { data, loading } = fetchApi;
      
  return (
    <Fragment>
      <Navbar/>

        <Title>Lista de las mejores 25 criptomonedas actuales</Title>
        <GridCard>
        {
          (loading) ?
            <div>Cargando... </div>
          : 
            ( 
                data.map(coins => (
                  <CardsCrypto 
                    key={coins.id}
                    coins={coins}
                    addNewDocument={addNewDocument}
                    arrCryptos={arrCryptos}
                  />
                ))
            )
        }
      </GridCard>
      <ToastContainer />
    </Fragment>

  )
}