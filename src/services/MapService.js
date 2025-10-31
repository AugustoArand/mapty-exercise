'use strict';

/**
 * Serviço para gerenciar mapas usando Leaflet
 */
export class MapService {
    #map;
    #mapZoomLevel = 13;

    /**
     * Inicializa o mapa
     * @param {string} containerId - ID do container do mapa
     * @param {Array<number>} coords - Coordenadas [lat, lng]
     * @param {Function} onMapClick - Callback para cliques no mapa
     */
    initMap(containerId, coords, onMapClick) {
        this.#map = L.map(containerId).setView(coords, this.#mapZoomLevel);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.#map);

        if (onMapClick) {
            this.#map.on('click', onMapClick);
        }

        return this.#map;
    }

    /**
     * Adiciona marcador no mapa
     * @param {Array<number>} coords - Coordenadas [lat, lng]
     * @param {Object} workout - Objeto do exercício
     */
    addWorkoutMarker(coords, workout) {
        const marker = L.marker(coords)
            .addTo(this.#map)
            .bindPopup(L.popup({
                maxWidth: 250,
                minWidth: 100,
                autoClose: false,
                closeOnClick: false,
                className: `${workout.type}-popup`,
            }))
            .setPopupContent(`${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${workout.description}`)
            .openPopup();

        return marker;
    }

    /**
     * Move a visualização do mapa para coordenadas específicas
     * @param {Array<number>} coords - Coordenadas [lat, lng]
     * @param {Object} options - Opções de animação
     */
    moveToCoordinates(coords, options = {}) {
        if (!this.#map) return;

        const defaultOptions = {
            animate: true,
            pan: { duration: 1 }
        };

        this.#map.setView(coords, this.#mapZoomLevel, { ...defaultOptions, ...options });
    }

    /**
     * Retorna a instância do mapa
     */
    getMap() {
        return this.#map;
    }

    /**
     * Getter público para o mapa
     */
    get map() {
        return this.#map;
    }
}