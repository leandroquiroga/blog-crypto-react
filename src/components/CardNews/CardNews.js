import React from 'react'
import { useFetch } from '../../hooks/useFetch';
import {
  AnclaOpen,
  Card,
  Category,
  GridCard,
  ImgNews,
  ParagraphNews,
  TitleNews
} from './CardNewsStyled';

export const CardNews = () => {

  const [fetchApi] = useFetch('https://min-api.cryptocompare.com/data/v2/news/?lang=ES');

  const { data, loading } = fetchApi;
  
  return (
    <main>

      <TitleNews>
        Noticias de ultimo momento
      </TitleNews>
      <GridCard>
        {
          (loading) ? 
            <div> Cargando noticias ...</div>
          : 
            (
              data.Data.map(news => (
                <Card key={news.id}>
                  <ImgNews 
                    src={news.imageurl}
                    alt={news.source_info.name}
                  />
                  <TitleNews>{news.title}</TitleNews>
                  <ParagraphNews>{news.body}</ParagraphNews>

                  <AnclaOpen
                    target={"_blank"}
                    href={news.url}
                  >
                      Ver mas...
                  </AnclaOpen>

                  <Category>
                    Categoria: <br/>
                    {news.categories}
                  </Category>
                </Card>
              ))
            )
        }
      </GridCard>
    
    </main>
  );
};