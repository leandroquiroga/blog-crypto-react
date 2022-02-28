import React, { Fragment } from 'react'
import { Navbar } from './components/Navbar/Navbar'
import { CardNews } from './components/CardNews/CardNews';
import { BannerHeader } from './components/BannerHeader/BannerHeader';

export const HomePage = () => {

  return (
    <Fragment >
      <Navbar />
      <BannerHeader />
      <CardNews/>
    </Fragment>
  )
}
