'use strict';

/**
 * Classe para representar uma rota planejada
 */
export class PlannedRoute {
    date = new Date();
    id = (Date.now() + '').slice(-10);
    type = 'planned-route';

    constructor(name, waypoints = []) {
        this.name = name;
        this.waypoints = waypoints; // Array de [lat, lng]
        this.distance = 0; // km
        this.estimatedDuration = 0; // min
        this.elevationGain = 0; // m
        this.routeCoordinates = []; // Coordenadas da rota calculada
        this.instructions = []; // Instruções de navegação
        this.isCompleted = false;
        this._setDescription();
    }

    /**
     * Define descrição da rota
     */
    _setDescription() {
        const months = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];
        
        this.description = `${this.name} - Criada em ${this.date.getDate()} de ${months[this.date.getMonth()]}`;
    }

    /**
     * Adiciona um waypoint à rota
     * @param {Array} coords - [lat, lng]
     */
    addWaypoint(coords) {
        this.waypoints.push(coords);
    }

    /**
     * Remove um waypoint da rota
     * @param {number} index - Índice do waypoint
     */
    removeWaypoint(index) {
        if (index >= 0 && index < this.waypoints.length) {
            this.waypoints.splice(index, 1);
        }
    }

    /**
     * Atualiza dados calculados da rota
     * @param {Object} routeData - Dados da rota calculada
     */
    updateRouteData(routeData) {
        this.distance = routeData.distance || 0;
        this.estimatedDuration = routeData.duration || 0;
        this.elevationGain = routeData.elevation || 0;
        this.routeCoordinates = routeData.coordinates || [];
        this.instructions = routeData.instructions || [];
    }

    /**
     * Calcula duração estimada baseada no tipo de exercício
     * @param {string} exerciseType - 'running', 'cycling', 'walking'
     * @returns {number} Duração em minutos
     */
    calculateEstimatedDuration(exerciseType = 'running') {
        const speeds = {
            running: 10, // km/h
            cycling: 20, // km/h
            walking: 5   // km/h
        };

        const speed = speeds[exerciseType] || speeds.running;
        return (this.distance / speed) * 60; // minutos
    }

    /**
     * Marca rota como completada
     * @param {Object} workoutData - Dados do exercício realizado
     */
    markAsCompleted(workoutData) {
        this.isCompleted = true;
        this.completedDate = new Date();
        this.actualWorkout = workoutData;
    }

    /**
     * Verifica se a rota é válida (tem pelo menos 2 pontos)
     * @returns {boolean}
     */
    isValid() {
        return this.waypoints.length >= 2;
    }

    /**
     * Obtém estatísticas da rota
     * @returns {Object}
     */
    getStats() {
        return {
            waypoints: this.waypoints.length,
            distance: this.distance,
            estimatedDuration: this.estimatedDuration,
            elevationGain: this.elevationGain,
            isCompleted: this.isCompleted,
            difficulty: this.getDifficulty()
        };
    }

    /**
     * Calcula dificuldade da rota baseada em distância e elevação
     * @returns {string}
     */
    getDifficulty() {
        const distanceScore = this.distance / 10; // cada 10km = 1 ponto
        const elevationScore = this.elevationGain / 100; // cada 100m = 1 ponto
        const totalScore = distanceScore + elevationScore;

        if (totalScore < 1) return 'Fácil';
        if (totalScore < 3) return 'Moderada';
        if (totalScore < 5) return 'Difícil';
        return 'Muito Difícil';
    }

    /**
     * Converte para objeto para serialização
     * @returns {Object}
     */
    toJSON() {
        return {
            id: this.id,
            type: this.type,
            name: this.name,
            description: this.description,
            date: this.date,
            waypoints: this.waypoints,
            distance: this.distance,
            estimatedDuration: this.estimatedDuration,
            elevationGain: this.elevationGain,
            routeCoordinates: this.routeCoordinates,
            instructions: this.instructions,
            isCompleted: this.isCompleted,
            completedDate: this.completedDate,
            actualWorkout: this.actualWorkout
        };
    }

    /**
     * Cria instância a partir de objeto serializado
     * @param {Object} data - Dados serializados
     * @returns {PlannedRoute}
     */
    static fromJSON(data) {
        const route = new PlannedRoute(data.name, data.waypoints);
        route.id = data.id;
        route.date = new Date(data.date);
        route.description = data.description;
        route.distance = data.distance || 0;
        route.estimatedDuration = data.estimatedDuration || 0;
        route.elevationGain = data.elevationGain || 0;
        route.routeCoordinates = data.routeCoordinates || [];
        route.instructions = data.instructions || [];
        route.isCompleted = data.isCompleted || false;
        route.completedDate = data.completedDate ? new Date(data.completedDate) : null;
        route.actualWorkout = data.actualWorkout || null;
        return route;
    }
}