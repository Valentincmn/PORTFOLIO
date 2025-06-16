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

// Écran de chargement avec compteur adaptatif
class Loader {
    constructor() {
        this.loader = document.getElementById('loader');
        this.number = document.getElementById('loaderNumber');
        this.currentNumber = 0;
        this.startTime = Date.now();
        this.isPageLoaded = false;
        this.resources = {
            total: 0,
            loaded: 0
        };

        this.init();
    }

    init() {
        // Détecter la vitesse de connexion
        this.detectNetworkSpeed();

        // Compter les ressources à charger
        this.countResources();

        // Commencer l'animation du compteur
        this.animateCounter();

        // Observer le chargement des ressources
        this.observeResourceLoading();

        // Attendre que la page soit complètement chargée
        window.addEventListener('load', () => {
            this.isPageLoaded = true;
            this.completeLoading();
        });
    }

    detectNetworkSpeed() {
        // Utiliser l'API Network Information si disponible
        if ('connection' in navigator) {
            const connection = navigator.connection;
            const effectiveType = connection.effectiveType;

            // Adapter la vitesse selon le type de connexion
            switch (effectiveType) {
                case 'slow-2g':
                    this.speedMultiplier = 0.3;
                    break;
                case '2g':
                    this.speedMultiplier = 0.5;
                    break;
                case '3g':
                    this.speedMultiplier = 0.8;
                    break;
                case '4g':
                default:
                    this.speedMultiplier = 1.2;
                    break;
            }
        } else {
            this.speedMultiplier = 1;
        }
    }

    countResources() {
        // Compter les images, vidéos, CSS, JS
        const images = document.querySelectorAll('img');
        const videos = document.querySelectorAll('video');
        const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
        const scripts = document.querySelectorAll('script[src]');

        this.resources.total = images.length + videos.length + stylesheets.length + scripts.length;
    }

    observeResourceLoading() {
        // Observer les images
        document.querySelectorAll('img').forEach(img => {
            if (img.complete) {
                this.resources.loaded++;
            } else {
                img.addEventListener('load', () => this.resources.loaded++);
                img.addEventListener('error', () => this.resources.loaded++);
            }
        });

        // Observer les vidéos
        document.querySelectorAll('video').forEach(video => {
            video.addEventListener('loadeddata', () => this.resources.loaded++);
            video.addEventListener('error', () => this.resources.loaded++);
        });
    }

    animateCounter() {
        const updateCounter = () => {
            if (this.isPageLoaded && this.currentNumber >= 99) {
                this.currentNumber = 100;
                this.number.textContent = this.currentNumber;
                setTimeout(() => this.hideLoader(), 300);
                return;
            }

            // Calculer le pourcentage de progression
            const timeProgress = Math.min((Date.now() - this.startTime) / (3000 / this.speedMultiplier), 0.8);
            const resourceProgress = this.resources.total > 0 ? (this.resources.loaded / this.resources.total) * 0.6 : 0.3;
            const pageProgress = this.isPageLoaded ? 0.2 : 0;

            const targetProgress = (timeProgress + resourceProgress + pageProgress) * 100;

            // Animation fluide vers la target
            if (this.currentNumber < targetProgress) {
                this.currentNumber += (targetProgress - this.currentNumber) * 0.1;
            }

            this.number.textContent = Math.floor(Math.min(this.currentNumber, 99));
            requestAnimationFrame(updateCounter);
        };

        updateCounter();
    }

    completeLoading() {
        // Forcer le passage à 100% quand tout est chargé
        setTimeout(() => {
            if (this.currentNumber < 100) {
                this.currentNumber = 100;
                this.number.textContent = 100;
                setTimeout(() => this.hideLoader(), 500);
            }
        }, 200);
    }

    hideLoader() {
        this.loader.classList.add('loaded');

        // Supprimer l'élément du DOM après la transition
        setTimeout(() => {
            if (this.loader.parentNode) {
                this.loader.parentNode.removeChild(this.loader);
            }
        }, 800);
    }
}

// Initialiser le loader dès que possible
new Loader();

