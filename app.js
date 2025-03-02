// Elementos del DOM
const campotxt = document.getElementById("campotxt");
const plus = document.getElementById("plus");
const listaReproduccion = document.getElementById("listaReproduccion");

// Evento para agregar canciones
plus.addEventListener("click", () => {
    if (campotxt.value) {
        agregarCancionLista(campotxt.value);
        campotxt.value = "";
    } else {
        alert("Por favor, ingresa el nombre de una canción.");
    }
});

// Clase Canción
class Cancion {
    constructor(info) {
        const [nombre, artista] = info.split(' - ').map(part => part.trim());
        this.nombre = nombre || "Desconocido";
        this.artista = artista || "Desconocido";
        this.imagen = "https://via.placeholder.com/50"; // Imagen por defecto
    }

    info() {
        return `${this.nombre} - ${this.artista}`;
    }
}

// Gestor de Canciones
class GestorDeCanciones {
    constructor() {
        this.canciones = this.cargarDesdeLocalStorage();
    }

    agregarCancion(info) {
        const cancion = new Cancion(info);
        this.canciones.push(cancion);
        this.guardarEnLocalStorage();
        this.render();
    }

    guardarEnLocalStorage() {
        localStorage.setItem("canciones", JSON.stringify(this.canciones));
    }

    cargarDesdeLocalStorage() {
        const cancionesGuardadas = localStorage.getItem("canciones");
        return cancionesGuardadas ? JSON.parse(cancionesGuardadas).map(c => new Cancion(`${c.nombre} - ${c.artista}`)) : [];
    }

    render() {
        listaReproduccion.innerHTML = "";
        this.canciones.forEach((cancion, index) => {
            listaReproduccion.innerHTML += `
                <article>
                    <img src="${cancion.imagen}" alt="Portada">
                    <b>${cancion.info()}</b>
                    <i class="editBtn marginBtn fa-solid fa-pencil" data-index="${index}"></i> 
                    <i class="deleteBtn marginBtn fa-solid fa-trash" data-index="${index}"></i>
                </article>`;
        });

        document.querySelectorAll(".deleteBtn").forEach(btn => {
            btn.addEventListener("click", (e) => eliminarCancion(e.target.dataset.index));
        });

        document.querySelectorAll(".editBtn").forEach(btn => {
            btn.addEventListener("click", (e) => editarCancion(e.target.dataset.index));
        });
    }
}

// Instancia del gestor de canciones
const gestor = new GestorDeCanciones();
gestor.render();

// Funciones para manejar las canciones
function agregarCancionLista(cancion) {
    gestor.agregarCancion(cancion);
}

function eliminarCancion(index) {
    gestor.canciones.splice(index, 1);
    gestor.guardarEnLocalStorage();
    gestor.render();
}

function editarCancion(index) {
    const nuevoNombre = prompt("Edita la canción (Formato: Nombre - Artista):", gestor.canciones[index].info());
    if (nuevoNombre) {
        gestor.canciones[index] = new Cancion(nuevoNombre);
        gestor.guardarEnLocalStorage();
        gestor.render();
    }
}
