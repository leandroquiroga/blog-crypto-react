
import  styled  from 'styled-components';

export const GridCard = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, auto));
  row-gap: 15px;
  column-gap: 15px;
  place-content: center;
  align-items: center;
  max-width: 900px;
  width: 90%;
  margin: 0 auto;
  padding: 10px;
`

export const TitleNews = styled.h5`
  text-align: center;
  font-size: 1rem;
  font-weight: 400;
  color: #202020;
  margin: 10px 0;
`

export const Card = styled.article`
  border: 1px solid #CCC;
  border-radius: 7px;
  padding: 10px;
  background-color: #FFFFFF;  
  backdrop-filter: blur(20px);
  box-shadow: 1px 2px 10px 1px #767676;
  height: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const ImgNews = styled.img`
  width: 150px;
  height: 150px;
  margin: 0;
  border-radius: 80%;
`

export const ParagraphNews = styled.small`
  font-size: .9rem;
  width: 90%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #202020;
  margin: 10px 0;
`

export const AnclaOpen = styled.a`
  background-color: #5f127c;
  width: 90%;
  text-align: center;
  padding: 15px;
  border-radius: 10px;
  text-decoration: none;
  color: #FFF;
  cursor: pointer;
  transition: all 1s ease-in-out;
  margin: 10px 0;

  &:hover{
    background-color: #8929ac;;
    transition: all 1s ease-in-out;
  }
`

export const Category = styled.small`
  text-align: center;
  font-size: .8rem;
  color: #202020
`