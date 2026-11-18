// Inicializar iconos Lucide si están disponibles
if (typeof lucide !== 'undefined') {
    lucide.createIcons();
}

// --- 1. FONDO THREE.JS PRINCIPAL (PARTÍCULAS MARINAS) ---
const container = document.getElementById('webgl-container');
if (container) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const particlesCount = 500;
    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 20;
    }
    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.045,
        color: 0x2EE2B4,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    camera.position.z = 4;

    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) - 0.5;
        mouseY = (e.clientY / window.innerHeight) - 0.5;
    });

    const clock = new THREE.Clock();
    function animateBg() {
        requestAnimationFrame(animateBg);
        const elapsedTime = clock.getElapsedTime();
        particlesMesh.rotation.y = elapsedTime * 0.03 + (mouseX * 0.3);
        particlesMesh.rotation.x = elapsedTime * 0.015 + (mouseY * 0.3);
        renderer.render(scene, camera);
    }
    animateBg();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// --- 2. CARRUSEL DE DETALLES ---
let currentSlide = 0;
const track = document.getElementById('details-track');
const dots = document.querySelectorAll('.c-dot');

function updateCarousel() {
    if (!track) return;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

dots.forEach((dot) => {
    dot.addEventListener('click', () => {
        currentSlide = Number(dot.getAttribute('data-slide')) || 0;
        updateCarousel();
    });
});

const nextSlideBtn = document.getElementById('next-slide');
if (nextSlideBtn) {
    nextSlideBtn.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % 2;
        updateCarousel();
    });
}

const prevSlideBtn = document.getElementById('prev-slide');
if (prevSlideBtn) {
    prevSlideBtn.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + 2) % 2;
        updateCarousel();
    });
}

// --- 3. SCROLL & JOURNEY PROGRESS BAR (CÍRCULOS DE PROGRESO) ---
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    const sections = document.querySelectorAll('.full-screen-section');
    const jDots = document.querySelectorAll('.j-dot');

    sections.forEach((sec, idx) => {
        ScrollTrigger.create({
            trigger: sec,
            start: "top center",
            end: "bottom center",
            onEnter: () => activateNavDot(idx),
            onEnterBack: () => activateNavDot(idx)
        });
    });

    function activateNavDot(index) {
        jDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }
}

// --- 4. CUENTA REGRESIVA (29 DE NOVIEMBRE 2026 A LAS 14:00 PM) ---
const targetDate = new Date("November 29, 2026 14:00:00").getTime();
const countdownInterval = setInterval(() => {
    const now = new Date().getTime();
    const distance = targetDate - now;

    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");
    const countdownContainer = document.getElementById("countdown");

    if (distance < 0) {
        clearInterval(countdownInterval);
        if (countdownContainer) {
            countdownContainer.innerHTML = 
                "<div style='grid-column: 1 / -1; font-size: 1.4rem; font-family: var(--font-serif); color: var(--color-arena-dorada);'>¡Hoy es el gran día! ¡A celebrar!</div>";
        }
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.innerText = days < 10 ? "0" + days : days;
    if (hoursEl) hoursEl.innerText = hours < 10 ? "0" + hours : hours;
    if (minutesEl) minutesEl.innerText = minutes < 10 ? "0" + minutes : minutes;
    if (secondsEl) secondsEl.innerText = seconds < 10 ? "0" + seconds : seconds;
}, 1000);

// --- 5. MODAL DE CONFIRMACIÓN (WHATSAPP +591 76925424) ---
const WHATSAPP_NUMBER = "59176925424";
const openModalBtn = document.getElementById('open-rsvp-modal');
const closeModalBtn = document.getElementById('close-rsvp-modal');
const modalOverlay = document.getElementById('rsvp-modal-overlay');
const guestCountInput = document.getElementById('guest-count');
const guestNamesContainer = document.getElementById('guest-names-container');
const messagePreviewEl = document.getElementById('rsvp-message-preview');
const rsvpForm = document.getElementById('rsvp-form');

function renderGuestInputs(count) {
    if (!guestNamesContainer) return;
    const currentValues = Array.from(guestNamesContainer.querySelectorAll('.guest-name-input')).map(inp => inp.value);
    guestNamesContainer.innerHTML = '';

    for (let i = 0; i < count; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'guest-name-input';
        input.placeholder = `Nombre de la persona ${i + 1}`;
        input.required = true;
        input.value = currentValues[i] || '';
        input.addEventListener('input', updateMessagePreview);
        guestNamesContainer.appendChild(input);
    }
    updateMessagePreview();
}

function buildFormattedMessage() {
    const count = Math.max(1, parseInt(guestCountInput ? guestCountInput.value : 1, 10) || 1);
    const nameInputs = guestNamesContainer ? Array.from(guestNamesContainer.querySelectorAll('.guest-name-input')) : [];
    const lines = nameInputs.map((inp, idx) => {
        const val = inp.value.trim() || `Persona ${idx + 1}`;
        return `-${val}`;
    });

    return [
        `Hola gracias por invitarme confirmamos ${count}`,
        ...lines
    ].join("\n");
}

function updateMessagePreview() {
    if (messagePreviewEl) {
        messagePreviewEl.textContent = buildFormattedMessage();
    }
}

if (openModalBtn && modalOverlay) {
    openModalBtn.addEventListener('click', () => {
        modalOverlay.classList.add('active');
        modalOverlay.setAttribute('aria-hidden', 'false');
        renderGuestInputs(parseInt(guestCountInput ? guestCountInput.value : 1, 10) || 1);
    });
}

if (closeModalBtn && modalOverlay) {
    closeModalBtn.addEventListener('click', () => {
        modalOverlay.classList.remove('active');
        modalOverlay.setAttribute('aria-hidden', 'true');
    });
}

if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            modalOverlay.classList.remove('active');
            modalOverlay.setAttribute('aria-hidden', 'true');
        }
    });
}

if (guestCountInput) {
    guestCountInput.addEventListener('input', () => {
        let val = parseInt(guestCountInput.value, 10);
        if (isNaN(val) || val < 1) val = 1;
        if (val > 20) val = 20;
        renderGuestInputs(val);
    });
}

if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const finalMessage = buildFormattedMessage();
        const encodedText = encodeURIComponent(finalMessage);
        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedText}`;
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    });
}

// Inicializar vista previa por defecto
renderGuestInputs(1);