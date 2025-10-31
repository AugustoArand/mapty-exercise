'use strict';

import { PlannedRoute } from '../models/PlannedRoute.js';

/**
 * Serviço para gerenciar criação e cálculo de rotas planejadas
 */
export class RouteService {
    constructor() {
        this.routingControl = null;
        this.currentRoute = null;
        this.isCreatingRoute = false;
        this.tempWaypoints = [];
    }

    /**
     * Inicia modo de criação de rota
     * @param {L.Map} map - Instância do mapa Leaflet
     * @param {Function} onRouteCreated - Callback quando rota é criada
     */
    startRouteCreation(map, onRouteCreated) {
        this.map = map;
        this.onRouteCreated = onRouteCreated;
        this.isCreatingRoute = true;
        this.tempWaypoints = [];
        
        // Muda cursor do mapa
        this.map.getContainer().style.cursor = 'crosshair';
        
        // Adiciona listener para cliques no mapa
        this.map.on('click', this._handleMapClick.bind(this));
        
        // Mostra instruções
        this._showInstructions();
    }

    /**
     * Para criação de rota
     */
    stopRouteCreation() {
        this.isCreatingRoute = false;
        this.tempWaypoints = [];
        
        if (this.map) {
            this.map.getContainer().style.cursor = '';
            this.map.off('click', this._handleMapClick.bind(this));
        }
        
        this._hideInstructions();
        this._clearTempMarkers();
    }

    /**
     * Manipula cliques no mapa durante criação de rota
     * @param {Object} e - Evento do mapa
     */
    _handleMapClick(e) {
        if (!this.isCreatingRoute) return;
        
        const { lat, lng } = e.latlng;
        this.tempWaypoints.push([lat, lng]);
        
        // Adiciona marcador temporário
        this._addTempMarker([lat, lng], this.tempWaypoints.length);
        
        // Se temos pelo menos 2 pontos, calcula rota
        if (this.tempWaypoints.length >= 2) {
            this._calculateRoute();
        }
    }

    /**
     * Adiciona marcador temporário
     * @param {Array} coords - [lat, lng]
     * @param {number} index - Índice do waypoint
     */
    _addTempMarker(coords, index) {
        const marker = L.marker(coords, {
            icon: this._createWaypointIcon(index),
            draggable: true
        }).addTo(this.map);

        // Permite arrastar waypoint
        marker.on('dragend', (e) => {
            const newCoords = [e.target.getLatLng().lat, e.target.getLatLng().lng];
            this.tempWaypoints[index - 1] = newCoords;
            this._calculateRoute();
        });

        // Adiciona popup com opções
        marker.bindPopup(this._createWaypointPopup(index - 1));
        
        if (!this.tempMarkers) this.tempMarkers = [];
        this.tempMarkers.push(marker);
    }

    /**
     * Cria ícone para waypoint
     * @param {number} index - Índice do waypoint
     * @returns {L.Icon}
     */
    _createWaypointIcon(index) {
        return L.divIcon({
            className: 'route-waypoint',
            html: `<div class="waypoint-marker">${index}</div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });
    }

    /**
     * Cria popup para waypoint
     * @param {number} index - Índice do waypoint
     * @returns {string}
     */
    _createWaypointPopup(index) {
        return `
            <div class="waypoint-popup">
                <p>Ponto ${index + 1}</p>
                <button onclick="routeService.removeWaypoint(${index})" class="btn-remove-waypoint">
                    🗑️ Remover
                </button>
            </div>
        `;
    }

    /**
     * Remove waypoint
     * @param {number} index - Índice do waypoint
     */
    removeWaypoint(index) {
        if (index >= 0 && index < this.tempWaypoints.length) {
            this.tempWaypoints.splice(index, 1);
            this._clearTempMarkers();
            
            // Recria marcadores
            this.tempWaypoints.forEach((coords, i) => {
                this._addTempMarker(coords, i + 1);
            });
            
            // Recalcula rota se ainda temos pontos suficientes
            if (this.tempWaypoints.length >= 2) {
                this._calculateRoute();
            } else {
                this._clearRoute();
            }
        }
    }

    /**
     * Calcula rota entre waypoints
     */
    _calculateRoute() {
        if (this.tempWaypoints.length < 2) return;

        // Remove rota anterior
        this._clearRoute();

        // Cria nova rota
        this.routingControl = L.Routing.control({
            waypoints: this.tempWaypoints.map(coords => L.latLng(coords[0], coords[1])),
            routeWhileDragging: false,
            addWaypoints: false,
            createMarker: () => null, // Não criar marcadores padrão
            lineOptions: {
                styles: [
                    { color: '#2563eb', weight: 6, opacity: 0.8 },
                    { color: '#ffffff', weight: 2, opacity: 1 }
                ]
            },
            show: false // Não mostrar painel de instruções
        }).addTo(this.map);

        // Listener para quando rota é calculada
        this.routingControl.on('routesfound', (e) => {
            const route = e.routes[0];
            this._updateRouteStats(route);
        });
    }

    /**
     * Atualiza estatísticas da rota
     * @param {Object} route - Dados da rota
     */
    _updateRouteStats(route) {
        const distance = (route.summary.totalDistance / 1000).toFixed(2); // km
        const duration = Math.round(route.summary.totalTime / 60); // min
        
        // Mostra estatísticas
        this._showRouteStats({
            distance: parseFloat(distance),
            duration: duration,
            instructions: route.instructions
        });
    }

    /**
     * Mostra estatísticas da rota
     * @param {Object} stats - Estatísticas da rota
     */
    _showRouteStats(stats) {
        const existingStats = document.querySelector('.route-stats');
        if (existingStats) existingStats.remove();

        const statsHtml = `
            <div class="route-stats">
                <h3>📊 Estatísticas da Rota</h3>
                <div class="stats-grid">
                    <div class="stat-item">
                        <span class="stat-icon">📏</span>
                        <span class="stat-value">${stats.distance} km</span>
                        <span class="stat-label">Distância</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-icon">⏱️</span>
                        <span class="stat-value">${stats.duration} min</span>
                        <span class="stat-label">Duração Est.</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-icon">📍</span>
                        <span class="stat-value">${this.tempWaypoints.length}</span>
                        <span class="stat-label">Pontos</span>
                    </div>
                </div>
                <div class="route-actions">
                    <button class="btn-save-route" onclick="routeService.showSaveDialog()">
                        💾 Salvar Rota
                    </button>
                    <button class="btn-cancel-route" onclick="routeService.cancelRoute()">
                        ❌ Cancelar
                    </button>
                </div>
            </div>
        `;

        document.querySelector('.sidebar').insertAdjacentHTML('beforeend', statsHtml);
        this.currentStats = stats;
    }

    /**
     * Mostra diálogo para salvar rota
     */
    showSaveDialog() {
        const routeName = prompt('Nome da rota:', `Rota ${new Date().toLocaleDateString()}`);
        
        if (routeName && routeName.trim()) {
            this.saveRoute(routeName.trim());
        }
    }

    /**
     * Salva rota planejada
     * @param {string} name - Nome da rota
     */
    saveRoute(name) {
        if (this.tempWaypoints.length < 2) {
            alert('A rota deve ter pelo menos 2 pontos!');
            return;
        }

        const plannedRoute = new PlannedRoute(name, [...this.tempWaypoints]);
        
        if (this.currentStats) {
            plannedRoute.updateRouteData({
                distance: this.currentStats.distance,
                duration: this.currentStats.duration,
                coordinates: this._getRouteCoordinates(),
                instructions: this.currentStats.instructions
            });
        }

        // Callback para aplicação principal
        if (this.onRouteCreated) {
            this.onRouteCreated(plannedRoute);
        }

        this.stopRouteCreation();
        alert(`Rota "${name}" salva com sucesso!`);
    }

    /**
     * Cancela criação de rota
     */
    cancelRoute() {
        if (confirm('Deseja cancelar a criação da rota?')) {
            this.stopRouteCreation();
        }
    }

    /**
     * Obtém coordenadas da rota calculada
     * @returns {Array}
     */
    _getRouteCoordinates() {
        if (!this.routingControl) return [];
        
        const routes = this.routingControl.getRouter().routes;
        if (routes && routes.length > 0) {
            return routes[0].coordinates || [];
        }
        return [];
    }

    /**
     * Limpa marcadores temporários
     */
    _clearTempMarkers() {
        if (this.tempMarkers) {
            this.tempMarkers.forEach(marker => this.map.removeLayer(marker));
            this.tempMarkers = [];
        }
    }

    /**
     * Limpa rota do mapa
     */
    _clearRoute() {
        if (this.routingControl) {
            this.map.removeControl(this.routingControl);
            this.routingControl = null;
        }
    }

    /**
     * Mostra instruções de criação
     */
    _showInstructions() {
        const instructionsHtml = `
            <div class="route-instructions">
                <h3>🗺️ Criando Rota</h3>
                <p>Clique no mapa para adicionar pontos à sua rota</p>
                <ul>
                    <li>Mínimo 2 pontos necessários</li>
                    <li>Arraste os marcadores para ajustar</li>
                    <li>Clique no marcador para remover</li>
                </ul>
            </div>
        `;

        document.querySelector('.sidebar').insertAdjacentHTML('afterbegin', instructionsHtml);
    }

    /**
     * Esconde instruções
     */
    _hideInstructions() {
        const instructions = document.querySelector('.route-instructions');
        if (instructions) instructions.remove();
        
        const stats = document.querySelector('.route-stats');
        if (stats) stats.remove();
    }

    /**
     * Renderiza rota salva no mapa
     * @param {PlannedRoute} route - Rota a ser renderizada
     * @param {L.Map} map - Instância do mapa
     */
    renderSavedRoute(route, map) {
        if (!route.isValid()) return;

        // Cria grupo de layers para a rota
        const routeGroup = L.layerGroup().addTo(map);

        // Adiciona waypoints
        route.waypoints.forEach((coords, index) => {
            const marker = L.marker(coords, {
                icon: this._createSavedRouteIcon(index + 1, route.isCompleted)
            }).addTo(routeGroup);

            marker.bindPopup(`
                <div class="saved-route-popup">
                    <h4>${route.name}</h4>
                    <p>Ponto ${index + 1}</p>
                    <p><strong>Distância:</strong> ${route.distance} km</p>
                    <p><strong>Status:</strong> ${route.isCompleted ? '✅ Concluída' : '⏳ Planejada'}</p>
                </div>
            `);
        });

        // Se temos coordenadas da rota, desenha a linha
        if (route.routeCoordinates && route.routeCoordinates.length > 0) {
            const polyline = L.polyline(route.routeCoordinates, {
                color: route.isCompleted ? '#10b981' : '#3b82f6',
                weight: 4,
                opacity: 0.7,
                dashArray: route.isCompleted ? null : '10, 5'
            }).addTo(routeGroup);

            polyline.bindPopup(`
                <div class="route-polyline-popup">
                    <h4>${route.name}</h4>
                    <p>📏 ${route.distance} km</p>
                    <p>⏱️ ${route.estimatedDuration} min</p>
                    <p>🏔️ ${route.getDifficulty()}</p>
                </div>
            `);
        }

        return routeGroup;
    }

    /**
     * Cria ícone para rota salva
     * @param {number} index - Número do ponto
     * @param {boolean} isCompleted - Se a rota foi completada
     * @returns {L.Icon}
     */
    _createSavedRouteIcon(index, isCompleted) {
        return L.divIcon({
            className: `saved-route-waypoint ${isCompleted ? 'completed' : 'planned'}`,
            html: `<div class="saved-waypoint-marker">${index}</div>`,
            iconSize: [25, 25],
            iconAnchor: [12.5, 12.5]
        });
    }
}

// Torna disponível globalmente para uso em popups
window.routeService = new RouteService();