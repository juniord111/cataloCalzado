let data = {};  // Variable para almacenar los datos cargados desde el JSON
let imagenesFiltradas = []; // Variable para almacenar las imágenes filtradas

// Función para normalizar y quitar las tildes
function quitarTildes(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Función para renderizar la galería de imágenes
function renderizarGaleria(imagenes, contenedor) {
    let html = '';

    imagenes.forEach(function(imagen) {
        html += `
            <div class="galeria-item">
                <img src="${imagen.src}" alt="${imagen.alt}" width="200px" />
                <h3>${imagen.nombre}</h3>
                <p>${imagen.precio}</p>
                <a href="informacion/detalle.html?id=${imagen.realIndex}">
                    <button>Más Información</button>
                </a>
            </div>
        `;
    });

    $(contenedor).html(html);
    console.log(`Galería renderizada en ${contenedor} con imágenes:`, imagenes); // Debugging
}

// Función para filtrar las imágenes por el texto de búsqueda
function filtrarImagenes(busqueda) {
    const busquedaNormalizada = quitarTildes(busqueda.toLowerCase());

    imagenesFiltradas = [
        ...data.imagenes.filter(imagen => quitarTildes(imagen.nombre.toLowerCase()).includes(busquedaNormalizada)),
        ...data.provicionalDos.filter(imagen => quitarTildes(imagen.nombre.toLowerCase()).includes(busquedaNormalizada)),
        ...data.sandalias.filter(imagen => quitarTildes(imagen.nombre.toLowerCase()).includes(busquedaNormalizada)),
        ...data.altos.filter(imagen => quitarTildes(imagen.nombre.toLowerCase()).includes(busquedaNormalizada))
    ];

    renderizarGaleria(imagenesFiltradas, '#galeria');
}

$(function() {
    // Cargamos el archivo JSON
    fetch('articulos.json')
        .then(response => response.json())
        .then(loadedData => {
            data = loadedData;

            // Inicializamos las galerías con las imágenes completas, agregando el índice real
            let indexOffset = 0;

            data.imagenes = data.imagenes.map((img, index) => ({ ...img, realIndex: index }));
            indexOffset += data.imagenes.length;

            data.provicionalDos = data.provicionalDos.map((img, index) => ({ ...img, realIndex: indexOffset + index }));
            indexOffset += data.provicionalDos.length;

            data.sandalias = data.sandalias.map((img, index) => ({ ...img, realIndex: indexOffset + index }));
            indexOffset += data.sandalias.length;

            data.altos = data.altos.map((img, index) => ({ ...img, realIndex: indexOffset + index }));

            console.log("Datos cargados:", data); // Debugging

            // Renderizamos cada galería una sola vez
            renderizarGaleria(data.imagenes, '#galeria');
            renderizarGaleria(data.provicionalDos, '#galeriaDos');
            renderizarGaleria(data.sandalias, '#galeriaTres');
            renderizarGaleria(data.altos, '#galeriaCuatro');
        })
        .catch(error => console.error('Error al cargar el archivo JSON:', error));

    // Agregamos un evento para filtrar las imágenes cuando el usuario escriba
    $('#buscar').on('input', function() {
        const busqueda = $(this).val();
        filtrarImagenes(busqueda);
    });
});

