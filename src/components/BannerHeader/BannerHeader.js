import React from 'react'
import {
  AnimationBanner,
  ContainerHeader,
  ContentTitle,
  Header,
  TextBanner,
  TitleBanner
} from './BannerHeaderStyled';


export const BannerHeader = () => {

  const backgroundPath = `/assets/svg/crypto.svg`

  return (
    <Header>
      <ContainerHeader>
        
        <ContentTitle>
          <TitleBanner>
            Bienvenido al portal de noticias crypto
          </TitleBanner>
          <TextBanner>
            En donde podras tener disponible 
            la portfolio con las mejores monedas del mundo
          </TextBanner>
        </ContentTitle>

        <div>
          <AnimationBanner 
            src={backgroundPath}
            alt='Animation'
          />

        </div>

      </ContainerHeader>
    </Header>
  )
};