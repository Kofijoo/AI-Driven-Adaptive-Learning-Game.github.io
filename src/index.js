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
            this.learningFramework = new LearningFramework();
            this.assessmentEngine = new AssessmentEngine();
            
            this.sessionData = {
                startTime: Date.now(),
                interactions: 0,
                correct: 0,
                timeSpent: 0
            };
            
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
        
        // Initialize learning systems
        this.initializeLearningFramework();
        
        // Initialize character system
        this.characterManager = new CharacterManager(this.scene, this.aiService, this.assessmentEngine);
        this.characterManager.init();
        
        console.log('Virtual Reality Platform initialized with learning framework');
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
    
    initializeLearningFramework() {
        // ADDIE: Analyze phase - assume 4-7 year old learner
        this.learningFramework.analyzeLearner(6, ['science', 'exploration']);
        
        // Design learning objectives
        const objectives = this.learningFramework.designObjectives();
        console.log('Learning objectives:', objectives);
        
        // Track session start for Kirkpatrick Level 1 (Reaction)
        this.sessionData.startTime = Date.now();
    }
    
    trackLearningInteraction(action, context) {
        // Update session data
        this.sessionData.interactions++;
        this.sessionData.timeSpent = (Date.now() - this.sessionData.startTime) / 1000;
        
        // Formative assessment
        const assessment = this.assessmentEngine.assessFormative(action, context);
        
        // Kirkpatrick Level 3: Behavior tracking
        this.learningFramework.trackBehavior(action, context);
        
        console.log('Learning interaction tracked:', assessment);
        return assessment;
    }
    
    endLearningSession() {
        // Summative assessment
        const finalAssessment = this.assessmentEngine.assessSummative(this.sessionData);
        
        // Kirkpatrick Level 1: Record reaction (simulate positive engagement)
        this.learningFramework.recordReaction(8, 9); // satisfaction, engagement out of 10
        
        // Kirkpatrick Level 2: Learning assessment (simulate improvement)
        const learningGain = this.learningFramework.assessLearning(5, 8); // pre/post scores
        
        // Generate progress report
        const report = this.assessmentEngine.getProgressReport();
        console.log('Learning session complete:', { finalAssessment, learningGain, report });
        
        return { finalAssessment, learningGain, report };
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

// Make functions globally available
window.setApiKey = setApiKey;
window.endSession = () => {
    if (window.app) {
        return window.app.endLearningSession();
    }
};

// App will be initialized by HTML script