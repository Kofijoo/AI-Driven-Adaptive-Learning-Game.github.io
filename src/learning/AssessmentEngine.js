class AssessmentEngine {
    constructor() {
        this.assessments = [];
        this.learningProgress = {};
        this.adaptiveRules = {
            difficulty: 'medium',
            scaffolding: 'moderate',
            feedback: 'immediate'
        };
    }
    
    // Formative assessment during interaction
    assessFormative(learnerAction, context) {
        const assessment = {
            type: 'formative',
            action: learnerAction,
            context: context,
            timestamp: Date.now(),
            competency: this.evaluateCompetency(learnerAction),
            nextSteps: this.recommendNextSteps(learnerAction)
        };
        
        this.assessments.push(assessment);
        this.updateProgress(assessment);
        return assessment;
    }
    
    // Summative assessment at session end
    assessSummative(sessionData) {
        const totalInteractions = sessionData.interactions || 0;
        const correctResponses = sessionData.correct || 0;
        const engagementTime = sessionData.timeSpent || 0;
        
        const score = this.calculateScore(totalInteractions, correctResponses, engagementTime);
        
        const assessment = {
            type: 'summative',
            score: score,
            mastery: score >= 70 ? 'achieved' : 'developing',
            recommendations: this.generateRecommendations(score),
            timestamp: Date.now()
        };
        
        this.assessments.push(assessment);
        return assessment;
    }
    
    evaluateCompetency(action) {
        const competencyMap = {
            'character_click': 'engagement',
            'question_ask': 'inquiry',
            'concept_explain': 'understanding',
            'problem_solve': 'application'
        };
        
        return competencyMap[action] || 'participation';
    }
    
    calculateScore(total, correct, time) {
        const accuracy = total > 0 ? (correct / total) * 100 : 0;
        const engagement = Math.min(time / 300, 1) * 100; // 5 min optimal
        return Math.round((accuracy * 0.7) + (engagement * 0.3));
    }
    
    recommendNextSteps(action) {
        const recommendations = {
            'character_click': ['Try asking questions', 'Explore different characters'],
            'question_ask': ['Listen to responses', 'Ask follow-up questions'],
            'concept_explain': ['Apply to new situations', 'Teach others'],
            'problem_solve': ['Try harder challenges', 'Help others solve problems']
        };
        
        return recommendations[action] || ['Continue exploring'];
    }
    
    updateProgress(assessment) {
        const competency = assessment.competency;
        if (!this.learningProgress[competency]) {
            this.learningProgress[competency] = { count: 0, level: 'novice' };
        }
        
        this.learningProgress[competency].count++;
        this.learningProgress[competency].level = this.determineLevel(
            this.learningProgress[competency].count
        );
    }
    
    determineLevel(count) {
        if (count >= 10) return 'expert';
        if (count >= 5) return 'proficient';
        if (count >= 2) return 'developing';
        return 'novice';
    }
    
    generateRecommendations(score) {
        if (score >= 80) return ['Excellent work! Try advanced challenges'];
        if (score >= 60) return ['Good progress! Practice more interactions'];
        return ['Keep exploring! Ask characters more questions'];
    }
    
    adaptDifficulty(performance) {
        if (performance < 50) {
            this.adaptiveRules.difficulty = 'easy';
            this.adaptiveRules.scaffolding = 'high';
        } else if (performance > 80) {
            this.adaptiveRules.difficulty = 'hard';
            this.adaptiveRules.scaffolding = 'low';
        }
        
        return this.adaptiveRules;
    }
    
    getProgressReport() {
        return {
            assessments: this.assessments,
            progress: this.learningProgress,
            adaptiveSettings: this.adaptiveRules,
            summary: this.generateSummary()
        };
    }
    
    generateSummary() {
        const totalAssessments = this.assessments.length;
        const avgScore = this.assessments.reduce((sum, a) => sum + (a.score || 0), 0) / totalAssessments;
        
        return {
            totalAssessments,
            averageScore: Math.round(avgScore),
            competenciesTracked: Object.keys(this.learningProgress).length,
            overallLevel: avgScore >= 80 ? 'proficient' : avgScore >= 60 ? 'developing' : 'novice'
        };
    }
}