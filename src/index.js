class VirtualRealityApp {
    constructor() {
        try {
            this.canvas = document.getElementById('renderCanvas');
            this.engine = new BABYLON.Engine(this.canvas, true, {
                adaptToDeviceRatio: true,
                powerPreference: 'high-performance'
            });
            this.scene = null;
            this.characterManager = null;
            this.aiService = new AIService();
            
            this.init();
        } catch (error) {
            console.error('Initialization error:', error);
            this.showError('Failed to initialize application');
        }
    }

    async init() {
        await this.createScene();
        this.setupVR();
        this.startRenderLoop();
        
        // Initialize character system
        this.characterManager = new CharacterManager(this.scene, this.aiService);
        this.characterManager.init();
        
        console.log('Virtual Reality Platform initialized');
    }

    async createScene() {
        this.scene = new BABYLON.Scene(this.engine);
        
        // Camera
        const camera = new BABYLON.ArcRotateCamera('camera', -Math.PI / 2, Math.PI / 2.5, 10, BABYLON.Vector3.Zero(), this.scene);
        this.scene.activeCamera = camera;
        
        // Lighting
        const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), this.scene);
        light.intensity = 0.7;
        
        // Ground
        const ground = BABYLON.MeshBuilder.CreateGround('ground', { size: 20 }, this.scene);
        const groundMaterial = new BABYLON.StandardMaterial('groundMat', this.scene);
        groundMaterial.diffuseColor = new BABYLON.Color3(0.4, 0.8, 0.4);
        ground.material = groundMaterial;
    }

    async setupVR() {
        try {
            const xr = await BABYLON.WebXRDefaultExperience.CreateAsync(this.scene, {
                floorMeshes: [this.scene.getMeshByName('ground')],
                requiredFeatures: ['local-floor'],
                optionalFeatures: ['hand-tracking', 'hit-test']
            });
            
            this.updateStatus('VR Ready - Click Enter VR');
            console.log('WebXR initialized successfully');
        } catch (error) {
            console.error('WebXR error:', error);
            this.updateStatus('VR not available - Desktop mode active');
        }
    }

    startRenderLoop() {
        this.engine.runRenderLoop(() => {
            this.scene.render();
        });

        window.addEventListener('resize', () => {
            this.engine.resize();
        });
    }

    setApiKey(apiKey) {
        const success = this.aiService.setApiKey(apiKey);
        if (success) {
            this.showSuccess('API key configured successfully!');
        } else {
            this.showError('Invalid API key. Please check and try again.');
        }
    }
    
    updateStatus(message) {
        const statusEl = document.getElementById('vr-status');
        if (statusEl) statusEl.textContent = message;
    }
    
    showError(message) {
        const errorEl = document.getElementById('error-message');
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.style.display = 'block';
        }
    }
    
    showSuccess(message) {
        const successEl = document.getElementById('success-message');
        if (successEl) {
            successEl.textContent = message;
            successEl.style.display = 'block';
            setTimeout(() => successEl.style.display = 'none', 3000);
        }
    }
}

// Global function for UI
function setApiKey() {
    const apiKey = document.getElementById('api-key-input').value.trim();
    if (!apiKey) {
        window.app?.showError('Please enter an API key');
        return;
    }
    if (window.app) {
        window.app.setApiKey(apiKey);
    }
}

// Make function globally available
window.setApiKey = setApiKey;

// App will be initialized by HTML script