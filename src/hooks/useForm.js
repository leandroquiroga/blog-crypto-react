import { useState } from "react";


export const useForm = (initalValue={}) => {
  
  const [valueForm, setValueForm] = useState(initalValue);

  const changeValue = ({target}) => {
    setValueForm({
      ...valueForm,
      [target.name]: target.value,  
    })
  }
  
  return [valueForm, changeValue];
}
