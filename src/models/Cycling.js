'use strict';

import { Workout } from './Workout.js';

/**
 * Classe para exercícios de ciclismo
 */
export class Cycling extends Workout {
    type = 'cycling';

    constructor(coords, distance, duration, elevation) {
        super(coords, distance, duration);
        this.elevation = elevation;
        this.calcSpeed();
        this._setDescription();
    }

    /**
     * Calcula a velocidade em km/h
     * @returns {number} Velocidade em quilômetros por hora
     */
    calcSpeed() {
        this.speed = this.distance / (this.duration / 60);
        return this.speed;
    }
}