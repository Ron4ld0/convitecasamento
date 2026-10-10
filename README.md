# Convite de Casamento Digital com RSVP — Laura & Guilherme

Convite de casamento digital elegante, responsivo e de alto padrão visual, desenvolvido com máxima fidelidade estética ao convite em PDF original (`convite jantar de casamento (1) (1).pdf`), integrado ao Google Sheets via Google Apps Script para confirmação de presença (RSVP) em tempo real.

---

## 🎨 Identidade Visual e Fidelidade ao PDF Original

O projeto foi construído respeitando as características do documento original:

- **Fundo Papelaria Fina**: Tom marfim quente `#efede7` com textura suave.
- **Tipografia Nobre**:
  - Títulos e Informações: *Cormorant Garamond* e *Bodoni* (serifada clássica, caixa alta e espaçamento arejado).
  - Nomes dos Noivos: *Alex Brush* / *Pinyon Script* (caligrafia fluida e refinada).
  - Fechamento: *Alex Brush* ("Esperamos por você!").
- **Monogramas Vetoriais Genuínos**: As elegantes marcas d'água das letras **L** (topo esquerdo) e **G** (rodapé direito) foram extraídas com curvas de Bézier matemáticas autênticas do próprio PDF e salvas em formato SVG limpo e escalável (`assets/monogram-L.svg` e `assets/monogram-G.svg`).
- **Composição Asimétrica Elegante**: Nomes dos noivos alinhados no quadrante superior direito e informações do evento no quadrante inferior esquerdo, preservando o layout do convite.

---

## 📋 Informações do Evento

- **Noivos**: Laura & Guilherme
- **Evento**: Jantar de Casamento
- **Data e Horário**: 24 de Novembro às 18h30
- **Local**: Churrascaria Carro de Boi
- **Google Maps**: [Abrir Localização no Google Maps](https://maps.app.goo.gl/qPtjUUcLbGxwZCNV7)
- **Valores da Churrascaria**:
  - Pacote Jantar: **R$ 95,00** por pessoa
  - Crianças (5 a 8 anos): **R$ 45,00** (sem bebida) | **R$ 60,00** (com bebida)
  - Incluso no Pacote: Água, refrigerante e três tipos de suco
- **Mensagem de Fechamento**: Esperamos por você!

*Nota: Todas as informações e links estão centralizados de forma modular no arquivo [`js/config.js`](js/config.js) para fácil personalização.*

---

## 🚀 Funcionalidades

1. **Design Mobile-First**: Perfeito para visualização no WhatsApp, Instagram e qualquer tamanho de tela de smartphone, tablet ou desktop.
2. **Cronômetro Regressivo Dinâmico**: Contagem regressiva em tempo real até o momento do evento.
3. **Integração com Calendários**:
   - Botão para adicionar direto ao **Google Agenda**.
   - Download de arquivo `.ics` para **Apple Calendar (iPhone/Mac)** e **Outlook**.
4. **Navegação GPS**: Links diretos para rotas no **Google Maps** e **Waze**.
5. **Formulário de RSVP Inteligente**:
   - Confirmação "Sim, estarei presente!" ou "Não poderei ir".
   - Seletor de quantidade de acompanhantes (com campos de texto dinâmicos para o nome completo de cada acompanhante).
   - Campo para mensagens carinhosas e restrições alimentares.
   - Validações em tempo real e bloqueio contra envios duplos.
   - **Modo de Demonstração / Teste**: Quando a URL do Google Apps Script ainda não estiver configurada, o formulário funciona em modo de simulação com feedback visual instantâneo.
   - **Modo Produção**: Envio via `POST` com tratamento de CORS e gravação segura na planilha do Google Sheets.

---

## 📊 Como Conectar ao Google Sheets

Consulte o passo a passo completo no arquivo:
👉 [**google-apps-script/INSTRUCOES_APPS_SCRIPT.md**](google-apps-script/INSTRUCOES_APPS_SCRIPT.md)

### Resumo rápido:
1. Abra uma nova planilha no [Google Sheets](https://sheets.new).
2. Acesse **Extensões** > **Apps Script**.
3. Cole o código do arquivo [`google-apps-script/Code.gs`](google-apps-script/Code.gs).
4. Clique em **Implantar** > **Nova Implantação** > Tipo: **App da Web** > Acesso: **Qualquer pessoa**.
5. Copie a URL do Web App gerada e cole em `appsScriptUrl` no arquivo [`js/config.js`](js/config.js).

---

## 📁 Estrutura de Arquivos

```
convitecasamento/
├── assets/
│   ├── favicon.svg          # Ícone para navegadores e compartilhamento
│   ├── monogram-L.svg       # Vetor original da letra L do PDF
│   └── monogram-G.svg       # Vetor original da letra G do PDF
├── css/
│   └── style.css            # Folha de estilo com tokens de cor e layout responsivo
├── js/
│   ├── config.js            # Configuração centralizada do evento e endpoint
│   └── app.js               # Lógica de countdown, agenda, formulário e integração
├── google-apps-script/
│   ├── Code.gs              # Backend do Google Apps Script com LockService
│   └── INSTRUCOES_APPS_SCRIPT.md # Manual passo a passo para publicação
├── index.html               # Página principal do convite
└── README.md                # Documentação do projeto
```

---

## 🌐 Como Publicar o Convite na Internet

Você pode hospedar este convite gratuitamente em qualquer um dos serviços abaixo:

- **GitHub Pages**: Crie um repositório, envie os arquivos e ative o Pages nas configurações.
- **Vercel**: Arraste e solte a pasta ou conecte ao repositório GitHub.
- **Netlify**: Arraste a pasta do projeto diretamente no painel do Netlify Drop.
- **Cloudflare Pages**: Conecte ao GitHub e publique instantaneamente.
