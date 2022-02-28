import { useEffect, useRef, useState } from 'react'

export const useFetch = (url) => {
  
  // Para saber si el componente esta montado
  const isMonut = useRef(true);

  const [fetchApi, setFetchApi] = useState({
    data: null,
    loading: true,
    error: null
  });


  // Despomontamos el componente
  useEffect(() => {
    return () => {
      isMonut.current = false;
    };
  }, []);


  // Hacemos la peticion al endpoint
  
  useEffect(() => {

    // Reseteamos el objeto
    setFetchApi({
      data: null,
      loading: true,
      error: null
    });

    //Realizamos la peticion 
    const getApiNewLast = async () => {

      try {
        const response = await fetch(url);
        const result = await response.json();
        
        if (isMonut.current) {
          setFetchApi({
            data: result,
            loading: false,
            error: null,
          });
        }
        
      } catch(error) {
        setFetchApi({
          data: null,
          loading: false,
          error: 'No se pudo cargar la informacion necesaria'
        });
      };
    };
    getApiNewLast();

    
  }, [url]);
  


  return [fetchApi]
}
