document.addEventListener("DOMContentLoaded", () => {
    console.log("💌 sobre.js cargado correctamente");

    const heartBtn = document.getElementById('heartButton');
    const msg = document.getElementById('loveMessage');
    const paperSound = document.getElementById('paperSound');
    const floatingContainer = document.getElementById("floatingContainer");

    if (!heartBtn || !msg) {
        console.log("⚠️ No es la página del sobre, deteniendo sobre.js");
        return;
    }

    // Frases románticas
    const frases = [
        "¡Te amo más de lo que te puedo explicar y demostrar!",
        "Cada momento que paso contigo vale millones 💖",
        "Eres mi lugar deseado y perfecto ✨",
        "Gracias por hacerme feliz 🌹",
        "Gracias por amarme 💕",
        "Gracias por quererme 😍",
        "Te amo corazón de melón 🍉",
        "Tú haces que todo valga la pena 💫",
        "Mi vida es mucho mejor contigo 💞",
        "Eres mi mujer 💋",
        "Vales todooo 💘"
    ];

    let indexFrase = 0;
    let firstClick = true;

    heartBtn.addEventListener('click', () => {

        // Reproducir sonido
        if (paperSound) {
            paperSound.currentTime = 0;
            paperSound.play().catch(() => {});
        }

        // Mensaje principal que aparece debajo del corazón
        if (firstClick) {
            msg.innerHTML = "<span class='message-bubble'>¿Te gusta? ¡Pulsa más! 💗</span>";
            firstClick = false;
        } else {
            msg.innerHTML = "<span class='message-bubble'>" + frases[indexFrase] + "</span>";
        }

        indexFrase = (indexFrase + 1) % frases.length;

        const burbuja = document.createElement("div");
        burbuja.textContent = frases[Math.floor(Math.random() * frases.length)];
        burbuja.classList.add("floating-message");

        burbuja.style.left = Math.random() * 80 + "%";
        burbuja.style.top = Math.random() * 70 + "%";

        floatingContainer.appendChild(burbuja);

        setTimeout(() => {
            burbuja.remove();
        }, 4000);
    });
});