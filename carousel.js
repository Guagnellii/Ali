console.log("📸 Carrusel múltiple cargado correctamente");

document.addEventListener("DOMContentLoaded", () => {
    // 1. Seleccionamos TODOS los contenedores de carrusel
    const carousels = document.querySelectorAll(".carousel-container");

    carousels.forEach(container => {
        const track = container.querySelector(".carousel-track");
        const items = track.querySelectorAll(".foto-item"); // Corregido: .foto-item
        const btnLeft = container.querySelector(".left-btn");
        const btnRight = container.querySelector(".right-btn");

        // Validación de seguridad
        if (!track || items.length === 0) return;

        // Configuración inicial
        let index = 0;
        // Obtenemos el ancho real de la foto + el gap (espacio) del CSS
        // En tu CSS el gap es 12px y el ancho base es ~180px o 200px
        const itemWidth = items[0].getBoundingClientRect().width; 
        const gap = 12; // Debe coincidir con el 'gap' de tu CSS (.carousel-track)
        const slideSize = itemWidth + gap;

        // Función para mover ESTE carrusel específico
        const moveCarousel = () => {
            // Movemos el track hacia la izquierda
            track.style.transform = `translateX(-${index * slideSize}px)`;
        };

        // Botón Derecha
        btnRight.addEventListener("click", () => {
            // Lógica para detenerse antes de que se acaben las fotos
            // Mostramos 3 a la vez, así que el límite es length - 3
            // Si quieres infinito, la lógica cambia, pero esto es tope-tope
            const visibleItems = Math.floor(container.offsetWidth / slideSize); // Cuántas caben
            const maxIndex = items.length - visibleItems; // Límite dinámico

            if (index < maxIndex) { 
                index++;
                moveCarousel();
            } else {
                // Opcional: Volver al inicio (loop)
                // index = 0; moveCarousel(); 
            }
        });

        // Botón Izquierda
        btnLeft.addEventListener("click", () => {
            if (index > 0) {
                index--;
                moveCarousel();
            }
        });
    });
});