# Blog de Criptomonedas (React.js + Firestore + React-Router-Dom + StyledComponents + Api + Google SingUp and Re-Captcha Google)

Este proyecto realizado con React.js como frontend, firestore como base de datos y styled compoents para los estilos, consume dos API diferentes. Podemos iniciar sesion (Google SingUp o email), registrarnos y recupera contraseña mediante re-captcha de Google


Una vez iniciada sesion vamos a poder las ultimas noticias del mundo cripto, se podra ver los ultimos valores de unas de las 25 monedas mas importante de mundo de la criptomonedas y vamos a poder llevar un control propio sobre nuestras monedas favoritas y consultar su precio con diferente monedas del mundo.

# Construido con 🛠️
* React.js
* React Router DOM v6
* Custom hooks
* Styled Components
* React Toastify
* React Swipeable List
* Firebase
* Google SingUp and Re-Captcha

# Funcionalidades ⚙️
## Validacion de campos y de elementos ya existentes: 
Por una parte se valida mediante una funcion que evalua todas las posibilidades de errores y retorna un mensaje. Esto sirve por ejemplo si: Los campos estan vacios, el email no esta registrado, las contraseñas no demasiado debil entre muchas mas validaciones. 

Por otro lado validamos si una criptomoneda ya existe en nuestro portfolio personal, en caso de existir nos alertara con una notificacion. 

## SignUp with Google y re-Captcha

Si bien esto se logra gracias a firestore, una vez iniciado sesion vamos a poder ver nustra foto de perfil de nuestra cuenta de google. 

Se utliza re-captcha en caso de que querramos recuperar nuestra contraseña, para validar que no seamos un robot. Si bien hasta que no se coloque el mail y se valide la confirmacion del re-captcha 
no vamos a poder enviar el email de recuperacion de contraseña

## Rutas privadas y publicas 
Creamos rutas privadas para que el usuario pueda iniciar sesion para acceder a a las ultimas noticias del mundo cripto, a un control de los ultimos valores y tener nuestras propios criptomonedas como favoritas. 

En caso de no  haber iniciado sesion no vamos a poder utilizar ninguna de esas funcionabilidades. Solo vamos a poder utilizar las funciones de logeo, registro y de recuperacion de contraseña

## Porfolio de criptomonedas 
Podemos llevar un control propio de nuestras cryptos favoritas, no solo vamos a poder ver su precio real a valor dolar, sino vamos a poder hacer consultas de con diferentes monedas, entre ellas estan: 

* Peso argentino
* Euro
* Peso Japones
* Entre otras. 

Ademas en caso de no utilizar mas alguna criptomonedas vamos a poder eliminarla de una manera sencilla, solamente deslizando la cripto moneda hacia algunos de los lados. 

## Consumo de Api 

En este proyecto utilizamos dos APIs diferentes, en uno utilizamos dos endpoint uno para las noticias y el valor acutal de las criptomonedas, en la otra utilizamos un solo endpoint para solamente hacer consultas sobre su valor con cualquier moneda del mundo. 

- [Crypo Compare](https://min-api.cryptocompare.com/documentation)
- [Coingecko](https://www.coingecko.com/es)
## Custom Hooks 

Se han creados ciertos hooks que se reutilizar en varias partes del proyecto, entre ellos estan por ejemplo: useFetch y useForm que son uno delos mas usados. 

## Toastify 
Gracias a una bibioteca de react [React Toastify](https://fkhadra.github.io/react-toastify/introduction) nos permite crear personalizar alertas de diferentes manera, ya sea para cuando se realiza correctamente, o quizas cuando damos un mensaje de alerta, entre tantas.  

## React Swipeable List 
Es una biblioteca de react [React Swipeable List ](https://github.com/sandstreamdev/react-swipeable-listn) que nos permite realizar determinadas acciones mediante el deslizado sobre un elemento, esta funcionabilidad es remendable para los disposivos mobiles

# Deploy 👨‍💻
# Contacto 📫
- [Linkedin](https://www.linkedin.com/in/leanquiroga95/)
- [Email](mailto:leandroquiroga9514@gmail.com)

# Autor 👤
Realizado con ❤️ por [Leandro Quiroga](https://github.com/leandroquiroga);
