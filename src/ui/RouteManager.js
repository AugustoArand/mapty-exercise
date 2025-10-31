'use strict';

import { DOMUtils } from '../utils/DOMUtils.js';

/**
 * Gerenciador de interface para rotas planejadas
 */
export class RouteManager {
    constructor() {
        this.routes = [];
        this.routeListContainer = null;
        this.isRoutesVisible = true;
        this._init();
    }

    /**
     * Inicializa o gerenciador
     */
    _init() {
        this._createRouteInterface();
        this._bindEvents();
    }

    /**
     * Cria interface para rotas
     */
    _createRouteInterface() {
        const sidebar = document.querySelector('.sidebar');
        const workoutsContainer = document.querySelector('.workouts');
        
        // Cria seção de rotas planejadas
        const routeSection = document.createElement('div');
        routeSection.className = 'route-section';
        routeSection.innerHTML = `
            <div class="section-header">
                <h2 class="section-title">
                    <span class="section-icon">🗺️</span>
                    Rotas Planejadas
                </h2>
                <div class="section-controls">
                    <button class="btn-create-route" title="Criar Nova Rota">
                        ➕
                    </button>
                    <button class="btn-toggle-routes" title="Mostrar/Ocultar Rotas">
                        👁️
                    </button>
                </div>
            </div>
            <div class="route-list"></div>
        `;

        // Insere antes da lista de workouts
        sidebar.insertBefore(routeSection, workoutsContainer);
        
        this.routeListContainer = routeSection.querySelector('.route-list');
        this.createRouteBtn = routeSection.querySelector('.btn-create-route');
        this.toggleRoutesBtn = routeSection.querySelector('.btn-toggle-routes');
    }

    /**
     * Vincula eventos
     */
    _bindEvents() {
        this.createRouteBtn.addEventListener('click', this._handleCreateRoute.bind(this));
        this.toggleRoutesBtn.addEventListener('click', this._toggleRoutesVisibility.bind(this));
    }

    /**
     * Manipula criação de nova rota
     */
    _handleCreateRoute() {
        if (this.onCreateRoute) {
            this.onCreateRoute();
        }
    }

    /**
     * Alterna visibilidade das rotas
     */
    _toggleRoutesVisibility() {
        this.isRoutesVisible = !this.isRoutesVisible;
        
        this.routeListContainer.style.display = this.isRoutesVisible ? 'block' : 'none';
        this.toggleRoutesBtn.textContent = this.isRoutesVisible ? '👁️' : '🙈';
        
        // Dispara evento para mostrar/ocultar rotas no mapa
        if (this.onToggleVisibility) {
            this.onToggleVisibility(this.isRoutesVisible);
        }
    }

    /**
     * Renderiza rota na interface
     * @param {PlannedRoute} route - Rota a ser renderizada
     */
    renderRoute(route) {
        const routeElement = this._createRouteElement(route);
        this.routeListContainer.appendChild(routeElement);
    }

    /**
     * Cria elemento HTML para rota
     * @param {PlannedRoute} route - Rota
     * @returns {HTMLElement}
     */
    _createRouteElement(route) {
        const routeElement = document.createElement('div');
        routeElement.className = `planned-route ${route.isCompleted ? 'completed' : 'planned'}`;
        routeElement.dataset.id = route.id;

        const statusIcon = route.isCompleted ? '✅' : '🗺️';
        const difficulty = route.getDifficulty();
        const difficultyClass = difficulty.toLowerCase().replace(' ', '-');

        routeElement.innerHTML = `
            <div class="route-header">
                <h3 class="route-title">
                    <span class="route-status">${statusIcon}</span>
                    ${route.name}
                </h3>
                <div class="route-actions">
                    <button class="btn-route-action btn-view" title="Visualizar no Mapa" data-action="view">
                        👀
                    </button>
                    <button class="btn-route-action btn-edit" title="Editar Rota" data-action="edit">
                        ✏️
                    </button>
                    <button class="btn-route-action btn-delete" title="Excluir Rota" data-action="delete">
                        🗑️
                    </button>
                </div>
            </div>
            
            <div class="route-details">
                <div class="route-detail-item">
                    <span class="detail-icon">📏</span>
                    <span class="detail-value">${route.distance.toFixed(1)}</span>
                    <span class="detail-unit">km</span>
                </div>
                
                <div class="route-detail-item">
                    <span class="detail-icon">⏱️</span>
                    <span class="detail-value">${Math.round(route.estimatedDuration)}</span>
                    <span class="detail-unit">min</span>
                </div>
                
                <div class="route-detail-item">
                    <span class="detail-icon">📍</span>
                    <span class="detail-value">${route.waypoints.length}</span>
                    <span class="detail-unit">pontos</span>
                </div>
                
                <div class="route-detail-item">
                    <span class="detail-icon">🏔️</span>
                    <span class="detail-value difficulty-${difficultyClass}">${difficulty}</span>
                </div>
            </div>

            <div class="route-meta">
                <small class="route-date">${route.description}</small>
                ${route.isCompleted ? 
                    `<small class="completion-date">Concluída em ${route.completedDate?.toLocaleDateString()}</small>` : 
                    '<small class="route-planning">Planejada</small>'
                }
            </div>

            ${!route.isCompleted ? `
                <div class="route-start-actions">
                    <button class="btn-start-route" data-route-id="${route.id}">
                        🏃‍♂️ Iniciar Exercício
                    </button>
                </div>
            ` : ''}
        `;

        // Adiciona eventos aos botões
        this._bindRouteEvents(routeElement, route);

        return routeElement;
    }

    /**
     * Vincula eventos específicos da rota
     * @param {HTMLElement} routeElement - Elemento da rota
     * @param {PlannedRoute} route - Dados da rota
     */
    _bindRouteEvents(routeElement, route) {
        // Botões de ação
        const actionButtons = routeElement.querySelectorAll('.btn-route-action');
        actionButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = button.dataset.action;
                this._handleRouteAction(action, route);
            });
        });

        // Botão iniciar exercício
        const startButton = routeElement.querySelector('.btn-start-route');
        if (startButton) {
            startButton.addEventListener('click', (e) => {
                e.stopPropagation();
                this._handleStartRoute(route);
            });
        }

        // Clique na rota para visualizar
        routeElement.addEventListener('click', () => {
            this._handleRouteAction('view', route);
        });
    }

    /**
     * Manipula ações da rota
     * @param {string} action - Ação a ser executada
     * @param {PlannedRoute} route - Rota
     */
    _handleRouteAction(action, route) {
        switch (action) {
            case 'view':
                if (this.onViewRoute) {
                    this.onViewRoute(route);
                }
                break;
            
            case 'edit':
                if (this.onEditRoute) {
                    this.onEditRoute(route);
                }
                break;
            
            case 'delete':
                this._handleDeleteRoute(route);
                break;
        }
    }

    /**
     * Manipula exclusão de rota
     * @param {PlannedRoute} route - Rota a ser excluída
     */
    _handleDeleteRoute(route) {
        const confirmMessage = `Deseja excluir a rota "${route.name}"?`;
        
        if (confirm(confirmMessage)) {
            if (this.onDeleteRoute) {
                this.onDeleteRoute(route);
            }
            this._removeRouteElement(route.id);
        }
    }

    /**
     * Manipula início de exercício baseado na rota
     * @param {PlannedRoute} route - Rota a ser iniciada
     */
    _handleStartRoute(route) {
        const exerciseType = this._selectExerciseType();
        
        if (exerciseType && this.onStartRoute) {
            this.onStartRoute(route, exerciseType);
        }
    }

    /**
     * Permite usuário selecionar tipo de exercício
     * @returns {string|null}
     */
    _selectExerciseType() {
        const types = [
            { value: 'running', label: '🏃‍♂️ Corrida' },
            { value: 'cycling', label: '🚴‍♀️ Ciclismo' },
            { value: 'walking', label: '🚶‍♀️ Caminhada' }
        ];

        const typeSelection = prompt(
            'Que tipo de exercício você vai fazer?\n\n' +
            types.map((type, index) => `${index + 1}. ${type.label}`).join('\n') +
            '\n\nDigite o número:'
        );

        const selectedIndex = parseInt(typeSelection) - 1;
        
        if (selectedIndex >= 0 && selectedIndex < types.length) {
            return types[selectedIndex].value;
        }
        
        return null;
    }

    /**
     * Remove elemento da rota da interface
     * @param {string} routeId - ID da rota
     */
    _removeRouteElement(routeId) {
        const routeElement = this.routeListContainer.querySelector(`[data-id="${routeId}"]`);
        if (routeElement) {
            routeElement.remove();
        }
    }

    /**
     * Atualiza elemento da rota
     * @param {PlannedRoute} route - Rota atualizada
     */
    updateRoute(route) {
        this._removeRouteElement(route.id);
        this.renderRoute(route);
    }

    /**
     * Limpa todas as rotas da interface
     */
    clearRoutes() {
        this.routeListContainer.innerHTML = '';
        this.routes = [];
    }

    /**
     * Obtém todas as rotas
     * @returns {Array}
     */
    getAllRoutes() {
        return [...this.routes];
    }

    /**
     * Adiciona rota ao gerenciador
     * @param {PlannedRoute} route - Rota a ser adicionada
     */
    addRoute(route) {
        this.routes.push(route);
        this.renderRoute(route);
    }

    /**
     * Remove rota do gerenciador
     * @param {string} routeId - ID da rota
     */
    removeRoute(routeId) {
        this.routes = this.routes.filter(route => route.id !== routeId);
        this._removeRouteElement(routeId);
    }

    /**
     * Define callback para criação de rota
     * @param {Function} callback - Função a ser chamada
     */
    onCreateRouteHandler(callback) {
        this.onCreateRoute = callback;
    }

    /**
     * Define callback para visualização de rota
     * @param {Function} callback - Função a ser chamada
     */
    onViewRouteHandler(callback) {
        this.onViewRoute = callback;
    }

    /**
     * Define callback para edição de rota
     * @param {Function} callback - Função a ser chamada
     */
    onEditRouteHandler(callback) {
        this.onEditRoute = callback;
    }

    /**
     * Define callback para exclusão de rota
     * @param {Function} callback - Função a ser chamada
     */
    onDeleteRouteHandler(callback) {
        this.onDeleteRoute = callback;
    }

    /**
     * Define callback para início de exercício
     * @param {Function} callback - Função a ser chamada
     */
    onStartRouteHandler(callback) {
        this.onStartRoute = callback;
    }

    /**
     * Define callback para alternar visibilidade
     * @param {Function} callback - Função a ser chamada
     */
    onToggleVisibilityHandler(callback) {
        this.onToggleVisibility = callback;
    }

    /**
     * Mostra estatísticas das rotas
     */
    showRouteStats() {
        const totalRoutes = this.routes.length;
        const completedRoutes = this.routes.filter(route => route.isCompleted).length;
        const totalDistance = this.routes.reduce((sum, route) => sum + route.distance, 0);
        
        const stats = {
            total: totalRoutes,
            completed: completedRoutes,
            pending: totalRoutes - completedRoutes,
            totalDistance: totalDistance.toFixed(1)
        };

        this._showStatsModal(stats);
    }

    /**
     * Mostra modal com estatísticas
     * @param {Object} stats - Estatísticas das rotas
     */
    _showStatsModal(stats) {
        const modal = document.createElement('div');
        modal.className = 'route-stats-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>📊 Estatísticas das Rotas</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="stats-grid">
                        <div class="stat-card">
                            <span class="stat-number">${stats.total}</span>
                            <span class="stat-label">Total de Rotas</span>
                        </div>
                        <div class="stat-card">
                            <span class="stat-number">${stats.completed}</span>
                            <span class="stat-label">Concluídas</span>
                        </div>
                        <div class="stat-card">
                            <span class="stat-number">${stats.pending}</span>
                            <span class="stat-label">Pendentes</span>
                        </div>
                        <div class="stat-card">
                            <span class="stat-number">${stats.totalDistance} km</span>
                            <span class="stat-label">Distância Total</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Eventos do modal
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.remove();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
}