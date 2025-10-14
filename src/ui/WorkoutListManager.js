'use strict';

import { DOMSelectors, DOMUtils } from '../utils/DOMUtils.js';

/**
 * Gerenciador da lista de exercícios
 */
export class WorkoutListManager {
    #containerWorkouts;

    constructor() {
        this.#containerWorkouts = DOMUtils.getElement(DOMSelectors.containerWorkouts);
    }

    /**
     * Renderiza um exercício na lista
     * @param {Object} workout - Objeto do exercício
     */
    renderWorkout(workout) {
        const html = this.#generateWorkoutHTML(workout);
        const form = DOMUtils.getElement(DOMSelectors.form);
        
        if (form) {
            form.insertAdjacentHTML('afterend', html);
        }
    }

    /**
     * Gera HTML para um exercício
     * @param {Object} workout - Objeto do exercício
     * @returns {string} HTML do exercício
     */
    #generateWorkoutHTML(workout) {
        let html = `
        <li class="workout workout--${workout.type}" data-id="${workout.id}">
          <h2 class="workout__title">${workout.description}</h2>
          <div class="workout__details">
            <span class="workout__icon">${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'}</span>
            <span class="workout__value">${workout.distance}</span>
            <span class="workout__unit">km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${workout.duration}</span>
            <span class="workout__unit">min</span>
          </div>`;

        if (workout.type === 'running') {
            html += `
            <div class="workout__details">
              <span class="workout__icon">⚡️</span>
              <span class="workout__value">${workout.pace.toFixed(1)}</span>
              <span class="workout__unit">min/km</span>
            </div>
            <div class="workout__details">
              <span class="workout__icon">🦶🏼</span>
              <span class="workout__value">${workout.cadence}</span>
              <span class="workout__unit">spm</span>
            </div>
          </li>`;
        }

        if (workout.type === 'cycling') {
            html += `
            <div class="workout__details">
              <span class="workout__icon">⚡️</span>
              <span class="workout__value">${workout.speed.toFixed(1)}</span>
              <span class="workout__unit">km/h</span>
            </div>
            <div class="workout__details">
              <span class="workout__icon">⛰</span>
              <span class="workout__value">${workout.elevation}</span>
              <span class="workout__unit">m</span>
            </div>
          </li>`;
        }

        return html;
    }

    /**
     * Adiciona event listener para cliques na lista
     * @param {Function} callback - Função callback
     */
    onWorkoutClick(callback) {
        if (this.#containerWorkouts) {
            this.#containerWorkouts.addEventListener('click', callback);
        }
    }

    /**
     * Limpa toda a lista de exercícios
     */
    clearWorkoutsList() {
        const workouts = DOMUtils.getAllElements('.workout');
        workouts.forEach(workout => workout.remove());
    }
}