'use strict';

/**
 * Serviço para gerenciar geolocalização
 */
export class GeolocationService {
    /**
     * Obtém a posição atual do usuário
     * @returns {Promise<GeolocationPosition>}
     */
    static async getCurrentPosition() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported by this browser.'));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                position => resolve(position),
                error => reject(error),
                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                }
            );
        });
    }

    /**
     * Gera URL do Google Maps para as coordenadas
     * @param {number} latitude 
     * @param {number} longitude 
     * @returns {string}
     */
    static generateMapsUrl(latitude, longitude) {
        return `https://www.google.pt/maps/@${latitude},${longitude}`;
    }
}