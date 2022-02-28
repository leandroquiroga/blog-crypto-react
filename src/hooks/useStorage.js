import { useContext } from "react"
import { storageContext } from "../context/storageContext"



export const useStorage = () => {

  const contextStorage = useContext(storageContext);

  return contextStorage;
}