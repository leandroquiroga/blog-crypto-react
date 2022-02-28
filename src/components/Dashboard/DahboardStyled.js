import styled from "styled-components";


export const Title = styled.h2`
  font-size: 1.5rem;
  text-align: center;
  margin: 35px auto;
`
export const CardCoins = styled.article`
  border: 1px solid #A9A9A9;
  padding: 10px;
  background-color: #FFFFFF;  
  box-shadow: 1px 1px 10px -1px #767676;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`
export const InfoContainer = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  width: 100%;
  border-bottom: 1px solid #DCDCDC;
`
export const FullNameCoin = styled.h2`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-size: 1.2rem;
  
  small{
    border-top: 1px solid #A9A9A9;
    font-size: .8rem;
    text-align: center;
    text-transform: uppercase;
  }
`
export const ImageCoin = styled.img`
  width: 35px;
`

export const ValueContainer = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
  width: 100%;
`
export const ValueInfo = styled.p`
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  border-bottom: 1px solid #DCDCDC;
  width: 100%;
  margin: 5px 0;
`

export const ButtonAddPortfolio = styled.button`
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 10px;
  background-color: #5f127c;
  border-radius: 10px;
  cursor: pointer;
  outline: none;
  border: none;
  transition: all .9s ease-in-out;
  
  small{
    font-size: 1rem;
    color: #FFF;
  }

  &:hover{
    background-color: #8929ac;
    transition: all .9s ease-in-out;
  }
`

export const ImagePortfolio = styled.img`
  width: 25px;
`


export const UpVolume = styled.small`
  background-color: #32CD32;
  color: #FFF;
  text-align: center;
  font-size: .9rem;
  border-radius: 5px;
`
export const DownVolume = styled.small`
  background-color: #FF0000;
  color: #FFF;
  text-align: center;
  font-size: .9rem;
  border-radius: 5px;
`

export const Message = styled.div`
  width: 100%;
  padding: 10px;
  border: none;
`