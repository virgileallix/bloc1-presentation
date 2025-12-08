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

        this.currentProject = 'presentation';
        this.clickableObjects = [];

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
        this.controls.update();

        // Lights
        this.createLights();

        // Create scene
        this.createRoom();
        this.createDesk();
        this.createMonitor();
        this.createPCCase();
        this.createKeyboard();
        this.createMousePad();
        this.createButtons();

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
        const frameGeometry = new THREE.BoxGeometry(3.5, 2, 0.1);
        const frameMaterial = new THREE.MeshStandardMaterial({
            color: 0x0a0a0a,
            roughness: 0.2,
            metalness: 0.8
        });
        const frame = new THREE.Mesh(frameGeometry, frameMaterial);
        frame.position.set(0, 3.5, 0);
        frame.castShadow = true;
        monitorGroup.add(frame);

        // Screen (canvas pour afficher du texte)
        const screenGeometry = new THREE.PlaneGeometry(3.3, 1.85);

        // Create canvas texture
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 576;
        const ctx = canvas.getContext('2d');

        // Initial screen content
        this.updateScreenContent(ctx, this.currentProject);

        const screenTexture = new THREE.CanvasTexture(canvas);
        const screenMaterial = new THREE.MeshBasicMaterial({
            map: screenTexture,
            emissive: 0x4488ff,
            emissiveIntensity: 0.2
        });

        const screen = new THREE.Mesh(screenGeometry, screenMaterial);
        screen.position.set(0, 3.5, 0.06);
        monitorGroup.add(screen);

        this.screenMesh = screen;
        this.screenTexture = screenTexture;
        this.screenCanvas = canvas;
        this.screenCtx = ctx;

        monitorGroup.position.z = -0.5;
        this.scene.add(monitorGroup);
        this.monitor = monitorGroup;
    }

    updateScreenContent(ctx, projectKey) {
        const project = this.projects[projectKey];

        // Background gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, 576);
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(1, '#0f0f1e');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 1024, 576);

        // Title
        ctx.fillStyle = '#00ffff';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(project.title, 512, 80);

        // Underline
        ctx.strokeStyle = '#ff00ff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(200, 100);
        ctx.lineTo(824, 100);
        ctx.stroke();

        // Content
        ctx.fillStyle = '#ffffff';
        ctx.font = '32px Courier New';
        ctx.textAlign = 'left';

        const lines = project.content.split('\n');
        let y = 180;
        lines.forEach(line => {
            if (line.startsWith('•')) {
                ctx.fillStyle = '#ff00ff';
                ctx.fillText('▸', 120, y);
                ctx.fillStyle = '#ffffff';
                ctx.fillText(line.substring(1), 170, y);
            } else {
                ctx.fillStyle = line.match(/^[A-Z\s:]+$/) ? '#00ffff' : '#ffffff';
                ctx.fillText(line, 120, y);
            }
            y += 45;
        });

        // Update texture
        if (this.screenTexture) {
            this.screenTexture.needsUpdate = true;
        }
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

    createButtons() {
        const buttonData = [
            { name: 'Présentation', project: 'presentation', x: -1.5, color: 0x00ff00 },
            { name: 'MT-Congés', project: 'mtconges', x: -0.5, color: 0xff00ff },
            { name: 'RFTG', project: 'rftg', x: 0.5, color: 0x00ffff },
            { name: 'Veille', project: 'veille', x: 1.5, color: 0xff0080 }
        ];

        buttonData.forEach(data => {
            const button = new THREE.Mesh(
                new THREE.BoxGeometry(0.3, 0.1, 0.2),
                new THREE.MeshStandardMaterial({
                    color: data.color,
                    emissive: data.color,
                    emissiveIntensity: 0.3,
                    roughness: 0.3,
                    metalness: 0.7
                })
            );
            button.position.set(data.x, 2.15, 1.3);
            button.castShadow = true;
            button.userData = {
                type: 'button',
                project: data.project,
                name: data.name,
                originalEmissive: 0.3
            };
            this.scene.add(button);
            this.clickableObjects.push(button);
        });
    }

    onMouseMove(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.clickableObjects);

        // Reset all buttons
        this.clickableObjects.forEach(obj => {
            obj.material.emissiveIntensity = obj.userData.originalEmissive;
            obj.scale.set(1, 1, 1);
        });

        // Highlight hovered button
        if (intersects.length > 0) {
            const obj = intersects[0].object;
            obj.material.emissiveIntensity = 0.8;
            obj.scale.set(1.1, 1.1, 1.1);
            document.body.style.cursor = 'pointer';
        } else {
            document.body.style.cursor = 'default';
        }
    }

    onClick(event) {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.clickableObjects);

        if (intersects.length > 0) {
            const obj = intersects[0].object;
            if (obj.userData.type === 'button') {
                this.currentProject = obj.userData.project;
                this.updateScreenContent(this.screenCtx, this.currentProject);

                // Click animation
                obj.scale.set(0.9, 0.9, 0.9);
                setTimeout(() => obj.scale.set(1, 1, 1), 100);
            }
        }
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
