'use strict';

import { App } from './src/App.js';

/**
 * Inicialização da aplicação Mapty
 */
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    
    // Expõe app globalmente para debugging (opcional)
    window.mapyApp = app;
    
    console.log('🗺️ Mapty App initialized successfully!');
});