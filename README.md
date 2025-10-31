# 🗺️ Mapty - Modular Workout Mapping App

Uma aplicação web moderna e modular para mapear seus exercícios usando JavaScript ES6+ e Leaflet.

## 🏗️ Arquitetura Modular

```
src/
├── models/           # Classes de domínio
│   ├── Workout.js    # Classe base para exercícios
│   ├── Running.js    # Classe para corrida
│   ├── Cycling.js    # Classe para ciclismo
│   └── PlannedRoute.js # Classe para rotas planejadas
├── services/         # Lógica de negócio
│   ├── GeolocationService.js  # Gerenciamento de geolocalização
│   ├── MapService.js          # Gerenciamento do mapa
│   ├── StorageService.js      # Gerenciamento do localStorage
│   └── RouteService.js        # Gerenciamento de rotas planejadas
├── ui/               # Componentes de interface
│   ├── FormManager.js         # Gerenciamento do formulário
│   ├── WorkoutListManager.js  # Gerenciamento da lista
│   └── RouteManager.js        # Gerenciamento das rotas planejadas
├── utils/            # Utilitários
│   ├── ValidationUtils.js     # Validações
│   └── DOMUtils.js           # Manipulação do DOM
└── App.js            # Classe principal da aplicação
```

## 🚀 Funcionalidades

- ✅ **Geolocalização**: Obtém automaticamente sua localização
- ✅ **Mapa Interativo**: Clique no mapa para adicionar exercícios
- ✅ **Tipos de Exercício**: Suporte para corrida e ciclismo
- ✅ **Cálculos Automáticos**: Pace para corrida, velocidade para ciclismo
- ✅ **Persistência**: Salva dados no localStorage
- ✅ **Interface Responsiva**: Formulário dinâmico baseado no tipo
- ✅ **Navegação**: Clique nos exercícios para ir ao local no mapa
- 🆕 **Rotas Planejadas**: Crie, salve e gerencie percursos antes dos exercícios

## 🛠️ Tecnologias Utilizadas

- **JavaScript ES6+ Modules**
- **Leaflet.js** para mapas
- **Leaflet Routing Machine** para rotas planejadas
- **Geolocation API**
- **localStorage API**
- **CSS3** para styling
- **HTML5** semântico

## 📦 Instalação e Uso

### Pré-requisitos
- Node.js (versão 14+)
- npm ou yarn

### Instalação
```bash
# Clone o repositório
git clone https://github.com/AugustoArand/mapty-exercise.git

# Entre no diretório
cd mapty-exercise

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

### Uso Manual
Abra o arquivo `index.html` em um servidor web local ou use a extensão Live Server do VS Code.

## 🎯 Como Usar

1. **Permitir Localização**: Autorize o acesso à sua localização
2. **Clicar no Mapa**: Clique onde você fez o exercício
3. **Preencher Formulário**: 
   - Escolha o tipo (Corrida/Ciclismo)
   - Preencha distância e duração
   - Para corrida: adicione cadência
   - Para ciclismo: adicione elevação
4. **Submeter**: Pressione Enter ou clique OK
5. **Navegar**: Clique nos exercícios da lista para ir ao local

### 🗺️ **Rotas Planejadas (NOVO!)**
1. **Criar Rota**: Clique no botão ➕ na seção "Rotas Planejadas"
2. **Adicionar Pontos**: Clique no mapa para criar waypoints (mínimo 2)
3. **Ajustar**: Arraste os marcadores para posicionar melhor
4. **Salvar**: Clique "💾 Salvar Rota" e dê um nome
5. **Usar**: Clique "🏃‍♂️ Iniciar Exercício" para treinar na rota

## 🔧 Benefícios da Modularização

### ✅ **Separação de Responsabilidades**
- **Models**: Lógica de negócio pura
- **Services**: Integrações externas
- **UI**: Componentes de interface
- **Utils**: Funções reutilizáveis

### ✅ **Manutenibilidade**
- Código mais organizado e legível
- Fácil localização de bugs
- Mudanças isoladas por módulo

### ✅ **Reutilização**
- Componentes podem ser reutilizados
- Services podem ser testados isoladamente
- Utils podem ser compartilhados

### ✅ **Escalabilidade**
- Fácil adição de novos tipos de exercício
- Simples inclusão de novas funcionalidades
- Estrutura preparada para crescimento
- Sistema de rotas planejadas modular e extensível

### ✅ **Testabilidade**
- Cada módulo pode ser testado independentemente
- Dependências claramente definidas
- Mocks e stubs mais simples

## 🧪 Exemplo de Uso da API

```javascript
// Adicionar novo tipo de exercício
import { Workout } from './src/models/Workout.js';

class Swimming extends Workout {
    type = 'swimming';
    
    constructor(coords, distance, duration, strokes) {
        super(coords, distance, duration);
        this.strokes = strokes;
        this.calcEfficiency();
        this._setDescription();
    }
    
    calcEfficiency() {
        this.efficiency = this.distance / this.strokes;
        return this.efficiency;
    }
}

// Criar rota planejada programaticamente
import { PlannedRoute } from './src/models/PlannedRoute.js';

const route = new PlannedRoute('Minha Rota', [
    [40.7829, -73.9654],  // Central Park
    [40.7681, -73.9808],  // Sheep Meadow
    [40.7505, -73.9934]   // Columbus Circle
]);
```

## 🎨 Personalização

### Adicionar Novo Tipo de Exercício
1. Crie nova classe em `src/models/`
2. Estenda `Workout`
3. Atualize `App.js` para reconhecer o tipo
4. Modifique o HTML para incluir a opção

### Personalizar Rotas Planejadas
- Modifique `src/services/RouteService.js` para alterar cálculos
- Use `src/ui/RouteManager.js` para customizar interface
- Estenda `src/models/PlannedRoute.js` para novos campos

### Personalizar Interface
- Modifique `src/ui/` para alterar componentes
- Use `src/utils/DOMUtils.js` para manipulações

### Adicionar Persistência Externa
- Crie novo service em `src/services/`
- Implemente interface similar ao `StorageService`

## 📝 Scripts Disponíveis

- `npm start` - Inicia servidor de desenvolvimento
- `npm run dev` - Modo desenvolvimento com hot reload
- `npm run build` - Build para produção (placeholder)
- `npm test` - Executar testes (placeholder)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para detalhes.

## 🙏 Agradecimentos

- Leaflet.js pela excelente biblioteca de mapas
- OpenStreetMap pelos dados de mapa
- Inspirado no curso de JavaScript moderno

---

### 🔍 Estrutura Original vs Modular

**Antes (script.js único):**
- 280+ linhas em um arquivo
- Responsabilidades misturadas
- Difícil manutenção
- Sem reutilização

**Depois (modular):**
- 12 módulos especializados
- Responsabilidades claras
- Fácil manutenção e teste
- Código reutilizável e escalável
- Sistema de rotas planejadas integrado

## 🗺️ **Nova Funcionalidade: Rotas Planejadas**

### **O que é?**
Sistema completo para criar, salvar e gerenciar percursos antes de realizar exercícios físicos.

### **Como funciona?**
1. **Criação**: Clique no mapa para adicionar waypoints
2. **Cálculo**: Distância e duração calculadas automaticamente
3. **Persistência**: Rotas salvas no localStorage
4. **Execução**: Inicie exercícios baseados nas rotas planejadas

### **Benefícios:**
- 📋 **Planejamento**: Organize seus treinos com antecedência
- 📏 **Precisão**: Rotas calculadas com dados reais
- 🎯 **Objetivos**: Defina metas específicas de distância
- 📊 **Análise**: Acompanhe dificuldade e estatísticas
- 🔄 **Reutilização**: Use a mesma rota múltiplas vezes

### **Documentação Detalhada**
Para informações completas sobre rotas planejadas, consulte: [`ROTAS_PLANEJADAS.md`](./ROTAS_PLANEJADAS.md)






