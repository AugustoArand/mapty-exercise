'use strict';

/**
 * Serviço para gerenciar armazenamento local
 */
export class StorageService {
    static STORAGE_KEY = 'mapty_workouts';
    static ROUTES_STORAGE_KEY = 'mapty_planned_routes';

    /**
     * Salva workouts no localStorage
     * @param {Array} workouts - Array de exercícios
     */
    static saveWorkouts(workouts) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(workouts));
        } catch (error) {
            console.error('Error saving workouts to localStorage:', error);
        }
    }

    /**
     * Carrega workouts do localStorage
     * @returns {Array} Array de exercícios ou array vazio
     */
    static loadWorkouts() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error loading workouts from localStorage:', error);
            return [];
        }
    }

    /**
     * Remove todos os workouts do localStorage
     */
    static clearWorkouts() {
        try {
            localStorage.removeItem(this.STORAGE_KEY);
        } catch (error) {
            console.error('Error clearing workouts from localStorage:', error);
        }
    }

    // ====================== MÉTODOS PARA ROTAS PLANEJADAS ======================

    /**
     * Salva rotas planejadas no localStorage
     * @param {Array} routes - Array de rotas planejadas
     */
    static savePlannedRoutes(routes) {
        try {
            const routesData = routes.map(route => route.toJSON());
            localStorage.setItem(this.ROUTES_STORAGE_KEY, JSON.stringify(routesData));
        } catch (error) {
            console.error('Error saving planned routes to localStorage:', error);
        }
    }

    /**
     * Carrega rotas planejadas do localStorage
     * @returns {Array} Array de rotas planejadas ou array vazio
     */
    static loadPlannedRoutes() {
        try {
            const data = localStorage.getItem(this.ROUTES_STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error loading planned routes from localStorage:', error);
            return [];
        }
    }

    /**
     * Remove todas as rotas planejadas do localStorage
     */
    static clearPlannedRoutes() {
        try {
            localStorage.removeItem(this.ROUTES_STORAGE_KEY);
        } catch (error) {
            console.error('Error clearing planned routes from localStorage:', error);
        }
    }

    /**
     * Remove todos os dados do localStorage
     */
    static clearAllData() {
        this.clearWorkouts();
        this.clearPlannedRoutes();
    }
}