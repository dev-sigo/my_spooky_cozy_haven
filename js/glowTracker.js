function updateGlowPosition() {
    const lantern = document.getElementById('jack-of-lantern');
    const root = document.documentElement;

    if (!lantern) return;

    const rect = lantern.getBoundingClientRect();
    
    // 1. Calcular o centro do SVG (em PX)
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const positionX = centerX - (window.innerWidth / 2);
    const positionY = centerY - (window.innerHeight / 2);

    // 2. Aplicar as coordenadas CENTRADAS (em PX) ao CSS
    root.style.setProperty('--lantern-x', `${positionX}px`);
    root.style.setProperty('--lantern-y', `${positionY}px`);
}

export function initGlowTracking() {
    updateGlowPosition();

    window.addEventListener('resize', updateGlowPosition);
    window.addEventListener('scroll', updateGlowPosition); 
}