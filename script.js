// Timer functionality
let timerInterval;
let totalSeconds = 600; // 10 minutes
let currentSeconds = totalSeconds;
let isRunning = false;

// Format time as MM:SS
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Update timer display
function updateTimerDisplay() {
    const timerDisplay = document.getElementById('timer');
    timerDisplay.textContent = formatTime(currentSeconds);

    // Change color based on time remaining
    if (currentSeconds <= 60) {
        timerDisplay.style.background = '#ef4444'; // Red
        timerDisplay.classList.add('warning');
    } else if (currentSeconds <= 180) {
        timerDisplay.style.background = '#f59e0b'; // Orange
        timerDisplay.classList.remove('warning');
    } else {
        timerDisplay.style.background = '#2563eb'; // Blue
        timerDisplay.classList.remove('warning');
    }

    // Update progress bar
    const progressBar = document.querySelector('.presentation-progress-bar');
    if (progressBar) {
        const percentComplete = ((totalSeconds - currentSeconds) / totalSeconds) * 100;
        progressBar.style.width = percentComplete + '%';
    }
}

// Start timer
function startTimer() {
    if (isRunning) return;

    isRunning = true;
    const startBtn = document.getElementById('startTimer');
    startBtn.textContent = 'Pause';
    startBtn.style.background = '#f59e0b';

    timerInterval = setInterval(() => {
        if (currentSeconds > 0) {
            currentSeconds--;
            updateTimerDisplay();
        } else {
            stopTimer();
            // Alert when time is up
            showNotification('Temps écoulé!', 'danger');
        }
    }, 1000);
}

// Stop/Pause timer
function stopTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    const startBtn = document.getElementById('startTimer');
    startBtn.textContent = 'Reprendre';
    startBtn.style.background = '#10b981';
}

// Toggle timer (start/pause)
function toggleTimer() {
    if (isRunning) {
        stopTimer();
    } else {
        startTimer();
    }
}

// Reset timer
function resetTimer() {
    stopTimer();
    currentSeconds = totalSeconds;
    updateTimerDisplay();
    const startBtn = document.getElementById('startTimer');
    startBtn.textContent = 'Démarrer le chronomètre';
    startBtn.style.background = '#10b981';
}

// Smooth scroll to section
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const offset = 80; // Account for fixed navbar
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// Show notification
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Style notification
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 2rem;
        background: ${type === 'danger' ? '#ef4444' : '#10b981'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        font-weight: bold;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all cards
document.addEventListener('DOMContentLoaded', () => {
    // Initialize timer display
    updateTimerDisplay();

    // Attach timer event listeners (désactivé pour mode 3D immersif)
    // Les boutons n'existent plus dans la version 3D
    // document.getElementById('startTimer').addEventListener('click', toggleTimer);
    // document.getElementById('resetTimer').addEventListener('click', resetTimer);

    // Observe cards for animation (désactivé pour mode 3D)
    // const cards = document.querySelectorAll('.card');
    // cards.forEach(card => {
    //     observer.observe(card);
    // });

    // Add active state to nav links based on scroll (désactivé pour mode 3D)
    // const sections = document.querySelectorAll('.section');
    // const navLinks = document.querySelectorAll('.nav-link');

    // window.addEventListener('scroll', () => {
    //     let current = '';

    //     sections.forEach(section => {
    //         const sectionTop = section.offsetTop;
    //         const sectionHeight = section.clientHeight;
    //         if (window.pageYOffset >= (sectionTop - 200)) {
    //             current = section.getAttribute('id');
    //         }
    //     });

    //     navLinks.forEach(link => {
    //         link.classList.remove('active');
    //         if (link.getAttribute('href').slice(1) === current) {
    //             link.classList.add('active');
    //         }
    //     });
    // });

    // // Add click handlers to nav links
    // navLinks.forEach(link => {
    //     link.addEventListener('click', (e) => {
    //         e.preventDefault();
    //         const targetId = link.getAttribute('href').slice(1);
    //         scrollToSection(targetId);
    //     });
    // });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Space or Enter to toggle timer
        if (e.code === 'Space' || e.code === 'Enter') {
            if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                e.preventDefault();
                toggleTimer();
            }
        }

        // R to reset timer
        if (e.code === 'KeyR' && e.ctrlKey) {
            e.preventDefault();
            resetTimer();
            showNotification('Chronomètre réinitialisé', 'success');
        }

        // Number keys to jump to sections
        if (e.code >= 'Digit1' && e.code <= 'Digit4') {
            const sectionMap = {
                'Digit1': 'presentation',
                'Digit2': 'mtconges',
                'Digit3': 'portfolio',
                'Digit4': 'veille'
            };
            scrollToSection(sectionMap[e.code]);
        }
    });

    // Time markers for sections
    const timeMarkers = [
        { section: 'presentation', start: 0, duration: 90 },
        { section: 'mtconges', start: 90, duration: 180 },
        { section: 'portfolio', start: 270, duration: 180 },
        { section: 'veille', start: 450, duration: 150 }
    ];

    // Auto-scroll based on timer (optional feature)
    let autoScrollEnabled = false;

    // Add button to toggle auto-scroll (désactivé en mode 3D)
    // const autoScrollBtn = document.createElement('button');
    // autoScrollBtn.className = 'timer-btn';
    // autoScrollBtn.textContent = 'Auto-scroll: OFF';
    // autoScrollBtn.style.background = '#64748b';
    // autoScrollBtn.addEventListener('click', () => {
    //     autoScrollEnabled = !autoScrollEnabled;
    //     autoScrollBtn.textContent = `Auto-scroll: ${autoScrollEnabled ? 'ON' : 'OFF'}`;
    //     autoScrollBtn.style.background = autoScrollEnabled ? '#10b981' : '#64748b';
    //     if (autoScrollEnabled) {
    //         showNotification('Auto-scroll activé', 'success');
    //     }
    // });

    // Désactivé en mode 3D - timer-control n'existe plus
    // document.querySelector('.timer-control').appendChild(autoScrollBtn);

    // Check time markers and auto-scroll (désactivé en mode 3D)
    // let lastSection = '';
    // setInterval(() => {
    //     if (!isRunning || !autoScrollEnabled) return;

    //     const elapsed = totalSeconds - currentSeconds;
    //     const currentMarker = timeMarkers.find(marker =>
    //         elapsed >= marker.start && elapsed < (marker.start + marker.duration)
    //     );

    //     if (currentMarker && currentMarker.section !== lastSection) {
    //         scrollToSection(currentMarker.section);
    //         lastSection = currentMarker.section;
    //         showNotification(`Section: ${currentMarker.section}`, 'success');
    //     }
    // }, 1000);

    // Fullscreen toggle (désactivé en mode 3D - timer-control n'existe plus)
    // const fullscreenBtn = document.createElement('button');
    // fullscreenBtn.className = 'timer-btn';
    // fullscreenBtn.textContent = 'Plein écran';
    // fullscreenBtn.style.background = '#6366f1';
    // fullscreenBtn.addEventListener('click', () => {
    //     if (!document.fullscreenElement) {
    //         document.documentElement.requestFullscreen();
    //         fullscreenBtn.textContent = 'Quitter plein écran';
    //     } else {
    //         document.exitFullscreen();
    //         fullscreenBtn.textContent = 'Plein écran';
    //     }
    // });

    // document.querySelector('.timer-control').insertBefore(fullscreenBtn, autoScrollBtn);

    // Add presentation mode (désactivé en mode 3D)
    // let presentationMode = false;
    // const presentationBtn = document.createElement('button');
    // presentationBtn.className = 'timer-btn';
    // presentationBtn.textContent = 'Mode présentation';
    // presentationBtn.style.background = '#8b5cf6';
    // presentationBtn.addEventListener('click', () => {
    //     presentationMode = !presentationMode;
    //     document.body.classList.toggle('presentation-mode');
    //     presentationBtn.textContent = presentationMode ? 'Mode normal' : 'Mode présentation';

    //     if (presentationMode) {
    //         // Hide timer controls, increase font size
    //         document.querySelector('.timer-control').style.opacity = '0.3';
    //         document.body.style.fontSize = '1.1em';
    //         showNotification('Mode présentation activé', 'success');
    //     } else {
    //         document.querySelector('.timer-control').style.opacity = '1';
    //         document.body.style.fontSize = '1em';
    //     }
    // });

    // document.querySelector('.timer-control').insertBefore(presentationBtn, fullscreenBtn);

    // Welcome message
    setTimeout(() => {
        showNotification('Appuyez sur Espace pour démarrer le chronomètre', 'success');
    }, 1000);

    // Console easter egg
    console.log('%c🎓 Présentation BTS SIO SLAM Bloc 1', 'font-size: 20px; color: #2563eb; font-weight: bold;');
    console.log('%c📚 Raccourcis clavier:', 'font-size: 14px; color: #10b981;');
    console.log('  - Espace/Entrée : Démarrer/Pause chronomètre');
    console.log('  - Ctrl+R : Réinitialiser chronomètre');
    console.log('  - 1-4 : Aller à la section correspondante');
    console.log('%cBonne présentation! 🚀', 'font-size: 14px; color: #f59e0b;');
});

// Export functions for potential external use
window.presentationUtils = {
    startTimer,
    stopTimer,
    resetTimer,
    scrollToSection,
    showNotification
};
