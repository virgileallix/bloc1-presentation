// Scene 3D - Setup Gamer Hyte Y70 Style (Full Immersive)
class GamerSetup3D {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.composer = null;
        this.pcCase = null;
        this.rgbLights = [];
        this.particles = [];
        this.codeMatrix = [];
        this.time = 0;

        // Interactive elements
        this.interactiveObjects = [];
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.hoveredObject = null;
        this.monitors = [];
        this.folderIcons = [];

        this.init();
    }

    init() {
        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0a0a0f);
        this.scene.fog = new THREE.FogExp2(0x0a0a0f, 0.015);

        // Camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 2, 8);
        this.camera.lookAt(0, 0, 0);

        // Renderer - plein écran
        const canvas = document.getElementById('scene3d');
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: false
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;

        // OrbitControls pour zoom et rotation
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.minDistance = 3;
        this.controls.maxDistance = 15;
        this.controls.maxPolarAngle = Math.PI / 1.5;
        this.controls.enablePan = false;
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = 0.5;

        // Post-processing pour le bloom RGB
        this.setupPostProcessing();

        // Créer les éléments de la scène
        this.createLights();
        this.createPCCase();
        this.createCodeMatrix();
        this.createParticles();
        this.createFloor();

        // Event listeners
        window.addEventListener('resize', () => this.onWindowResize());
        document.addEventListener('mousemove', (e) => this.onMouseMove(e));
        document.addEventListener('click', (e) => this.onClick(e));

        // Create interactive elements
        this.createMonitors();
        this.createFolderIcons();

        // Animation loop
        this.animate();
    }

    setupPostProcessing() {
        this.composer = new THREE.EffectComposer(this.renderer);

        const renderPass = new THREE.RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);

        const bloomPass = new THREE.UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            1.5, // strength
            0.4, // radius
            0.85 // threshold
        );
        this.composer.addPass(bloomPass);
    }

    createLights() {
        // Ambient light
        const ambient = new THREE.AmbientLight(0x404040, 0.5);
        this.scene.add(ambient);

        // RGB spot lights pour effet Hyte Y70
        const colors = [
            { color: 0xff00ff, pos: [-3, 3, 2] },  // Magenta
            { color: 0x00ffff, pos: [3, 3, 2] },   // Cyan
            { color: 0xff0080, pos: [0, 5, -2] }   // Pink
        ];

        colors.forEach(({ color, pos }) => {
            const light = new THREE.SpotLight(color, 2);
            light.position.set(...pos);
            light.angle = Math.PI / 6;
            light.penumbra = 0.5;
            light.decay = 2;
            light.distance = 20;
            this.scene.add(light);
            this.rgbLights.push(light);
        });
    }

    createPCCase() {
        const group = new THREE.Group();

        // Boîtier principal (style Hyte Y70 - transparent)
        const caseGeometry = new THREE.BoxGeometry(2, 3.5, 2);
        const caseMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x1a1a1a,
            metalness: 0.9,
            roughness: 0.1,
            transparent: true,
            opacity: 0.3,
            transmission: 0.95,
            thickness: 0.5
        });
        const caseMain = new THREE.Mesh(caseGeometry, caseMaterial);
        group.add(caseMain);

        // Panneau de verre avant (signature Hyte Y70)
        const glassGeometry = new THREE.PlaneGeometry(2, 3.5);
        const glassMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x88ccff,
            metalness: 0.1,
            roughness: 0.05,
            transparent: true,
            opacity: 0.15,
            transmission: 0.98,
            clearcoat: 1,
            clearcoatRoughness: 0.1
        });
        const glass = new THREE.Mesh(glassGeometry, glassMaterial);
        glass.position.z = 1.01;
        group.add(glass);

        // === COMPOSANTS CLIQUABLES ===

        // GPU - Carte graphique (PROJET 1 - MT-Congés)
        const gpuGroup = new THREE.Group();
        const gpuGeometry = new THREE.BoxGeometry(1.5, 0.3, 0.8);
        const gpuMaterial = new THREE.MeshStandardMaterial({
            color: 0x202020,
            metalness: 0.8,
            roughness: 0.2,
            emissive: 0xff00ff,
            emissiveIntensity: 0.5
        });
        const gpu = new THREE.Mesh(gpuGeometry, gpuMaterial);
        gpuGroup.add(gpu);

        // GPU label
        const gpuLabelGeometry = new THREE.PlaneGeometry(1.2, 0.2);
        const gpuLabelMaterial = new THREE.MeshBasicMaterial({
            color: 0xff00ff,
            transparent: true,
            opacity: 0.8
        });
        const gpuLabel = new THREE.Mesh(gpuLabelGeometry, gpuLabelMaterial);
        gpuLabel.position.y = 0.3;
        gpuLabel.position.z = 0.5;
        gpuGroup.add(gpuLabel);

        gpuGroup.position.set(0, -0.5, 0);
        gpuGroup.rotation.y = Math.PI / 8;
        gpuGroup.userData = {
            section: 'mtconges',
            name: 'GPU - Projet 1',
            description: 'MT-Congés',
            isInteractive: true,
            component: 'gpu',
            originalColor: 0xff00ff,
            originalEmissive: 0.5
        };
        group.add(gpuGroup);
        this.interactiveObjects.push(gpuGroup);
        this.createComponentTooltip(gpuGroup, 'PROJET 1', 'MT-Congés', 0xff00ff);

        // CPU - Processeur (PRÉSENTATION)
        const cpuGroup = new THREE.Group();
        const cpuGeometry = new THREE.BoxGeometry(0.6, 0.1, 0.6);
        const cpuMaterial = new THREE.MeshStandardMaterial({
            color: 0x303030,
            metalness: 0.9,
            roughness: 0.1,
            emissive: 0x00ff00,
            emissiveIntensity: 0.5
        });
        const cpu = new THREE.Mesh(cpuGeometry, cpuMaterial);
        cpuGroup.add(cpu);

        cpuGroup.position.set(0, 0.8, 0);
        cpuGroup.userData = {
            section: 'presentation',
            name: 'CPU - Présentation',
            description: 'Qui suis-je ?',
            isInteractive: true,
            component: 'cpu',
            originalColor: 0x00ff00,
            originalEmissive: 0.5
        };
        group.add(cpuGroup);
        this.interactiveObjects.push(cpuGroup);
        this.createComponentTooltip(cpuGroup, 'PRÉSENTATION', 'Virgile Allix', 0x00ff00);

        // RAM - Mémoire (PROJET 2 - RFTG)
        for (let i = 0; i < 2; i++) {
            const ramGroup = new THREE.Group();
            const ramGeometry = new THREE.BoxGeometry(0.2, 1, 0.05);
            const ramMaterial = new THREE.MeshStandardMaterial({
                color: 0x1a1a1a,
                metalness: 0.8,
                roughness: 0.2,
                emissive: 0x00ffff,
                emissiveIntensity: 0.5
            });
            const ram = new THREE.Mesh(ramGeometry, ramMaterial);
            ramGroup.add(ram);

            ramGroup.position.set(-0.5 + i * 0.3, 0.3, 0.3);

            if (i === 0) { // Seulement le premier module est cliquable
                ramGroup.userData = {
                    section: 'projet2',
                    name: 'RAM - Projet 2',
                    description: 'RFTG',
                    isInteractive: true,
                    component: 'ram',
                    originalColor: 0x00ffff,
                    originalEmissive: 0.5
                };
                this.interactiveObjects.push(ramGroup);
                this.createComponentTooltip(ramGroup, 'PROJET 2', 'RFTG', 0x00ffff);
            }

            group.add(ramGroup);
        }

        // SSD - Stockage (VEILLE TECHNOLOGIQUE)
        const ssdGroup = new THREE.Group();
        const ssdGeometry = new THREE.BoxGeometry(0.8, 0.1, 0.5);
        const ssdMaterial = new THREE.MeshStandardMaterial({
            color: 0x202020,
            metalness: 0.7,
            roughness: 0.3,
            emissive: 0xff0080,
            emissiveIntensity: 0.5
        });
        const ssd = new THREE.Mesh(ssdGeometry, ssdMaterial);
        ssdGroup.add(ssd);

        ssdGroup.position.set(0, -1.2, 0.5);
        ssdGroup.userData = {
            section: 'veille',
            name: 'SSD - Veille',
            description: 'Veille Technologique',
            isInteractive: true,
            component: 'ssd',
            originalColor: 0xff0080,
            originalEmissive: 0.5
        };
        group.add(ssdGroup);
        this.interactiveObjects.push(ssdGroup);
        this.createComponentTooltip(ssdGroup, 'VEILLE TECH', 'IA & Cybersécurité', 0xff0080);

        // LED strips RGB (décoratifs)
        for (let i = 0; i < 4; i++) {
            const ledGeometry = new THREE.CylinderGeometry(0.02, 0.02, 3, 8);
            const ledColor = [0xff00ff, 0x00ffff, 0xff0080, 0x00ff00][i];
            const ledMaterial = new THREE.MeshBasicMaterial({
                color: ledColor,
                transparent: true,
                opacity: 0.8
            });
            const led = new THREE.Mesh(ledGeometry, ledMaterial);

            const angle = (i / 4) * Math.PI * 2;
            led.position.x = Math.cos(angle) * 0.9;
            led.position.z = Math.sin(angle) * 0.9;
            group.add(led);
            this.rgbLights.push(led);
        }

        // Fans RGB (3 ventilateurs décoratifs)
        for (let i = 0; i < 3; i++) {
            const fanGroup = new THREE.Group();

            // Fan blades
            for (let j = 0; j < 3; j++) {
                const bladeGeometry = new THREE.BoxGeometry(0.4, 0.05, 0.1);
                const bladeMaterial = new THREE.MeshStandardMaterial({
                    color: 0x303030,
                    metalness: 0.7,
                    roughness: 0.3
                });
                const blade = new THREE.Mesh(bladeGeometry, bladeMaterial);
                blade.rotation.z = (j / 3) * Math.PI * 2;
                fanGroup.add(blade);
            }

            // RGB ring
            const ringGeometry = new THREE.TorusGeometry(0.3, 0.02, 8, 32);
            const ringColor = [0xff00ff, 0x00ffff, 0xff0080][i];
            const ringMaterial = new THREE.MeshBasicMaterial({
                color: ringColor,
                transparent: true,
                opacity: 0.9
            });
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            fanGroup.add(ring);

            fanGroup.position.y = 1 - i * 0.8;
            fanGroup.position.z = 0.95;
            fanGroup.userData.rotationSpeed = 0.05 + i * 0.02;
            group.add(fanGroup);
            this.rgbLights.push(fanGroup);
        }

        group.position.y = 0;
        this.scene.add(group);
        this.pcCase = group;
    }

    createComponentTooltip(component, title, subtitle, color) {
        const labelDiv = document.createElement('div');
        labelDiv.className = 'component-tooltip';
        labelDiv.innerHTML = `
            <div class="tooltip-title">${title}</div>
            <div class="tooltip-subtitle">${subtitle}</div>
            <div class="tooltip-hint">Cliquer pour voir</div>
        `;
        labelDiv.style.cssText = `
            position: absolute;
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(10px);
            border: 2px solid #${color.toString(16).padStart(6, '0')};
            border-radius: 8px;
            padding: 10px 15px;
            color: #${color.toString(16).padStart(6, '0')};
            font-family: 'Courier New', monospace;
            font-weight: bold;
            text-align: center;
            pointer-events: none;
            text-shadow: 0 0 10px #${color.toString(16).padStart(6, '0')};
            box-shadow: 0 0 20px rgba(${parseInt(color.toString(16).substr(0,2), 16)}, ${parseInt(color.toString(16).substr(2,2), 16)}, ${parseInt(color.toString(16).substr(4,2), 16)}, 0.5);
            z-index: 1000;
            display: none;
        `;

        const titleDiv = labelDiv.querySelector('.tooltip-title');
        titleDiv.style.cssText = 'font-size: 16px; margin-bottom: 4px;';

        const subtitleDiv = labelDiv.querySelector('.tooltip-subtitle');
        subtitleDiv.style.cssText = 'font-size: 12px; opacity: 0.8; margin-bottom: 6px;';

        const hintDiv = labelDiv.querySelector('.tooltip-hint');
        hintDiv.style.cssText = 'font-size: 10px; opacity: 0.6; font-style: italic;';

        document.body.appendChild(labelDiv);

        component.userData.tooltip = labelDiv;
        component.userData.updateTooltip = (show = false) => {
            if (!show) {
                labelDiv.style.display = 'none';
                return;
            }

            const vector = component.getWorldPosition(new THREE.Vector3());
            vector.project(this.camera);

            const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
            const y = (vector.y * -0.5 + 0.5) * window.innerHeight;

            labelDiv.style.left = (x - labelDiv.offsetWidth / 2) + 'px';
            labelDiv.style.top = (y - labelDiv.offsetHeight - 30) + 'px';
            labelDiv.style.display = vector.z < 1 ? 'block' : 'none';
        };
    }

    createCodeMatrix() {
        // Fond de code Matrix style
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*(){}[]<>/';
        const columns = 50;

        for (let i = 0; i < columns; i++) {
            const geometry = new THREE.PlaneGeometry(0.5, 0.5);
            const material = new THREE.MeshBasicMaterial({
                color: 0x00ff00,
                transparent: true,
                opacity: 0.3,
                side: THREE.DoubleSide
            });

            const char = new THREE.Mesh(geometry, material);
            char.position.x = (i - columns / 2) * 0.6;
            char.position.y = Math.random() * 20 - 10;
            char.position.z = -10 - Math.random() * 10;

            char.userData = {
                speed: 0.02 + Math.random() * 0.05,
                character: characters[Math.floor(Math.random() * characters.length)]
            };

            this.scene.add(char);
            this.codeMatrix.push(char);
        }
    }

    createParticles() {
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 1000;
        const positions = new Float32Array(particlesCount * 3);
        const colors = new Float32Array(particlesCount * 3);

        const rgbColors = [
            new THREE.Color(0xff00ff),
            new THREE.Color(0x00ffff),
            new THREE.Color(0xff0080)
        ];

        for (let i = 0; i < particlesCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 30;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 30;

            const color = rgbColors[Math.floor(Math.random() * rgbColors.length)];
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.05,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });

        const particles = new THREE.Points(particlesGeometry, particlesMaterial);
        this.scene.add(particles);
        this.particles.push(particles);
    }

    createFloor() {
        const floorGeometry = new THREE.PlaneGeometry(50, 50, 50, 50);
        const floorMaterial = new THREE.MeshStandardMaterial({
            color: 0x0a0a0f,
            metalness: 0.8,
            roughness: 0.2,
            wireframe: true,
            transparent: true,
            opacity: 0.2
        });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -2;
        this.scene.add(floor);
    }

    createMonitors() {
        // Moniteur principal - grand écran gaming
        const mainMonitor = this.createMonitor(5, 3, 'VIRGILE ALLIX\nBTS SIO SLAM', 0xff00ff);
        mainMonitor.position.set(-5, 2, -2);
        mainMonitor.rotation.y = Math.PI / 6;
        this.scene.add(mainMonitor);
        this.monitors.push(mainMonitor);
    }

    createMonitor(width, height, text, glowColor) {
        const group = new THREE.Group();

        // Frame du moniteur
        const frameGeometry = new THREE.BoxGeometry(width + 0.2, height + 0.2, 0.1);
        const frameMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a1a,
            metalness: 0.9,
            roughness: 0.1
        });
        const frame = new THREE.Mesh(frameGeometry, frameMaterial);
        frame.position.z = -0.05;
        group.add(frame);

        // Écran
        const screenGeometry = new THREE.PlaneGeometry(width, height);
        const screenMaterial = new THREE.MeshBasicMaterial({
            color: glowColor,
            transparent: true,
            opacity: 0.8
        });
        const screen = new THREE.Mesh(screenGeometry, screenMaterial);
        group.add(screen);

        // Support
        const standGeometry = new THREE.CylinderGeometry(0.1, 0.2, 1, 8);
        const standMaterial = new THREE.MeshStandardMaterial({
            color: 0x2a2a2a,
            metalness: 0.8,
            roughness: 0.2
        });
        const stand = new THREE.Mesh(standGeometry, standMaterial);
        stand.position.y = -height / 2 - 0.5;
        group.add(stand);

        return group;
    }

    createFolderIcons() {
        // Ne rien créer - on utilise les composants du PC directement
        // Les composants seront créés dans createPCCase()
    }

    createTextLabel(parent, title, subtitle, color) {
        // Create HTML label overlay
        const labelDiv = document.createElement('div');
        labelDiv.className = 'folder-label-3d';
        labelDiv.innerHTML = `
            <div class="folder-title">${title}</div>
            <div class="folder-subtitle">${subtitle}</div>
        `;
        labelDiv.style.cssText = `
            position: absolute;
            color: #${color.toString(16).padStart(6, '0')};
            font-family: 'Courier New', monospace;
            font-weight: bold;
            text-align: center;
            pointer-events: none;
            text-shadow: 0 0 10px #${color.toString(16).padStart(6, '0')};
            z-index: 100;
        `;

        const titleDiv = labelDiv.querySelector('.folder-title');
        titleDiv.style.cssText = 'font-size: 14px; margin-bottom: 2px;';

        const subtitleDiv = labelDiv.querySelector('.folder-subtitle');
        subtitleDiv.style.cssText = 'font-size: 10px; opacity: 0.8;';

        document.body.appendChild(labelDiv);

        parent.userData.label = labelDiv;
        parent.userData.updateLabel = () => {
            const vector = parent.position.clone();
            vector.y += 0.5; // Offset above the folder
            vector.project(this.camera);

            const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
            const y = (vector.y * -0.5 + 0.5) * window.innerHeight;

            labelDiv.style.left = x + 'px';
            labelDiv.style.top = y + 'px';
            labelDiv.style.opacity = vector.z < 1 ? '1' : '0';
        };
    }

    createFolderIcon(label, color) {
        const group = new THREE.Group();

        // Corps du dossier
        const bodyGeometry = new THREE.BoxGeometry(0.8, 0.6, 0.1);
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: color,
            metalness: 0.3,
            roughness: 0.7,
            transparent: true,
            opacity: 0.9
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        group.add(body);

        // Onglet du dossier
        const tabGeometry = new THREE.BoxGeometry(0.3, 0.1, 0.1);
        const tab = new THREE.Mesh(tabGeometry, bodyMaterial);
        tab.position.set(-0.2, 0.35, 0);
        group.add(tab);

        // Bordure lumineuse
        const edgesGeometry = new THREE.EdgesGeometry(bodyGeometry);
        const edgesMaterial = new THREE.LineBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.8
        });
        const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
        group.add(edges);

        // Glow effect
        const glowGeometry = new THREE.PlaneGeometry(1, 0.8);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.2,
            side: THREE.DoubleSide
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.position.z = -0.1;
        group.add(glow);

        group.userData.meshes = { body, edges, glow };

        return group;
    }

    onMouseMove(event) {
        // Update mouse position for raycasting
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // Raycasting for hover effects
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.interactiveObjects, true);

        // Reset previous hover
        if (this.hoveredObject) {
            this.resetObjectHover(this.hoveredObject);
            this.hoveredObject = null;
            document.body.style.cursor = 'default';
        }

        // Apply hover to new object
        if (intersects.length > 0) {
            let object = intersects[0].object;

            // Find the parent group if clicked on a child mesh
            while (object.parent && !object.userData.isInteractive) {
                object = object.parent;
            }

            if (object.userData.isInteractive) {
                this.hoveredObject = object;
                this.applyObjectHover(object);
                document.body.style.cursor = 'pointer';

                // Arrêter l'auto-rotation pendant le hover
                if (this.controls) {
                    this.controls.autoRotate = false;
                }
            }
        } else {
            // Reprendre l'auto-rotation quand pas de hover
            if (this.controls) {
                this.controls.autoRotate = true;
            }
        }
    }

    onClick(event) {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.interactiveObjects, true);

        if (intersects.length > 0) {
            let object = intersects[0].object;

            // Find the parent group
            while (object.parent && !object.userData.isInteractive) {
                object = object.parent;
            }

            if (object.userData.isInteractive && object.userData.section) {
                // Trigger click animation
                this.animateClick(object);

                // Navigate to section
                setTimeout(() => {
                    this.navigateToSection(object.userData.section);
                }, 300);
            }
        }
    }

    applyObjectHover(object) {
        // Scale up
        object.scale.set(1.15, 1.15, 1.15);

        // Brighten emissive for components
        object.traverse((child) => {
            if (child.isMesh && child.material.emissive) {
                child.material.emissiveIntensity = 1.5;
            }
        });

        // Show tooltip
        if (object.userData.updateTooltip) {
            object.userData.updateTooltip(true);
        }
    }

    resetObjectHover(object) {
        // Scale down
        object.scale.set(1, 1, 1);

        // Reset emissive
        object.traverse((child) => {
            if (child.isMesh && child.material.emissive) {
                child.material.emissiveIntensity = object.userData.originalEmissive || 0.5;
            }
        });

        // Hide tooltip
        if (object.userData.updateTooltip) {
            object.userData.updateTooltip(false);
        }
    }

    animateClick(object) {
        // Quick scale animation
        const originalScale = object.scale.clone();

        object.scale.set(0.8, 0.8, 0.8);

        // Play click sound effect (using Web Audio API)
        this.playClickSound();

        setTimeout(() => {
            object.scale.copy(originalScale);
        }, 150);
    }

    playClickSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = 800;
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (e) {
            // Fallback si Web Audio API non disponible
            console.log('Click sound not available');
        }
    }

    navigateToSection(sectionId) {
        // Pour l'instant, juste afficher une alerte
        // Plus tard, on pourra zoomer sur le composant ou afficher un overlay
        const sectionNames = {
            'presentation': 'Présentation Personnelle',
            'mtconges': 'Projet 1 : MT-Congés',
            'projet2': 'Projet 2 : RFTG',
            'veille': 'Veille Technologique'
        };

        alert(`Navigation vers: ${sectionNames[sectionId] || sectionId}\n\nEn cours de développement...`);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.composer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.time += 0.01;

        // Update controls
        if (this.controls) {
            this.controls.update();
        }

        // Animer les ventilateurs RGB
        this.rgbLights.forEach((fan, index) => {
            if (fan.userData.rotationSpeed) {
                fan.rotation.z += fan.userData.rotationSpeed;
            }

            // Pulse RGB effect
            if (fan.children) {
                fan.children.forEach(child => {
                    if (child.material && child.material.opacity !== undefined) {
                        child.material.opacity = 0.7 + Math.sin(this.time * 2 + index) * 0.3;
                    }
                });
            }
        });

        // Animer le code Matrix
        this.codeMatrix.forEach(char => {
            char.position.y -= char.userData.speed;
            if (char.position.y < -10) {
                char.position.y = 10;
            }
            char.material.opacity = 0.1 + Math.sin(this.time + char.position.y) * 0.1;
        });

        // Rotation des particules
        this.particles.forEach(particles => {
            particles.rotation.y = this.time * 0.1;
        });

        // Update tooltips for hovered component
        if (this.hoveredObject && this.hoveredObject.userData.updateTooltip) {
            this.hoveredObject.userData.updateTooltip(true);
        }

        // Render avec post-processing
        this.composer.render();
    }
}

// Initialiser la scène 3D quand le DOM est prêt
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new GamerSetup3D();
    });
} else {
    new GamerSetup3D();
}
