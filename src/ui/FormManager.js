'use strict';

import { DOMSelectors, DOMUtils } from '../utils/DOMUtils.js';

/**
 * Gerenciador do formulário de exercícios
 */
export class FormManager {
    #form;
    #inputType;
    #inputDistance;
    #inputDuration;
    #inputCadence;
    #inputElevation;

    constructor() {
        this.#initElements();
        this.#bindEvents();
    }

    /**
     * Inicializa elementos DOM
     */
    #initElements() {
        this.#form = DOMUtils.getElement(DOMSelectors.form);
        this.#inputType = DOMUtils.getElement(DOMSelectors.inputType);
        this.#inputDistance = DOMUtils.getElement(DOMSelectors.inputDistance);
        this.#inputDuration = DOMUtils.getElement(DOMSelectors.inputDuration);
        this.#inputCadence = DOMUtils.getElement(DOMSelectors.inputCadence);
        this.#inputElevation = DOMUtils.getElement(DOMSelectors.inputElevation);
    }

    /**
     * Vincula eventos aos elementos
     */
    #bindEvents() {
        if (this.#inputType) {
            this.#inputType.addEventListener('change', this.toggleElevationField.bind(this));
        }
    }

    /**
     * Mostra o formulário
     */
    showForm() {
        if (this.#form) {
            this.#form.classList.remove('hidden');
            if (this.#inputDistance) {
                this.#inputDistance.focus();
            }
        }
    }

    /**
     * Esconde o formulário
     */
    hideForm() {
        this.clearInputs();
        
        if (this.#form) {
            this.#form.style.display = 'none';
            this.#form.classList.add('hidden');
            setTimeout(() => {
                this.#form.style.display = 'grid';
            }, 1000);
        }
    }

    /**
     * Limpa todos os campos do formulário
     */
    clearInputs() {
        DOMUtils.clearInputs(
            this.#inputDistance,
            this.#inputDuration,
            this.#inputCadence,
            this.#inputElevation
        );
    }

    /**
     * Alterna visibilidade dos campos específicos
     */
    toggleElevationField() {
        const elevationRow = this.#inputElevation?.closest(DOMSelectors.formRow);
        const cadenceRow = this.#inputCadence?.closest(DOMSelectors.formRow);

        if (elevationRow) {
            elevationRow.classList.toggle('form__row--hidden');
        }
        if (cadenceRow) {
            cadenceRow.classList.toggle('form__row--hidden');
        }
    }

    /**
     * Obtém dados do formulário
     * @returns {Object} Dados do formulário
     */
    getFormData() {
        return {
            type: this.#inputType?.value,
            distance: +(this.#inputDistance?.value || 0),
            duration: +(this.#inputDuration?.value || 0),
            cadence: +(this.#inputCadence?.value || 0),
            elevation: +(this.#inputElevation?.value || 0)
        };
    }

    /**
     * Adiciona event listener para submit
     * @param {Function} callback - Função callback
     */
    onSubmit(callback) {
        if (this.#form) {
            this.#form.addEventListener('submit', callback);
        }
    }
}