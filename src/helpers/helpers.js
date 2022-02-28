import { toast } from 'react-toastify'


// Maneja el estado de errores en caso que la peticion de registro
// no se pueda lograr con exito.

export const messageErrorAuth = (err, setError) => {
  switch (err) {
    case 'auth/invalid-email':
      setError('El email es invalido');
      setTimeout(() => setError(''), 2000);
      break
    case 'auth/weak-password':
      setError('Contraseña demasiado debil');
      setTimeout(() => setError(''), 2000);
      break
    case 'auth/email-already-in-use':
      setError('El email ya esta registrado');
      setTimeout(() => setError(''), 2000);
      break
    case 'auth/user-not-found':
      setError('El usuario no existe');
      setTimeout(() => setError(''), 2000);
      break
    case 'auth/wrong-password':
      setError('La contraseña es incorrecta');
      setTimeout(() => setError(''), 2000);
      break
    case 'fetch-invalid':
      setError('Debes elejir al menos una moneda');
      setTimeout(() => setError(''), 2000);
      break
    case 'coins-exist':
      setError('Lo siento, no se puede agregar un crypto ya existente');
      setTimeout(() => setError(''), 2000);
      break
    default:
      return
  }
};

// Muestra una alerta de error (Toastity React)
export const notifyError = (message) => {
  toast.error(message, {
    theme: 'dark',
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  })
}

export const notifySuccess = (message) => {
  toast.success(message, {
    theme: 'dark',
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  })
}

// Se queda con la primera letra en caso de iniciar sesion
// con correo y contraseña

export const firsLetter = (email) =>
    email.split('@').splice(0, 1).join().split('')[0];


// Validad que las contraseñas coincidan, en caso que sean iguales
// verifica que los campos no esten vacios, de esta manera 
// retornara un mensaje de error

export const registerUser = async (valueForm, setError, signUp, navigate) => {

  const { email, password, passwordConfirm } = valueForm;


   if (password !== passwordConfirm) {
    setError('Las contraseñas no coinciden');

     setTimeout(() => setError(''), 2000);
    return
   } else if ([email, password, passwordConfirm].includes('')) {
     setError('Los campos no pueden estar vacios');

     setTimeout(() => setError(''), 2000);
    return;
   };

  // Si pasa todas las validaciones, intentara registrar el usuario
  // y lo enviara al Home pero loggeado
  try {
    await signUp(email, password);

    navigate('/')
  } catch (error) {
    messageErrorAuth(error.code, setError);
  }
}

// Verifica que los campos no esten vacio y que el usuario exista, de lo
// contrario no se logea al usuario. Si pasa la validacion, logea al usuario

export const loginUser = async (valueForm, setError, logIn, navigate) => {

  const { email, password } = valueForm;
  
  if ([email, password].includes('')) {
    setError('Los campos no pueden estar vacios');
    setTimeout(() => setError(''), 2000);

    return;
  };

  try {
    await logIn(email, password);
    navigate('/');
  } catch (error) {
    console.log(error.code);
    messageErrorAuth(error.code, setError);
  }
  
}


// Esta funcion se encarga de agregar una nueva cryptomoneda 
// o eliminarla

export const portFolioReducer = (state = {}, action) => {

  const { type, payload } = action;

  switch (type) {
    
    case 'addCrypto':
      return [...state, payload];
    
    case 'deleteCrypto':
      return state.filter(crypto => crypto.id !== payload);
      
    default:
      return state;
  }
} 

// Retorna el precio formatea al la moneda local 
export const formatPrice = (price) => {
  return new Intl.NumberFormat("en-EN", {
    style: "currency",
    currency: "USD",
  }).format(price);
};

// Retorna la fecha formateada 
export const formatDate = (date) => {
  let currentlyDate = new Date(date);

  return currentlyDate.toLocaleString();
}