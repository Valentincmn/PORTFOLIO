// Création et gestion du curseur personnalisé
const cursor = document.createElement('div');
cursor.style.width = '20px';
cursor.style.height = '20px';
cursor.style.backgroundColor = 'transparent';
cursor.style.border = '2px solid white';
cursor.style.borderRadius = '50%';
cursor.style.position = 'fixed';
cursor.style.pointerEvents = 'none';
cursor.style.zIndex = '9999';
cursor.style.transition = 'transform 0.2s ease';
document.body.appendChild(cursor);

// Suivre le mouvement de la souris
document.addEventListener('mousemove', (e) => {
    cursor.style.left = (e.clientX - 10) + 'px';
    cursor.style.top = (e.clientY - 10) + 'px';
});

// Effet de rétrécissement au clic
document.addEventListener('mousedown', () => {
    cursor.style.transform = 'scale(0.5)';
});

document.addEventListener('mouseup', () => {
    cursor.style.transform = 'scale(1)';
});// Permettre les clics sur les liens
document.querySelectorAll('a').forEach(link => {
    link.style.cursor = 'none';
    link.style.pointerEvents = 'auto';
});

