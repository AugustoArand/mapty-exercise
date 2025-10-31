'use strict';



class Workout {
    date = new Date();
    id = (Date.now() + '').slice(-10);

    constructor(coords, distance, duration) {
        this.coords = coords;
        this.distance = distance; // in km
        this.duration = duration; // in min

    }

    // Toda atividade criada puxará essas informações
    _setDescription() {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${months[this.date.getMonth()]} ${this.date.getDate()}`

    }
}

class Running extends Workout {
    type = 'running';

    constructor(coords, distance, duration, cadence) {
        super(coords, distance, duration);
        this.cadence = cadence;
        this.calcPace();
        this._setDescription();
    }

    calcPace() {
        // min/km
        this.pace = this.duration / this.distance;
        return this.pace;
    }
}

class Cycling extends Workout {
    type = 'cycling';

    constructor(coords, distance, duration, elevation) {
        super(coords, distance, duration);
        this.elevation = elevation;
        this.calcSpeed();
        this._setDescription();
    }

    calcSpeed() {
        this.speed = this.distance / this.duration;
        return this.speed;
    }
}



const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

// ARQUITETURA DA APLICAÇÃO
class App {

    #map; // Private
    #mapZoomLevel = 13;
    #mapEvent; // Private
    #workouts = [];

    constructor() {

        this._getPosition();
        //Trabalhar com classes e eventlistener nos obriga a usar o bind para apontar ao objeto desejado
        // e não exatamente a função no qual ele está inserido, conforme a função abaixo.
        form.addEventListener('submit', this._newWorkout.bind(this));
        inputType.addEventListener('change', this._toggleElevationField);
        containerWorkouts.addEventListener('click', this._moveToPopup.bind(this));
    }

    _getPosition() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), function () {
                alert('Could not get your position');
            })
        };
    }

    _loadMap(position) {
        const { latitude } = position.coords;
        const { longitude } = position.coords;

        console.log(`https://www.google.pt/maps/@${latitude},${longitude}`);

        const coords = [latitude, longitude]; // const map recebe um array como parametro

        this.#map = L.map('map').setView(coords, this.#mapZoomLevel);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.#map);

        this.#map.on('click', this._showForm.bind(this));

    }

    _showForm(mapE) {
        // Manipulando clicks no mapa
        this.#mapEvent = mapE; // Transformando em variavel global
        form.classList.remove('hidden');
        inputDistance.focus();
    }

    _hideForm() {
        // Limpar os campos
        inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = '';

        form.style.display = 'none';
        form.classList.add('hidden');
        setTimeout(() => (form.style.display = 'grid'), 1000);
    }

    // Cria um formulário dinâmico para Running e Cycling - Polimorfismo
    // Quando "Running" está selecionado:
    // Campo Cadence (passos por minuto) → Visível
    // Campo Elevation (elevação) → Escondido
    // 🚴‍♀️ Quando "Cycling" está selecionado:
    // Campo Cadence → Escondido
    // Campo Elevation → Visível
    _toggleElevationField() {
        inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
        inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    };


    _newWorkout(e) {
        e.preventDefault();

        // Pegando as informações do forms
        const type = inputType.value;
        const distance = +inputDistance.value;
        const duration = +inputDuration.value;
        const { lat, lng } = this.#mapEvent.latlng;
        let workout; // Torna-la utilizavel fora do escopo

        // Se o exercicio for corrida, criar um objeto de corrida
        if (type === 'running') {
            const cadence = +inputCadence.value;
            // Checa se o valor é válido
            if (!Number.isFinite(distance) ||
                !Number.isFinite(duration) ||
                !Number.isFinite(cadence)
            )
                return alert('Insira valores positivos!');

            workout = new Running([lat, lng], distance, duration, cadence);

        }


        // Se o exercicio for ciclismo, criar um objeto de ciclismo
        if (type === 'cycling') {
            const elevation = +inputElevation.value;

            if (!Number.isFinite(distance) ||
                !Number.isFinite(duration) ||
                !Number.isFinite(elevation)
            )
                return alert('Insira valores positivos');
            workout = new Cycling([lat, lng], distance, duration, elevation);
        }
        //Adicionando um novo objeto no array workout
        this.#workouts.push(workout);
        console.log(workout);

        //Renderizar o marcador de exercicio
        this._renderWorkoutMarker(workout);

        //Renderizar os exercicios em lista
        this._renderWorkout(workout);

        //Limpar os campos
        this._hideForm();

        // Configurando armazenamento local
        this._setLocalStorage();
    };

    _renderWorkoutMarker(workout) {
        L.marker(workout.coords)
            .addTo(this.#map)
            .bindPopup(L.popup({
                maxWidth: 250,
                minWidth: 100,
                autoClose: false,
                closeOnClick: false,
                className: `${workout.type}-popup`,
            })
            )
            .setPopupContent(`${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${workout.description}`)
            .openPopup();

    }
    _renderWorkout(workout) {
        let html = `
        <li class= "workout workout--${workout.type}" data-id="${workout.id}">
          <h2 class="workout__title">${workout.description}</h2>
          <div class="workout__details">
            <span class="workout__icon">${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'}</span>
            <span class="workout__value">${workout.distance}</span>
            <span class="workout__unit">km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${workout.duration}</span>
            <span class="workout__unit">min</span>
          </div>
          `;

        if (workout.type === 'running')
            html += `
            <div class= "workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.pace.toFixed(1)}</span>
            <span class="workout__unit">min/km</span>
          </div >
                <div class="workout__details">
                    <span class="workout__icon">🦶🏼</span>
                    <span class="workout__value">${workout.cadence}</span>
                    <span class="workout__unit">spm</span>
                </div>
        </li >
                `;

        if (workout.type === 'cycling')
            html += `
          <div class="workout__details">
            <span class="workout__icon">🚴‍♀️</span>
            <span class="workout__value">${workout.speed.toFixed(1)}</span>
            <span class="workout__unit">km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${workout.elevation}</span>
            <span class="workout__unit">min</span>
          </div>
        `;

        form.insertAdjacentHTML('afterend', html);

    }

    // PROCESSO DE ID NÃO FUNCIONOU, ESTE RECURSO NÃO ESTÁ DISPONIVEL

    _moveToPopup(e) {
        if (!this.#map) return;

        const workoutEl = e.target.closest('.workout');

        if (!workoutEl) return;

        const workout = this.#workouts.find(work => work.id === workoutEl.dataset.id);
        console.log(workout);

        this.#map.setView(workout.coords, this.#mapZoomLevel, {
            animate: true,
            pan: {
                duration: 1,
            }
        });

    }
    _setLocalStorage() {
        localStorage.setItem('workouts', JSON.stringify(this.#workouts)) // API que o browser provê para nós
    };
}
const app = new App();




