'use strict';

import { Workout } from './Workout.js';

/**
 * Classe para exercícios de corrida
 */
export class Running extends Workout {
    type = 'running';

    constructor(coords, distance, duration, cadence) {
        super(coords, distance, duration);
        this.cadence = cadence;
        this.calcPace();
        this._setDescription();
    }

    /**
     * Calcula o ritmo em min/km
     * @returns {number} Ritmo em minutos por quilômetro
     */
    calcPace() {
        this.pace = this.duration / this.distance;
        return this.pace;
    }
}