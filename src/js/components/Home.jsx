import React, { useEffect, useState } from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';



const Home = () => {

  const [valor, setValor] = useState("");
  const [datos, setDatos] = useState([]);

  useEffect(() => {
	fetch("https://playground.4geeks.com/todo/users/andersontbernal", {
		method: "POST",  //useEffect + fetch con { method: "POST", body, headers } + then para confirmar + catch para errores
		body: JSON.stringify({}),
		headers: { "Content-Type": "application/json"}
	}).catch(() => {});

	fetch("https://playground.4geeks.com/todo/users/andersontbernal") 
		.then(response => response.json())
		.then(data => {
			if(data.todos) {
				setDatos(data.todos);
			}
		})
		.catch(error => console.error("Error al obtener tareas:", error));
  }, []);
  
  // estructura de los datos y lo que veremos en pantalla
    return (
    <div className="container">
    <h1>TODO list</h1>
	<ul> 
		<li>
			<input
			type="text"
			onChange={(e) => setValor(e.target.value)}
			value={valor}
			onKeyDown={(e) =>{
				if (e.key === "Enter" && valor.trim() !== "") {
					const nuevaTarea = { label: valor, done: false}; 

					fetch("https://playground.4geeks.com/todo/todos/andersontbernal", {
						method: "POST",
						body: JSON.stringify(nuevaTarea),
						headers: { "Content-type": "application/json"}
					})
						.then(() => 
							fetch("https://playground.4geeks.com/todo/users/andersontbernal")
					)
					.then(response => response.json())
					.then(data => {
						setDatos(data.todos);
						setValor("");

					})
						.catch(error => console.error("Error al agregar tarea:", error));
										
				}
			}}
			placeholder="Que necesitas hacer"
			/>
		</li>

		{datos.map((item, index) => (
			<li key={index}>
				{item.label}{" "}
				<i
				className="fa-solid fa-circle-xmark"
				style={{
					color: "red", 
					cursor: "pointer"}}
				onClick={() => {
					fetch(`https://playground.4geeks.com/todo/todos/${item.id}`, {
						method: "DELETE"
					})
					.then(() => fetch('https://playground.4geeks.com/todo/users/andersontbernal')
					)
					.then(response => response.json())
					.then(data => setDatos(data.todos))
					setDatos(datos.filter((_, i)=> i !== index)); // caracter _ usado para ignorar el item y solo usar el index 
				}}
				></i>
			</li>
		))}
	</ul>
	<div>{datos.length === 1 ? "1 tarea" : `${datos.length} tareas`}</div>

		<button className="btn btn-success mt-3"
		onClick={() => {
			Promise.all( //ejecucion de varias promesas al tiempo
				datos.map(item =>
					fetch(`https://playground.4geeks.com/todo/todos/${item.id}`, {
						method: "DELETE"
					})
				)
			). then(() => setDatos ([])); //borra tareas de la pantalla tambien 
		}}
		>
		Borrar tareas
		</button>
	</div> // o colocamoss en vez de ${datos.lenght} tareas por elemento "s" como texto condicional para mostrar cuando hay mas de 1 item
  );
};


export default Home;




//1 CREACION DE USUARIO Y CONFIRMACION: 
//Al crear el POST debo asegurarme de hacer la prueba de confirmacion de que el usuario exista y no, al hacer esto revisare en consola el resultado de la operacion si sigo con lo siguiente:
//UseEffect como hook para renderizar por primera vez el componente
  //fetch inicia la solicitud con el meotodo post para crear algo nuevo
  // .then(response => {}): par manejar la respuesta del exitosa, si fue exitosa, si todo salio bien convertirla a texto plano con JSON 
  // .then(data =>...): impresion en consola de mensaje de exito
  // .catch(): para atrapar cualquier error durante la solicitud y que lo muestre en consola. 
  // []: Arreglo fvacio que inidcia que el efecto solo se ejecutara una vez

//2 CONSULTAR SI EL USUARIO YA EXISTE Y CARGAR SUS TAREAS
// Usamos el mismo useEffect para cargar las tareas actuales desde la api solo una vez cuando el componente se monta.
// fetch(): con metodo GET al endpoint para obtener la lista de tareas existentes
// .then(response => response.json()); transforma la respuesta en un objeto JSON usable
// .then(data =>setDatos (data)): actualiza el estado con las tareas existentes para que se muestre en pantalla.
// .catch(error =>...): en caso de error (por ejemplo, si el usuario no existe o hay un fallo )lo muestra en consola
// []: Arreglo fvacio que inidcia que el efecto solo se ejecutara una vez
// el error 400 que aparece en consla cuando se repite la creacion de usaurio es ESPERADO y no afecta el funcionamiento del codigo. 
// el objeto de este paso es asegurar se de que el usuario ya tiene una lista para ser usada 

// 3. CREAR UNA NUEVA TAREA AL PRESIONAR ENTER
// Este bloque se activa cuando el usuario presiona la tecla enter en el input
// if (evento.key =="enter" && valor.trim () !== "") verifica que la tecla presionada sea "enter" y que el input no este vacio (valor sin epsacios)
// const nuevaTarea = { label: valor, done: false}: crea un objeto con el texto de la tarea y marca como no completada (done: false)
// fetch(url) {metodo, body, header POST}: envia la nueva tarea a la api usando el metodos POST.
// // - body: JSON.stringify(nuevaTarea): convierte el objeto en texto JSON para enviarlo correctamente
// - headers: "Content-Type: application/json": le dice al servidor que lo que se está enviando es JSON
// then(() => fetch(...)): una vez enviada la nueva tarea, hacemos otro fetch (GET) para obtener la lista actualizada de tareas del servidor
// - Esto es necesario porque la API no devuelve directamente la lista actualizada después del POST
// then(resp => resp.json()): convertimos la respuesta a formato JSON
// then(data => {...}): recibimos los datos actualizados y hacemos dos cosas:
// setDatos(data.todos): actualizamos el estado local con la lista nueva para mostrarla en pantalla
// setValor(""): limpiamos el campo del input para que el usuario pueda escribir otra tarea
// catch(error => ...): en caso de error (como problema de conexión o formato incorrecto), muestra el error en la consola

// 4 ELIMINAR UNA TAREA AL HACER CLIC EN LA PAPELERA

//ESTRUCTURA DE LA FUNCION ELIMINAR
// esta función se ejecuta cuando el usuario hace clic en el ícono de eliminar 
// recibe el índice (i) de la tarea que se quiere eliminar
// const nuevasTareas = datos.filter((_, index) => index !== i);
// filter() crea una nueva lista SIN la tarea que el usuario quiere borrar
// index !== i: mantiene todas las tareas menos la del índice seleccionado

//PARTE EN LA QUE SE INGRESA EL METODO DELETE
// fetch(..., { method: "PUT", ... }): actualiza la lista de tareas en la API
// method: "PUT" indica que vamos a reemplazar TODA la lista actual de tareas por una nueva
// body: JSON.stringify(nuevasTareas): convertimos la nueva lista sin la tarea eliminada a formato JSON
// headers: "Content-Type: application/json": indicamos que estamos enviando datos en formato JSON
// then(response => response.json()): transformamos la respuesta del servidor a un objeto usable
// then(data => setDatos(data.todos)): actualizamos el estado local con la lista nueva sin la tarea eliminada
// catch(error => ...): si hay un error (por ejemplo, problema con la conexión), lo mostramos en consola

//5 ELIMINAR TODAS LAS TAREAS A LA VEZ (BOTÓN "BORRAR TODO")
// onClick: al hacer clic en el botón "Borrar todo", se ejecuta la función
// Promise.all(): permite esperar a que se completen todas las peticiones de borrado antes de continuar
// datos.map(): recorre cada tarea del array "datos"
// fetch(): envía una petición DELETE por cada tarea al endpoint correspondiente con su id
// Luego de borrar todas, .then(() => setDatos([])): actualiza el estado dejando la lista vacía para reflejar los cambios en pantalla
// IMPORTANTE: esta función solo borra las tareas del servidor y actualiza el estado local, no borra al usuario ni reinicia la lista completa
