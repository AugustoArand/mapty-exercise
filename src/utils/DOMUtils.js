'use strict';

/**
 * Seletores DOM centralizados
 */
export const DOMSelectors = {
    form: '.form',
    containerWorkouts: '.workouts',
    inputType: '.form__input--type',
    inputDistance: '.form__input--distance',
    inputDuration: '.form__input--duration',
    inputCadence: '.form__input--cadence',
    inputElevation: '.form__input--elevation',
    formRow: '.form__row',
    hiddenFormRow: '.form__row--hidden'
};

/**
 * Utilitários para manipulação do DOM
 */
export class DOMUtils {
    /**
     * Obtém elemento do DOM
     * @param {string} selector - Seletor CSS
     * @returns {Element|null}
     */
    static getElement(selector) {
        return document.querySelector(selector);
    }

    /**
     * Obtém todos os elementos do DOM
     * @param {string} selector - Seletor CSS
     * @returns {NodeList}
     */
    static getAllElements(selector) {
        return document.querySelectorAll(selector);
    }

    /**
     * Limpa valores de inputs
     * @param {...Element} inputs - Elementos input para limpar
     */
    static clearInputs(...inputs) {
        inputs.forEach(input => {
            if (input) input.value = '';
        });
    }
}