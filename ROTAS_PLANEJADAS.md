# 🗺️ Funcionalidade de Rotas Planejadas - Mapty

## 📋 Visão Geral

A funcionalidade de **Rotas Planejadas** permite aos usuários criar, salvar e gerenciar percursos antes de realizar exercícios físicos. Esta funcionalidade usa o Leaflet Routing Machine para calcular rotas otimizadas entre pontos selecionados pelo usuário.

## 🚀 Funcionalidades Implementadas

### ✅ **Criação de Rotas**
- Clique no botão ➕ na seção "Rotas Planejadas"
- Clique no mapa para adicionar waypoints (mínimo 2 pontos)
- Arraste marcadores para ajustar posições
- Visualização em tempo real da rota calculada
- Estatísticas automáticas (distância, duração estimada)

### ✅ **Gerenciamento de Rotas**
- **Visualizar**: Clique na rota para centralizar no mapa
- **Editar**: Botão ✏️ para renomear a rota
- **Excluir**: Botão 🗑️ para remover a rota
- **Iniciar Exercício**: Botão 🏃‍♂️ para começar treino baseado na rota

### ✅ **Persistência de Dados**
- Armazenamento automático no localStorage
- Carregamento das rotas ao inicializar a aplicação
- Sincronização entre interface e armazenamento

### ✅ **Interface Responsiva**
- Seção dedicada para rotas planejadas
- Controles intuitivos para criar e gerenciar rotas
- Estatísticas visuais (distância, duração, dificuldade)
- Indicadores de status (planejada ⏳ / concluída ✅)

## 🏗️ Arquitetura da Implementação

### **1. Modelo de Dados**
```javascript
// src/models/PlannedRoute.js
class PlannedRoute {
    constructor(name, waypoints) {
        this.name = name;
        this.waypoints = waypoints;     // Array de [lat, lng]
        this.distance = 0;             // km
        this.estimatedDuration = 0;    // min
        this.elevationGain = 0;        // m
        this.isCompleted = false;
        // ... outros campos
    }
}
```

### **2. Serviço de Rotas**
```javascript
// src/services/RouteService.js
class RouteService {
    // Criação interativa de rotas
    startRouteCreation(map, onRouteCreated)
    
    // Cálculo de rotas usando Leaflet Routing Machine
    _calculateRoute()
    
    // Renderização de rotas salvas
    renderSavedRoute(route, map)
}
```

### **3. Interface de Usuário**
```javascript
// src/ui/RouteManager.js
class RouteManager {
    // Gerencia a interface das rotas
    renderRoute(route)
    
    // Eventos e interações
    _bindRouteEvents(routeElement, route)
    
    // Estatísticas e visualizações
    showRouteStats()
}
```

### **4. Armazenamento**
```javascript
// src/services/StorageService.js
class StorageService {
    static savePlannedRoutes(routes)
    static loadPlannedRoutes()
    static clearPlannedRoutes()
}
```

## 🎯 Como Usar

### **Criar Nova Rota**
1. Clique no botão ➕ na seção "Rotas Planejadas"
2. Clique no mapa para adicionar pontos (mínimo 2)
3. Ajuste os pontos arrastando os marcadores
4. Visualize as estatísticas calculadas
5. Clique em "💾 Salvar Rota" e dê um nome

### **Gerenciar Rotas Existentes**
- **Ver no Mapa**: Clique na rota para centralizar
- **Editar Nome**: Clique no ícone ✏️
- **Excluir**: Clique no ícone 🗑️
- **Iniciar Exercício**: Clique em "🏃‍♂️ Iniciar Exercício"

### **Iniciar Exercício Baseado em Rota**
1. Clique em "Iniciar Exercício" em uma rota planejada
2. Selecione o tipo de exercício (corrida, ciclismo, caminhada)
3. O formulário será aberto com dados pré-preenchidos
4. Complete as informações e submeta o exercício
5. A rota será marcada como concluída

## 🔧 Configurações Técnicas

### **Dependências Adicionadas**
```html
<!-- Leaflet Routing Machine CSS -->
<link rel="stylesheet" href="https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.css" />

<!-- Leaflet Routing Machine JS -->
<script defer src="https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.js"></script>
```

### **Novos Arquivos Criados**
```
src/
├── models/
│   └── PlannedRoute.js          # Modelo de dados para rotas
├── services/
│   └── RouteService.js          # Lógica de criação e gerenciamento
├── ui/
│   └── RouteManager.js          # Interface de usuário
└── App.js                       # Integração com aplicação principal
```

### **Modificações em Arquivos Existentes**
- `index.html`: Adicionado CDN do Leaflet Routing Machine
- `style.css`: Adicionados estilos para rotas planejadas
- `src/App.js`: Integração com nova funcionalidade
- `src/services/StorageService.js`: Métodos para armazenar rotas
- `src/services/MapService.js`: Getter público para instância do mapa

## 🎨 Estilo Visual

### **Cores e Temas**
- **Rotas Planejadas**: Azul (#3b82f6)
- **Rotas Concluídas**: Verde (#10b981)
- **Dificuldade**: Cores graduais do verde ao vermelho
- **Interface**: Tons de cinza escuro consistentes com o tema

### **Indicadores Visuais**
- **Waypoints**: Círculos numerados com cores distintas
- **Linhas de Rota**: Sólidas para concluídas, tracejadas para planejadas
- **Dificuldade**: Badges coloridos (Fácil, Moderada, Difícil, Muito Difícil)

## 🚧 Possíveis Melhorias Futuras

### **Funcionalidades Avançadas**
1. **Perfil de Elevação**: Gráfico da elevação ao longo da rota
2. **Exportar Rotas**: GPX, KML, outros formatos
3. **Importar Rotas**: De outros aplicativos/dispositivos
4. **Compartilhamento**: URLs para compartilhar rotas
5. **Clima/Tempo**: Integração com APIs meteorológicas

### **Otimizações**
1. **Cache de Rotas**: Armazenar rotas calculadas para performance
2. **Offline Support**: Funcionamento sem internet
3. **Batch Operations**: Operações em lote para múltiplas rotas
4. **Filtros e Busca**: Filtrar rotas por distância, dificuldade, etc.

### **Análises**
1. **Estatísticas Detalhadas**: Dashboard com métricas avançadas
2. **Comparações**: Comparar diferentes rotas
3. **Histórico**: Acompanhar evolução das rotas ao longo do tempo

## 📊 Estrutura de Dados

### **Formato de Armazenamento (localStorage)**
```json
{
  "id": "1698765432",
  "type": "planned-route",
  "name": "Rota Central Park",
  "description": "Rota Central Park - Criada em 31 de Outubro",
  "date": "2025-10-31T10:30:00.000Z",
  "waypoints": [
    [40.7829, -73.9654],
    [40.7681, -73.9808],
    [40.7505, -73.9934]
  ],
  "distance": 5.2,
  "estimatedDuration": 31,
  "elevationGain": 45,
  "routeCoordinates": [...],
  "instructions": [...],
  "isCompleted": false,
  "completedDate": null,
  "actualWorkout": null
}
```

## 🔍 Debug e Troubleshooting

### **Problemas Comuns**
1. **Rota não calcula**: Verificar se Leaflet Routing Machine carregou
2. **Waypoints não aparecem**: Verificar CSS dos marcadores
3. **Storage não persiste**: Verificar localStorage do navegador
4. **Mapa não responde**: Aguardar carregamento completo

### **Console Logs**
A aplicação registra ações importantes no console:
- Criação de rotas
- Exclusão de rotas
- Início de exercícios baseados em rotas
- Erros de armazenamento

---

**Implementação Completa** ✅  
A funcionalidade de Rotas Planejadas está totalmente integrada ao projeto Mapty, oferecendo uma experiência rica e intuitiva para planejamento de exercícios.