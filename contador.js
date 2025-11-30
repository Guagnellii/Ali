console.log("contador.js cargado correctamente")
const inicioRelacion = new Date(2025, 7, 6);

function actualizarContador() {
    const contador = document.getElementById("contador");
    if (!contador) return; // Evita errores en páginas sin el contador
    const hoy = new Date();
    const diferencia = hoy - inicioRelacion;
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    contador.textContent = `Llevamos juntos ${dias} días!`;
}

actualizarContador();
setInterval(actualizarContador, 1000);

const modal = document.getElementById("modal");
const modalImg = document.getElementById("imgModal");
const videoModal = document.getElementById("videoModal");
const cerrar = document.querySelector(".cerrar"); 

const zoomBtns = document.querySelectorAll(".zoom-btn");

zoomBtns.forEach(btn => {
    btn.addEventListener("click", function () {
        const item = this.closest(".foto-item");
        const img = item.querySelector("img");
        const vid = item.querySelector("video");

        if (img) {
            modalImg.src = img.src;
            modalImg.style.display = "block";
            videoModal.style.display = "none";
        }

        if (vid) {
            vid.style.opacity = "0";
            vid.style.pointerEvents = "none";
            videoModal.src = vid.src;
            videoModal.load();
            videoModal.style.display = "block";
            modalImg.style.display = "none";
        }

        modal.style.display = "flex";
    });
});

cerrar.addEventListener("click", () => {
    modal.style.display = "none";
    videoModal.pause();
    videoModal.currentTime = 0;
    document.querySelectorAll(".mini-video, video").forEach(v => {
        v.style.opacity = "1";
        v.style.pointerEvents = "auto";
    });
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        modal.style.display = "none";
        videoModal.pause();
        videoModal.currentTime = 0;
        document.querySelectorAll(".mini-video, video").forEach(v => {
            v.style.opacity = "1";
            v.style.pointerEvents = "auto";
        });
    }
});

const header = document.querySelector("header");
let lastScroll = 0;
window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    if (currentScroll > lastScroll && currentScroll > 50) {
        header.classList.add("hidden");
    } else {
        header.classList.remove("hidden");
    }
    lastScroll = currentScroll <= 0 ? 0 : currentScroll;
});

const footer = document.querySelector("footer");
let lastScrollFooter = 0;

window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    if (currentScroll > lastScrollFooter && currentScroll > 50) {
        // bajando: mostrar footer
        footer.classList.add("visible-footer");
    } else {
        // subiendo: ocultar footer
        footer.classList.remove("visible-footer");
    }

    lastScrollFooter = currentScroll <= 0 ? 0 : currentScroll;
});

const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_STORAGE_BUCKET",
  messagingSenderId: "TU_MESSAGING_SENDER_ID",
  appId: "TU_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

document.getElementById("uploadBtn").addEventListener("click", async () => {
    const audioFile = document.getElementById("audioFile").files[0];
    const coverFile = document.getElementById("coverFile").files[0];
    const songName = document.getElementById("songName").value;
    const artistName = document.getElementById("artistName").value;

    if (!audioFile || !coverFile || !songName || !artistName) return alert("Completa todos los campos");

    const coverRef = storage.ref('covers/' + coverFile.name);
    await coverRef.put(coverFile);
    const coverURL = await coverRef.getDownloadURL();

    const audioRef = storage.ref('songs/' + audioFile.name);
    await audioRef.put(audioFile);
    const audioURL = await audioRef.getDownloadURL();

    await db.collection("playlist").add({
        nombre: songName,
        artista: artistName,
        cover: coverURL,
        audio: audioURL,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });

    alert("Canción subida!");
});

const playlistContainer = document.querySelector(".playlist");

db.collection("playlist").orderBy("timestamp").onSnapshot(snapshot => {
    playlistContainer.innerHTML = ""; 
    snapshot.forEach(doc => {
        const data = doc.data();
        const item = document.createElement("div");
        item.classList.add("playlist-item");
        item.innerHTML = `
            <img src="${data.cover}" width="50">
            <span>${data.nombre} - ${data.artista}</span>
        `;
        item.addEventListener("click", () => {
            reproducirCancion(data.audio, data.cover, data.nombre, data.artista);
        });
        playlistContainer.appendChild(item);
    });
});

function reproducirCancion(audioURL, coverURL, nombre, artista) {
    const audio = new Audio(audioURL);
    document.querySelector(".music-player img").src = coverURL;
    document.querySelector(".song-title").textContent = nombre;
    document.querySelector(".song-artist").textContent = artista;
    audio.play();


}

document.addEventListener("DOMContentLoaded", () => {
    const player = document.querySelector('.spotify-player');
    if (player) {
        setTimeout(() => {
            player.classList.add('visible');
        }, 300);
    }
});

const toggleButton = document.getElementById(`togglePlayer`);
const spotifyPlayer = document.querySelector(`.spotify-player`);

toggleButton.addEventListener(`click`, () => {
    spotifyPlayer.classList.toggle(`minimized`);
    toggleButton.textContent = spotifyPlayer.classList.contains(`minimized`) ? `+` : `-`;
});

/* --- Efecto Fade: Solo se borra al tocar el borde superior --- */
window.addEventListener("scroll", () => {
    const elementos = document.querySelectorAll(".carousel-container, h2");

    elementos.forEach(el => {
        const rect = el.getBoundingClientRect();
        
        // CONFIGURACIÓN NUEVA:
        // startFade = 200: Empieza a desvanecerse solo cuando está muy cerca (200px) del tope.
        // Antes estaba en la mitad de la pantalla, por eso se veía mal.
        const startFade = 200; 
        
        // endFade = -100: Termina de borrarse cuando ya subió un poco fuera de la pantalla.
        const endFade = -100; 

        if (rect.top > startFade) {
            // Si está más abajo de la zona de peligro, se ve FULL HD
            el.style.opacity = 1;
            el.style.transform = "translateY(0)";
        } else {
            // Si entra en la zona superior, calculamos el fade suave
            let nuevaOpacidad = (rect.top - endFade) / (startFade - endFade);

            // Límites para que no se rompa
            if (nuevaOpacidad < 0) nuevaOpacidad = 0;
            if (nuevaOpacidad > 1) nuevaOpacidad = 1;

            el.style.opacity = nuevaOpacidad;
            el.style.transform = `translateY(${(1 - nuevaOpacidad) * -20}px)`;
        }
    });
});