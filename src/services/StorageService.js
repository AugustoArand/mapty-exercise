'use strict';

/**
 * Serviço para gerenciar armazenamento local
 */
export class StorageService {
    static STORAGE_KEY = 'mapty_workouts';

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
}