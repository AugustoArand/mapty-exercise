'use strict';

import { Running } from './models/Running.js';
import { Cycling } from './models/Cycling.js';
import { GeolocationService } from './services/GeolocationService.js';
import { MapService } from './services/MapService.js';
import { StorageService } from './services/StorageService.js';
import { ValidationUtils } from './utils/ValidationUtils.js';
import { FormManager } from './ui/FormManager.js';
import { WorkoutListManager } from './ui/WorkoutListManager.js';

/**
 * Classe principal da aplicação Mapty
 */
export class App {
    #mapEvent;
    #workouts = [];
    #mapService;
    #formManager;
    #workoutListManager;

    constructor() {
        // Inicializa componentes
        this.#mapService = new MapService();
        this.#formManager = new FormManager();
        this.#workoutListManager = new WorkoutListManager();

        // Carrega dados salvos
        this.#loadStoredWorkouts();

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
        this.#workouts = [];
        this.#workoutListManager.clearWorkoutsList();
        location.reload();
    }
}