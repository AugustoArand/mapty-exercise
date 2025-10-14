# 🗺️ Mapty - Modular Workout Mapping App

Uma aplicação web moderna e modular para mapear seus exercícios usando JavaScript ES6+ e Leaflet.

## 🏗️ Arquitetura Modular

```
src/
├── models/           # Classes de domínio
│   ├── Workout.js    # Classe base para exercícios
│   ├── Running.js    # Classe para corrida
│   └── Cycling.js    # Classe para ciclismo
├── services/         # Lógica de negócio
│   ├── GeolocationService.js  # Gerenciamento de geolocalização
│   ├── MapService.js          # Gerenciamento do mapa
│   └── StorageService.js      # Gerenciamento do localStorage
├── ui/               # Componentes de interface
│   ├── FormManager.js         # Gerenciamento do formulário
│   └── WorkoutListManager.js  # Gerenciamento da lista
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

## 🛠️ Tecnologias Utilizadas

- **JavaScript ES6+ Modules**
- **Leaflet.js** para mapas
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
```

## 🎨 Personalização

### Adicionar Novo Tipo de Exercício
1. Crie nova classe em `src/models/`
2. Estenda `Workout`
3. Atualize `App.js` para reconhecer o tipo
4. Modifique o HTML para incluir a opção

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
- 9 módulos especializados
- Responsabilidades claras
- Fácil manutenção e teste
- Código reutilizável e escalável






