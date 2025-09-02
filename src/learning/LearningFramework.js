class LearningFramework {
    constructor() {
        this.learnerProfile = null;
        this.kirkpatrickData = {
            reaction: { satisfaction: 0, engagement: 0 },
            learning: { preTest: 0, postTest: 0 },
            behavior: [],
            results: []
        };
    }
    
    // ADDIE: Analyze learner needs
    analyzeLearner(age, interests) {
        this.learnerProfile = {
            age: age,
            interests: interests,
            cognitiveLoad: age <= 7 ? 'low' : 'medium',
            learningStyle: age <= 7 ? 'kinesthetic-visual' : 'mixed'
        };
        return this.learnerProfile;
    }
    
    // ADDIE: Design learning objectives
    designObjectives() {
        if (!this.learnerProfile) return [];
        
        return [
            'Observe science phenomena through VR interaction',
            'Identify cause-effect relationships',
            'Apply learning through character conversations'
        ];
    }
    
    // SAM: Rapid prototyping with feedback
    iterateDesign(userFeedback) {
        const adjustments = [];
        
        if (userFeedback.difficulty === 'too_hard') {
            adjustments.push('reduce_complexity');
        }
        if (userFeedback.engagement === 'low') {
            adjustments.push('add_interactivity');
        }
        
        return adjustments;
    }
    
    // Kirkpatrick Level 1: Reaction
    recordReaction(satisfaction, engagement) {
        this.kirkpatrickData.reaction = { satisfaction, engagement };
    }
    
    // Kirkpatrick Level 2: Learning
    assessLearning(preScore, postScore) {
        this.kirkpatrickData.learning = { preTest: preScore, postTest: postScore };
        return postScore - preScore; // Learning gain
    }
    
    // Kirkpatrick Level 3: Behavior
    trackBehavior(action, context) {
        this.kirkpatrickData.behavior.push({
            action: action,
            context: context,
            timestamp: Date.now()
        });
    }
    
    // Kirkpatrick Level 4: Results
    measureResults(outcome) {
        this.kirkpatrickData.results.push({
            outcome: outcome,
            timestamp: Date.now()
        });
    }
    
    getAnalytics() {
        return {
            learnerProfile: this.learnerProfile,
            kirkpatrick: this.kirkpatrickData,
            recommendations: this.generateRecommendations()
        };
    }
    
    generateRecommendations() {
        const recs = [];
        
        if (this.kirkpatrickData.reaction.engagement < 7) {
            recs.push('Increase interactive elements');
        }
        
        if (this.kirkpatrickData.learning.postTest - this.kirkpatrickData.learning.preTest < 2) {
            recs.push('Provide more scaffolding');
        }
        
        return recs;
    }
}