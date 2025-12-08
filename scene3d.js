// Scene 3D - Setup PC Gaming Réaliste avec Bureau Interactif
class GamerSetup3D {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.desk = null;
        this.monitor = null;
        this.screenMesh = null;
        this.pcCase = null;
        this.keyboard = null;
        this.mouse = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();
        this.time = 0;

        // Contenu des projets
        this.projects = {
            presentation: {
                title: "Présentation Personnelle",
                content: "Virgile Allix\nBTS SIO SLAM\n\nCompétences:\n• Java & MVC\n• JavaScript & Web\n• MySQL & Firebase\n• Architecture logicielle"
            },
            mtconges: {
                title: "Projet 1: MT-Congés",
                content: "Application Java/MySQL\n\nTech: Java 17, Swing, MySQL\nArchitecture MVC (POJO+DAO)\n\nFonctionnalités:\n• Auth sécurisée\n• Gestion multi-rôles\n• Validation congés"
            },
            rftg: {
                title: "Projet 2: RFTG",
                content: "Système location DVD\n\nWeb: Laravel (Admin)\nMobile: Android Studio\nBDD: MySQL Sakila\n\nFeatures:\n• Catalogue films\n• Gestion stocks\n• Réservations"
            },
            veille: {
                title: "Veille Technologique",
                content: "IA & Cybersécurité\n\nThèmes:\n• Attaques par IA\n• Défense automatisée\n• Course techno\n\nMéthodologie:\n• Veille quotidienne\n• Sources multiples"
            }
        };

        this.currentProject = 'desktop'; // Start on desktop
        this.clickableObjects = [];
        this.isZoomed = false;
        this.windows = []; // Array to store open windows
        this.activeWindow = null;
        this.raycaster = new THREE.Raycaster();
        this.mouseVector = new THREE.Vector2();

        // Desktop UI State
        this.desktopState = {
            mouseX: 0,
            mouseY: 0,
            icons: [
                { id: 'presentation', name: 'Présentation', icon: '📝', x: 20, y: 20 },
                { id: 'mtconges', name: 'MT-Congés', icon: '📅', x: 20, y: 120 },
                { id: 'rftg', name: 'RFTG', icon: '💿', x: 20, y: 220 },
                { id: 'veille', name: 'Veille Tech', icon: '🛡️', x: 20, y: 320 }
            ]
        };

        this.init();
    }

    init() {
        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1a1a2e);
        this.scene.fog = new THREE.Fog(0x1a1a2e, 10, 50);

        // Camera
        this.camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 5, 10);
        this.camera.lookAt(0, 2, 0);

        // Renderer
        const canvas = document.getElementById('scene3d');
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: false
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // OrbitControls
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.minDistance = 4;
        this.controls.maxDistance = 20;
        this.controls.maxPolarAngle = Math.PI / 2.2;
        this.controls.target.set(0, 2, 0);
        this.controls.target.set(0, 2, 0);
        this.controls.enableDamping = true;
        this.controls.maxPolarAngle = Math.PI / 2; // Limit angle to not go below floor
        this.controls.update();

        // Save original camera position for un-zoom
        this.defaultCameraPos = { x: 0, y: 5, z: 10 };
        this.defaultTarget = { x: 0, y: 2, z: 0 };

        // Lights
        this.createLights();

        // Create scene
        this.createRoom();
        this.createDesk();
        this.createMonitor();
        this.createPCCase();
        this.createKeyboard();
        this.createMousePad();
        this.createMousePad();
        this.createMouse(); // New mouse method
        // this.createButtons(); // Removed Buttons

        // Events
        window.addEventListener('resize', () => this.onWindowResize());
        window.addEventListener('click', (e) => this.onClick(e));
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));

        // Hide loading screen
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) {
                loadingScreen.style.opacity = '0';
                setTimeout(() => loadingScreen.style.display = 'none', 500);
            }
        }, 1000);

        // Animate
        this.animate();
    }

    createLights() {
        // Ambient light
        const ambient = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambient);

        // Main light (plafond)
        const mainLight = new THREE.PointLight(0xffffff, 0.8, 50);
        mainLight.position.set(0, 10, 0);
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 2048;
        mainLight.shadow.mapSize.height = 2048;
        this.scene.add(mainLight);

        // RGB lights derrière le bureau
        const rgbLight1 = new THREE.PointLight(0xff00ff, 1, 10);
        rgbLight1.position.set(-3, 2, -2);
        this.scene.add(rgbLight1);

        const rgbLight2 = new THREE.PointLight(0x00ffff, 1, 10);
        rgbLight2.position.set(3, 2, -2);
        this.scene.add(rgbLight2);

        // Screen glow
        const screenLight = new THREE.PointLight(0x4488ff, 0.5, 5);
        screenLight.position.set(0, 3, 0.5);
        this.scene.add(screenLight);
    }

    createRoom() {
        // Floor
        const floorGeometry = new THREE.PlaneGeometry(30, 30);
        const floorMaterial = new THREE.MeshStandardMaterial({
            color: 0x2a2a3e,
            roughness: 0.8,
            metalness: 0.2
        });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;
        this.scene.add(floor);

        // Back wall
        const wallGeometry = new THREE.PlaneGeometry(30, 15);
        const wallMaterial = new THREE.MeshStandardMaterial({
            color: 0x1e1e2e,
            roughness: 0.9
        });
        const wall = new THREE.Mesh(wallGeometry, wallMaterial);
        wall.position.set(0, 7.5, -5);
        wall.receiveShadow = true;
        this.scene.add(wall);
    }

    createDesk() {
        const deskGroup = new THREE.Group();

        // Desktop surface
        const topGeometry = new THREE.BoxGeometry(8, 0.1, 3);
        const topMaterial = new THREE.MeshStandardMaterial({
            color: 0x3a3a4a,
            roughness: 0.7,
            metalness: 0.3
        });
        const top = new THREE.Mesh(topGeometry, topMaterial);
        top.position.y = 2;
        top.castShadow = true;
        top.receiveShadow = true;
        deskGroup.add(top);

        // Legs
        const legGeometry = new THREE.BoxGeometry(0.1, 2, 0.1);
        const legMaterial = new THREE.MeshStandardMaterial({
            color: 0x2a2a3a,
            roughness: 0.6,
            metalness: 0.4
        });

        const legPositions = [
            [-3.9, 1, -1.4],
            [3.9, 1, -1.4],
            [-3.9, 1, 1.4],
            [3.9, 1, 1.4]
        ];

        legPositions.forEach(pos => {
            const leg = new THREE.Mesh(legGeometry, legMaterial);
            leg.position.set(...pos);
            leg.castShadow = true;
            deskGroup.add(leg);
        });

        this.scene.add(deskGroup);
        this.desk = deskGroup;
    }

    createMonitor() {
        const monitorGroup = new THREE.Group();

        // Stand base
        const baseGeometry = new THREE.CylinderGeometry(0.3, 0.4, 0.05, 32);
        const standMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a1a,
            roughness: 0.3,
            metalness: 0.7
        });
        const base = new THREE.Mesh(baseGeometry, standMaterial);
        base.position.y = 2.05;
        base.castShadow = true;
        monitorGroup.add(base);

        // Stand pole
        const poleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 16);
        const pole = new THREE.Mesh(poleGeometry, standMaterial);
        pole.position.y = 2.55;
        pole.castShadow = true;
        monitorGroup.add(pole);

        // Monitor frame
        // Monitor frame - Larger
        const frameGeometry = new THREE.BoxGeometry(7, 4, 0.2); // Doubled size roughly
        const frameMaterial = new THREE.MeshStandardMaterial({
            color: 0x0a0a0a,
            roughness: 0.2,
            metalness: 0.8
        });
        const frame = new THREE.Mesh(frameGeometry, frameMaterial);
        frame.position.set(0, 4.5, 0); // Raised position
        frame.castShadow = true;
        monitorGroup.add(frame);

        // Screen (canvas pour afficher du texte) - Larger
        const screenGeometry = new THREE.PlaneGeometry(6.6, 3.7);

        // Create canvas texture - High Res
        const canvas = document.createElement('canvas');
        canvas.width = 1920;
        canvas.height = 1080;
        const ctx = canvas.getContext('2d');

        // Initial screen content
        this.updateOS(ctx); // Renamed method

        const screenTexture = new THREE.CanvasTexture(canvas);
        screenTexture.minFilter = THREE.LinearFilter;
        screenTexture.magFilter = THREE.LinearFilter; // Better quality

        const screenMaterial = new THREE.MeshBasicMaterial({
            map: screenTexture,
            emissive: 0xffffff, // White emissive for brightness
            emissiveMap: screenTexture, // Use same texture for emission
            emissiveIntensity: 0.1
        });

        const screen = new THREE.Mesh(screenGeometry, screenMaterial);
        screen.position.set(0, 4.5, 0.11);
        screen.userData = { isScreen: true }; // Tag for raycasting
        monitorGroup.add(screen);

        this.screenMesh = screen;
        this.screenTexture = screenTexture;
        this.screenCanvas = canvas;
        this.screenCtx = ctx;

        // Add screen to clickable objects
        this.clickableObjects.push(screen);

        monitorGroup.position.z = -0.5;
        this.scene.add(monitorGroup);
        this.monitor = monitorGroup;
    }

    updateOS(ctx) {
        // Clear screen
        ctx.fillStyle = '#1a1a2e'; // Wallpaper color
        ctx.fillRect(0, 0, 1920, 1080);

        // Draw Wallpaper Pattern (Hexagons)
        ctx.strokeStyle = '#2a2a3e';
        ctx.lineWidth = 2;
        for (let i = 0; i < 20; i++) {
            for (let j = 0; j < 12; j++) {
                ctx.beginPath();
                ctx.arc(i * 100, j * 100, 30, 0, Math.PI * 2);
                ctx.stroke();
            }
        }

        // Draw Desktop Icons
        this.desktopState.icons.forEach(icon => {
            // Icon Background
            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.fillRect(icon.x, icon.y, 80, 80);

            // Emoji Icon
            ctx.font = '40px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(icon.icon, icon.x + 40, icon.y + 35);

            // Label
            ctx.fillStyle = '#ffffff';
            ctx.font = '12px Arial';
            ctx.fillText(icon.name, icon.x + 40, icon.y + 70);
        });

        // Draw Windows
        this.windows.forEach(win => this.drawWindow(ctx, win));

        // Draw Taskbar
        ctx.fillStyle = 'rgba(20, 20, 30, 0.9)';
        ctx.fillRect(0, 1030, 1920, 50);

        // Start Button
        ctx.fillStyle = '#00ffff';
        ctx.fillRect(0, 1030, 60, 50);
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 20px Arial';
        ctx.fillText('WIN', 30, 1062);

        // Clock
        const now = new Date();
        const timeStr = now.toLocaleTimeString();
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'right';
        ctx.fillText(timeStr, 1900, 1062);

        // Virtual Cursor (if zoomed)
        if (this.isZoomed) {
            ctx.fillStyle = '#ff00ff';
            ctx.beginPath();
            ctx.moveTo(this.desktopState.mouseX, this.desktopState.mouseY);
            ctx.lineTo(this.desktopState.mouseX + 20, this.desktopState.mouseY + 20);
            ctx.lineTo(this.desktopState.mouseX, this.desktopState.mouseY + 25);
            ctx.fill();
        }

        if (this.screenTexture) this.screenTexture.needsUpdate = true;
    }

    drawWindow(ctx, win) {
        // Window Shadow
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 20;

        // Window Body
        ctx.fillStyle = '#252526';
        ctx.fillRect(win.x, win.y, win.w, win.h);
        ctx.shadowBlur = 0; // Reset shadow

        // Title Bar
        ctx.fillStyle = '#333333';
        ctx.fillRect(win.x, win.y, win.w, 40);

        // Title
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(win.title, win.x + 15, win.y + 26);

        // Close Button (red)
        ctx.fillStyle = '#ff5555';
        ctx.fillRect(win.x + win.w - 40, win.y, 40, 40);
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText('✕', win.x + win.w - 20, win.y + 26);

        // Content Area
        ctx.save();
        ctx.beginPath();
        ctx.rect(win.x, win.y + 40, win.w, win.h - 40);
        ctx.clip();

        // Content Text
        ctx.fillStyle = '#cccccc';
        ctx.font = '16px Monospace';
        const project = this.projects[win.id];
        if (project) {
            const lines = project.content.split('\n');
            let ly = win.y + 70;
            lines.forEach(line => {
                ctx.fillText(line, win.x + 20, ly);
                ly += 25;
            });
        }

        ctx.restore();
    }

    createPCCase() {
        const pcGroup = new THREE.Group();

        // Main case
        const caseGeometry = new THREE.BoxGeometry(0.5, 1.2, 1);
        const caseMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a1a,
            roughness: 0.3,
            metalness: 0.7
        });
        const pcCase = new THREE.Mesh(caseGeometry, caseMaterial);
        pcCase.position.y = 2.65;
        pcCase.castShadow = true;
        pcGroup.add(pcCase);

        // Glass panel
        const glassGeometry = new THREE.PlaneGeometry(0.4, 1);
        const glassMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x88ccff,
            transparent: true,
            opacity: 0.3,
            metalness: 0.1,
            roughness: 0.1
        });
        const glass = new THREE.Mesh(glassGeometry, glassMaterial);
        glass.position.set(0.26, 2.65, 0);
        glass.rotation.y = -Math.PI / 2;
        pcGroup.add(glass);

        // RGB strips
        const rgbColors = [0xff00ff, 0x00ffff, 0xff0080];
        for (let i = 0; i < 3; i++) {
            const strip = new THREE.Mesh(
                new THREE.BoxGeometry(0.02, 0.3, 0.02),
                new THREE.MeshBasicMaterial({ color: rgbColors[i] })
            );
            strip.position.set(0.2, 2.3 + i * 0.3, -0.3 + i * 0.3);
            pcGroup.add(strip);
        }

        pcGroup.position.set(2.5, 0, 0);
        this.scene.add(pcGroup);
        this.pcCase = pcGroup;
    }

    createKeyboard() {
        const keyboardGroup = new THREE.Group();

        // Base
        const baseGeometry = new THREE.BoxGeometry(1.5, 0.05, 0.5);
        const baseMaterial = new THREE.MeshStandardMaterial({
            color: 0x2a2a2a,
            roughness: 0.4,
            metalness: 0.6
        });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.set(0, 2.08, 0.7);
        base.castShadow = true;
        keyboardGroup.add(base);

        // Keys (simplified)
        const keyMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a1a,
            roughness: 0.6
        });

        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 15; col++) {
                const key = new THREE.Mesh(
                    new THREE.BoxGeometry(0.08, 0.02, 0.08),
                    keyMaterial
                );
                key.position.set(
                    -0.65 + col * 0.09,
                    2.11,
                    0.5 + row * 0.09
                );
                key.castShadow = true;
                keyboardGroup.add(key);
            }
        }

        this.scene.add(keyboardGroup);
        this.keyboard = keyboardGroup;
    }

    createMousePad() {
        const padGeometry = new THREE.BoxGeometry(0.8, 0.01, 0.6);
        const padMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a2e,
            roughness: 0.8
        });
        const pad = new THREE.Mesh(padGeometry, padMaterial);
        pad.position.set(-2, 2.06, 0.8);
        pad.receiveShadow = true;
        this.scene.add(pad);
    }

    createMouse() {
        const mouseGroup = new THREE.Group();

        // Body
        const bodyGeo = new THREE.BoxGeometry(0.6, 0.3, 1);
        const bodyMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.5 });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.position.y = 0.15;
        body.castShadow = true;
        mouseGroup.add(body);

        // RGB Line
        const rgbGeo = new THREE.BoxGeometry(0.62, 0.05, 1.02);
        const rgbMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const rgb = new THREE.Mesh(rgbGeo, rgbMat);
        rgb.position.y = 0.05;
        mouseGroup.add(rgb);
        this.mouseRgb = rgb; // Store for animation

        mouseGroup.position.set(2.5, 2.05, 1.5);
        this.scene.add(mouseGroup);
        this.mouseModel = mouseGroup;
    }

    // Removed createButtons


    onMouseMove(event) {
        // Standard raycasting for interaction
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        if (this.isZoomed) {
            // Calculate mouse position on the virtual screen
            this.raycaster.setFromCamera(this.mouse, this.camera);
            const intersects = this.raycaster.intersectObject(this.screenMesh);

            if (intersects.length > 0) {
                const uv = intersects[0].uv;
                this.desktopState.mouseX = uv.x * 1920;
                this.desktopState.mouseY = (1 - uv.y) * 1080;
                document.body.style.cursor = 'none'; // Hide real cursor
            } else {
                document.body.style.cursor = 'default';
            }
            this.updateOS(this.screenCtx);
        } else {
            // Check if hovering Screen to change cursor
            this.raycaster.setFromCamera(this.mouse, this.camera);
            const intersects = this.raycaster.intersectObjects(this.clickableObjects);
            if (intersects.length > 0) {
                document.body.style.cursor = 'pointer';
            } else {
                document.body.style.cursor = 'default';
            }
        }
    }

    onClick(event) {
        this.raycaster.setFromCamera(this.mouse, this.camera);

        if (!this.isZoomed) {
            // Check if clicked screen
            const intersects = this.raycaster.intersectObject(this.screenMesh);
            if (intersects.length > 0) {
                this.zoomIn();
            }
        } else {
            // Logic for clicking INSIDE the OS
            const hitScreen = this.raycaster.intersectObject(this.screenMesh);
            if (hitScreen.length > 0) {
                this.handleOSClick(this.desktopState.mouseX, this.desktopState.mouseY);
            } else {
                // Clicked outside -> Zoom out
                this.zoomOut();
            }
        }
    }

    zoomIn() {
        this.isZoomed = true;

        // Disable orbit controls
        this.controls.enabled = false;

        // Animate Camera to positions
        gsap.to(this.camera.position, {
            x: 0, y: 4.5, z: 4.5, // Close to screen
            duration: 1.5,
            ease: "power2.inOut"
        });

        gsap.to(this.controls.target, {
            x: 0, y: 4.5, z: 0, // Look at screen center
            duration: 1.5,
            ease: "power2.inOut",
            onUpdate: () => this.camera.lookAt(this.controls.target)
        });
    }

    zoomOut() {
        this.isZoomed = false;
        this.controls.enabled = true;
        document.body.style.cursor = 'default';

        gsap.to(this.camera.position, {
            x: this.defaultCameraPos.x,
            y: this.defaultCameraPos.y,
            z: this.defaultCameraPos.z,
            duration: 1.5,
            ease: "power2.inOut"
        });

        gsap.to(this.controls.target, {
            x: this.defaultTarget.x,
            y: this.defaultTarget.y,
            z: this.defaultTarget.z,
            duration: 1.5,
            ease: "power2.inOut",
            onUpdate: () => this.camera.lookAt(this.controls.target)
        });
    }

    handleOSClick(x, y) {
        // Check Windows (Close buttons or focus)
        let clickedWindow = false;
        // Iterate backwards (top windows first)
        for (let i = this.windows.length - 1; i >= 0; i--) {
            const win = this.windows[i];
            // Hit test
            if (x >= win.x && x <= win.x + win.w && y >= win.y && y <= win.y + win.h) {
                clickedWindow = true;

                // Check Close Button
                if (x >= win.x + win.w - 40 && y <= win.y + 40) {
                    this.windows.splice(i, 1);
                } else {
                    // Bring to front
                    this.windows.push(this.windows.splice(i, 1)[0]);
                }
                break;
            }
        }

        if (!clickedWindow) {
            // Check Icons
            this.desktopState.icons.forEach(icon => {
                if (x >= icon.x && x <= icon.x + 80 && y >= icon.y && y <= icon.y + 80) {
                    this.openWindow(icon);
                }
            });
        }

        this.updateOS(this.screenCtx);
    }

    openWindow(icon) {
        // Check if already open
        const existing = this.windows.find(w => w.id === icon.id);
        if (existing) return;

        this.windows.push({
            id: icon.id,
            title: icon.name,
            x: 200 + this.windows.length * 30,
            y: 100 + this.windows.length * 30,
            w: 800,
            h: 600
        });
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.time += 0.01;

        // Update controls
        this.controls.update();

        // Gentle PC case pulse
        if (this.pcCase) {
            this.pcCase.children.forEach((child, i) => {
                if (child.material && child.material.type === 'MeshBasicMaterial') {
                    child.material.opacity = 0.6 + Math.sin(this.time * 2 + i) * 0.2;
                }
            });
        }

        // Render
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new GamerSetup3D();
    });
} else {
    new GamerSetup3D();
}
