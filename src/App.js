'use strict';

import { Running } from './models/Running.js';
import { Cycling } from './models/Cycling.js';
import { PlannedRoute } from './models/PlannedRoute.js';
import { GeolocationService } from './services/GeolocationService.js';
import { MapService } from './services/MapService.js';
import { StorageService } from './services/StorageService.js';
import { RouteService } from './services/RouteService.js';
import { ValidationUtils } from './utils/ValidationUtils.js';
import { FormManager } from './ui/FormManager.js';
import { WorkoutListManager } from './ui/WorkoutListManager.js';
import { RouteManager } from './ui/RouteManager.js';

/**
 * Classe principal da aplicação Mapty
 */
export class App {
    #mapEvent;
    #workouts = [];
    #plannedRoutes = [];
    #mapService;
    #formManager;
    #workoutListManager;
    #routeManager;
    #routeService;

    constructor() {
        // Inicializa componentes
        this.#mapService = new MapService();
        this.#formManager = new FormManager();
        this.#workoutListManager = new WorkoutListManager();
        this.#routeManager = new RouteManager();
        this.#routeService = new RouteService();

        // Carrega dados salvos
        this.#loadStoredWorkouts();
        this.#loadStoredRoutes();

        // Inicializa aplicação
        this.#init();
    }

    /**
     * Inicializa a aplicação
     */
    async #init() {
        try {
            await this.#getPosition();
            this.#bindEvents();
        } catch (error) {
            console.error('Error initializing app:', error);
            alert('Could not get your position');
        }
    }

    /**
     * Vincula eventos da aplicação
     */
    #bindEvents() {
        this.#formManager.onSubmit(this.#newWorkout.bind(this));
        this.#workoutListManager.onWorkoutClick(this.#moveToPopup.bind(this));
        
        // Eventos do gerenciador de rotas
        this.#routeManager.onCreateRouteHandler(this.#handleCreateRoute.bind(this));
        this.#routeManager.onViewRouteHandler(this.#handleViewRoute.bind(this));
        this.#routeManager.onEditRouteHandler(this.#handleEditRoute.bind(this));
        this.#routeManager.onDeleteRouteHandler(this.#handleDeleteRoute.bind(this));
        this.#routeManager.onStartRouteHandler(this.#handleStartRoute.bind(this));
        this.#routeManager.onToggleVisibilityHandler(this.#handleToggleRouteVisibility.bind(this));
    }

    /**
     * Obtém posição do usuário
     */
    async #getPosition() {
        const position = await GeolocationService.getCurrentPosition();
        this.#loadMap(position);
    }

    /**
     * Carrega o mapa
     * @param {GeolocationPosition} position - Posição do usuário
     */
    #loadMap(position) {
        const { latitude, longitude } = position.coords;
        const coords = [latitude, longitude];

        console.log(GeolocationService.generateMapsUrl(latitude, longitude));

        this.#mapService.initMap('map', coords, this.#showForm.bind(this));

        // Renderiza workouts existentes no mapa
        this.#workouts.forEach(workout => {
            this.#mapService.addWorkoutMarker(workout.coords, workout);
        });

        // Renderiza rotas existentes no mapa
        this.#plannedRoutes.forEach(route => {
            this.#routeService.renderSavedRoute(route, this.#mapService.map);
        });
    }

    /**
     * Mostra formulário ao clicar no mapa
     * @param {Object} mapE - Evento do mapa
     */
    #showForm(mapE) {
        this.#mapEvent = mapE;
        this.#formManager.showForm();
    }

    /**
     * Cria novo exercício
     * @param {Event} e - Evento de submit do formulário
     */
    #newWorkout(e) {
        e.preventDefault();

        try {
            const formData = this.#formManager.getFormData();
            const { lat, lng } = this.#mapEvent.latlng;
            
            const workout = this.#createWorkout(formData, [lat, lng]);
            
            if (workout) {
                this.#addWorkout(workout);
                this.#formManager.hideForm();
            }
        } catch (error) {
            console.error('Error creating workout:', error);
            alert('Erro ao criar exercício. Tente novamente.');
        }
    }

    /**
     * Cria instância do exercício baseado no tipo
     * @param {Object} formData - Dados do formulário
     * @param {Array} coords - Coordenadas
     * @returns {Running|Cycling|null}
     */
    #createWorkout(formData, coords) {
        const { type, distance, duration, cadence, elevation } = formData;

        if (type === 'running') {
            if (!ValidationUtils.areValidPositiveNumbers(distance, duration, cadence)) {
                alert('Insira valores positivos válidos!');
                return null;
            }
            return new Running(coords, distance, duration, cadence);
        }

        if (type === 'cycling') {
            if (!ValidationUtils.areValidPositiveNumbers(distance, duration) || 
                !ValidationUtils.areValidNumbers(elevation)) {
                alert('Insira valores válidos!');
                return null;
            }
            return new Cycling(coords, distance, duration, elevation);
        }

        return null;
    }

    /**
     * Adiciona exercício à aplicação
     * @param {Running|Cycling} workout - Exercício a ser adicionado
     */
    #addWorkout(workout) {
        // Adiciona ao array
        this.#workouts.push(workout);
        
        // Renderiza no mapa
        this.#mapService.addWorkoutMarker(workout.coords, workout);
        
        // Renderiza na lista
        this.#workoutListManager.renderWorkout(workout);
        
        // Salva no localStorage
        this.#setLocalStorage();
        
        console.log('Workout created:', workout);
    }

    /**
     * Move visualização para exercício clicado
     * @param {Event} e - Evento de clique
     */
    #moveToPopup(e) {
        const workoutEl = e.target.closest('.workout');
        if (!workoutEl) return;

        const workout = this.#workouts.find(work => work.id === workoutEl.dataset.id);
        if (workout) {
            this.#mapService.moveToCoordinates(workout.coords);
        }
    }

    /**
     * Salva exercícios no localStorage
     */
    #setLocalStorage() {
        StorageService.saveWorkouts(this.#workouts);
    }

    /**
     * Carrega exercícios do localStorage
     */
    #loadStoredWorkouts() {
        const storedWorkouts = StorageService.loadWorkouts();
        
        // Reconstrói objetos com métodos corretos
        this.#workouts = storedWorkouts.map(data => {
            let workout;
            if (data.type === 'running') {
                workout = new Running(data.coords, data.distance, data.duration, data.cadence);
            } else if (data.type === 'cycling') {
                workout = new Cycling(data.coords, data.distance, data.duration, data.elevation);
            }
            
            // Preserva dados originais
            if (workout) {
                workout.id = data.id;
                workout.date = new Date(data.date);
                workout._setDescription();
            }
            
            return workout;
        }).filter(Boolean);

        // Renderiza workouts carregados na lista
        this.#workouts.forEach(workout => {
            this.#workoutListManager.renderWorkout(workout);
        });
    }

    /**
     * Método público para limpar todos os dados
     */
    reset() {
        StorageService.clearWorkouts();
        this.#clearRoutes();
        this.#workouts = [];
        this.#plannedRoutes = [];
        this.#workoutListManager.clearWorkoutsList();
        this.#routeManager.clearRoutes();
        location.reload();
    }

    // ====================== MÉTODOS PARA ROTAS PLANEJADAS ======================

    /**
     * Carrega rotas do localStorage
     */
    #loadStoredRoutes() {
        const storedRoutes = StorageService.loadPlannedRoutes();
        
        this.#plannedRoutes = storedRoutes.map(data => {
            return PlannedRoute.fromJSON(data);
        }).filter(Boolean);

        // Renderiza rotas carregadas na lista
        this.#plannedRoutes.forEach(route => {
            this.#routeManager.addRoute(route);
        });
    }

    /**
     * Salva rotas no localStorage
     */
    #setRoutesStorage() {
        StorageService.savePlannedRoutes(this.#plannedRoutes);
    }

    /**
     * Limpa todas as rotas
     */
    #clearRoutes() {
        StorageService.clearPlannedRoutes();
    }

    /**
     * Manipula criação de nova rota
     */
    #handleCreateRoute() {
        if (!this.#mapService.map) {
            alert('Aguarde o mapa carregar antes de criar uma rota.');
            return;
        }

        this.#routeService.startRouteCreation(
            this.#mapService.map,
            this.#onRouteCreated.bind(this)
        );
    }

    /**
     * Callback quando rota é criada
     * @param {PlannedRoute} route - Rota criada
     */
    #onRouteCreated(route) {
        this.#plannedRoutes.push(route);
        this.#routeManager.addRoute(route);
        this.#setRoutesStorage();
        
        // Renderiza no mapa
        this.#routeService.renderSavedRoute(route, this.#mapService.map);
        
        console.log('Rota criada:', route);
    }

    /**
     * Manipula visualização de rota
     * @param {PlannedRoute} route - Rota a ser visualizada
     */
    #handleViewRoute(route) {
        if (route.waypoints.length > 0) {
            // Centraliza mapa na rota
            const bounds = L.latLngBounds(route.waypoints);
            this.#mapService.map.fitBounds(bounds, { padding: [20, 20] });
        }
    }

    /**
     * Manipula edição de rota
     * @param {PlannedRoute} route - Rota a ser editada
     */
    #handleEditRoute(route) {
        const newName = prompt('Novo nome da rota:', route.name);
        
        if (newName && newName.trim() && newName !== route.name) {
            route.name = newName.trim();
            route._setDescription();
            
            this.#routeManager.updateRoute(route);
            this.#setRoutesStorage();
        }
    }

    /**
     * Manipula exclusão de rota
     * @param {PlannedRoute} route - Rota a ser excluída
     */
    #handleDeleteRoute(route) {
        // Remove do array
        this.#plannedRoutes = this.#plannedRoutes.filter(r => r.id !== route.id);
        
        // Remove da interface
        this.#routeManager.removeRoute(route.id);
        
        // Atualiza storage
        this.#setRoutesStorage();
        
        console.log('Rota excluída:', route.name);
    }

    /**
     * Manipula início de exercício baseado na rota
     * @param {PlannedRoute} route - Rota a ser iniciada
     * @param {string} exerciseType - Tipo de exercício
     */
    #handleStartRoute(route, exerciseType) {
        if (!route.isValid()) {
            alert('Rota inválida. Deve ter pelo menos 2 pontos.');
            return;
        }

        // Simula click no primeiro ponto da rota para iniciar o exercício
        const firstPoint = route.waypoints[0];
        const fakeMapEvent = {
            latlng: {
                lat: firstPoint[0],
                lng: firstPoint[1]
            }
        };

        this.#mapEvent = fakeMapEvent;
        this.#formManager.showForm();
        
        // Define tipo de exercício automaticamente
        const typeSelect = document.querySelector('.form__input--type');
        if (typeSelect) {
            typeSelect.value = exerciseType;
            typeSelect.dispatchEvent(new Event('change'));
        }

        // Pré-preenche distância se disponível
        const distanceInput = document.querySelector('.form__input--distance');
        if (distanceInput && route.distance > 0) {
            distanceInput.value = route.distance.toFixed(1);
        }

        // Move mapa para o ponto inicial
        this.#mapService.moveToCoordinates(firstPoint);
        
        alert(`Exercício iniciado! Preencha os dados do formulário.\nRota: ${route.name}\nDistância estimada: ${route.distance.toFixed(1)} km`);
    }

    /**
     * Manipula alternância de visibilidade das rotas no mapa
     * @param {boolean} visible - Se rotas devem ser visíveis
     */
    #handleToggleRouteVisibility(visible) {
        // Esta funcionalidade pode ser implementada futuramente
        // para mostrar/ocultar rotas no mapa dinamicamente
        console.log(`Rotas ${visible ? 'mostradas' : 'ocultadas'} no mapa`);
    }
}