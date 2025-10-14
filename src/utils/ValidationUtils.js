'use strict';

/**
 * Funções utilitárias para validação
 */
export class ValidationUtils {
    /**
     * Verifica se um número é válido e positivo
     * @param {...number} inputs - Números para validar
     * @returns {boolean}
     */
    static areValidPositiveNumbers(...inputs) {
        return inputs.every(input => Number.isFinite(input) && input > 0);
    }

    /**
     * Verifica se um número é válido (pode ser negativo)
     * @param {...number} inputs - Números para validar
     * @returns {boolean}
     */
    static areValidNumbers(...inputs) {
        return inputs.every(input => Number.isFinite(input));
    }

    /**
     * Converte string para número
     * @param {string} value - Valor para converter
     * @returns {number}
     */
    static toNumber(value) {
        return +value;
    }
}