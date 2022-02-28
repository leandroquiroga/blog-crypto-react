
import styled from 'styled-components';


export const TitleCardCoins = styled.h2`
  font-size: 1.2rem;
  text-align: center;
  margin-top: 45px;
`
export const CardPorfolioCoins = styled.article`
  padding: 10px;
  display: grid;
  grid-template-columns: repeat(1, minmax(90%, 500px));
  row-gap: 20px;
  place-content: center;
  align-items: center;
  max-width: 700px;
  width: 90%;
  margin: 40px auto;

`

export const ButtonContianer = styled.button`
  cursor: pointer;
  border: none;
  outline: none;
  background-color: transparent;
  padding: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`

export const SelectCoins = styled.select`
  width: 250px;
  outline: none;
  padding: 8px;
  text-align: center;
  border: 1px solid #DFDFDF;
  border-radius: 5px;
  
  option{
    font-size: .9rem;
  }
`

export const SearchPrice = styled.article`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 8px;
  /* transition: all 1s;0 */


  @media(max-width: 793px){
    justify-content: space-between;
    align-items: center;
  }
`

export const ButtonCotizar = styled.button`
  cursor: pointer;
  border: none;
  outline: none;
  background-color: #5f127c;
  color: #FFF;
  border-radius: 5px;
  padding: 8px;
  width: 150px;
  transition: all .5s ease-in-out;
  margin: 10px 0;

  &:hover{
    background-color: #5f12A5;
    transition: all .5s ease-in-out;
  }
`

export const FormCotizador = styled.form`
  width: 100%;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export const ButtonReCotizar = styled.button`
  background-color: #5f127c;
  width: 100%;
  outline: none;
  border: none;
  border-radius: 10px;
  color: #fff;
  padding: 8px;
  margin: 12px 0;
  cursor: pointer;
  transition: all .5s ease-in-out;

  &:hover{
    background-color: #5f12A5;
    transition: all .5s ease-in-out;
  }
`