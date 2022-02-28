import { createContext, useState } from "react";
import { store } from './../firabase.config';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc
} from 'firebase/firestore';


export const storageContext = createContext();


export const StorageProviader = ({ children }) => {
  const [arrCryptos, setArrCryptos] = useState([]);  
  const searchDocumentOrCreateDocument = async (idDocument) => {


    // creamos la referencia al documento;
    const docRef = doc(store, `usuarios/${idDocument}`);
    
    // buscamos el documento
    const objDocument = await getDoc(docRef);
    
    // Verificamos si existe 
    if (objDocument.exists()) {
      
      const infoDocumentation = objDocument.data();
    
      return infoDocumentation.cryptos
    } else {
      // si no existe
      await setDoc(docRef,{cryptos: [...arrCryptos]});

      const objDocument = await getDoc(docRef);

      const infoDocumentation = objDocument.data();
      return infoDocumentation.cryptos;
    }

    
  };

  const addNewDocument =  async (idDocument, arrayCoins) => {
    const docRef = doc(store, `usuarios/${idDocument}`);
    await updateDoc(docRef, { cryptos: [...arrayCoins] });
    setArrCryptos(arrayCoins)
  };

  const deleteDocument = async(idDocument, arrayCoins) => {
    const docRef = doc(store, `usuarios/${idDocument}`);
    await updateDoc(docRef, { cryptos: [...arrayCoins] });

    setArrCryptos(arrayCoins)
  }

  const value = {
    searchDocumentOrCreateDocument,
    addNewDocument,
    setArrCryptos,
    deleteDocument,
    arrCryptos
  }
  return (
    <storageContext.Provider value={ value }>
      {children}
    </storageContext.Provider>

  )
}