// Scene 3D - Setup Gamer Hyte Y70 Style
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { EffectComposer } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/postprocessing/UnrealBloomPass.js';

class GamerSetup3D {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.composer = null;
        this.pcCase = null;
        this.rgbLights = [];
        this.particles = [];
        this.codeMatrix = [];
        this.time = 0;

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

        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;

        // Ajouter le canvas au body en arrière-plan
        this.renderer.domElement.style.position = 'fixed';
        this.renderer.domElement.style.top = '0';
        this.renderer.domElement.style.left = '0';
        this.renderer.domElement.style.zIndex = '-1';
        document.body.prepend(this.renderer.domElement);

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

        // Animation loop
        this.animate();
    }

    setupPostProcessing() {
        this.composer = new EffectComposer(this.renderer);

        const renderPass = new RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);

        const bloomPass = new UnrealBloomPass(
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

        // GPU - Carte graphique avec RGB
        const gpuGeometry = new THREE.BoxGeometry(1.5, 0.3, 0.8);
        const gpuMaterial = new THREE.MeshStandardMaterial({
            color: 0x202020,
            metalness: 0.8,
            roughness: 0.2,
            emissive: 0xff00ff,
            emissiveIntensity: 0.5
        });
        const gpu = new THREE.Mesh(gpuGeometry, gpuMaterial);
        gpu.position.set(0, -0.5, 0);
        gpu.rotation.y = Math.PI / 8;
        group.add(gpu);

        // LED strips RGB
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
        }

        // Fans RGB (3 ventilateurs)
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

    onMouseMove(event) {
        const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

        // Parallax effect
        if (this.pcCase) {
            this.pcCase.rotation.y = mouseX * 0.3;
            this.pcCase.rotation.x = mouseY * 0.1;
        }
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

        // Rotation douce du boîtier PC
        if (this.pcCase) {
            this.pcCase.rotation.y = Math.sin(this.time * 0.3) * 0.2;
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
