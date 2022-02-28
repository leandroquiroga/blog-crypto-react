
import  styled  from 'styled-components';

const backgroundPath = `/assets/svg/back-banner-violet.svg`

export const Header = styled.header`
  background-image: url(${backgroundPath});
  background-repeat: no-repeat;
  background-position: center center;
  background-attachment: scroll;
  background-size: cover;
  height: 100vh;
`

export const ContainerHeader = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 1024px;
  width: 90%;
  margin: 0 auto;
  padding: 10px;
  @media(max-width: 893px){
    flex-direction: column;
  }
`

export const TitleBanner = styled.h1`
  display: block;
  white-space: normal;
  width: 25ch;
  text-transform: uppercase;
  font-size: 2rem;
  color: #FFFF;
  text-align: center;
  margin-top: 25px;

  animation: typing 1.5s steps(39), blink .5s infinite step-end alternate;
  overflow: hidden;

  @keyframes typing{
    from{width: 0 }
  };

  @keyframes blink {
    50% {border-color: transparent }
  };

  @media(max-width: 893px){
    font-size: 1.5rem;
    margin-top: 75px;
  }
`

export const TextBanner = styled.span`
  font-size: 1rem;
  text-align: center;
  color: #FFF;
  display: block;
`

export const ContentTitle = styled.article`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media(max-width: 893px){
    flex-direction: column;
  }
`

export const AnimationBanner = styled.img`
  width: 450px;
  margin-top: 25px;

  @media(max-width: 893px){
    width: 350px;
    margin: 0 auto;
  }
`