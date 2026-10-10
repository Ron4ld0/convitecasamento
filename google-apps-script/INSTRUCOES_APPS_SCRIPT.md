# Passo a Passo: Integração com Google Sheets e Google Apps Script

Este guia ensina como conectar o formulário de Confirmação de Presença (RSVP) do convite de **Laura & Guilherme** a uma planilha do Google Sheets.

---

## 1. Criar a Planilha no Google Sheets

1. Acesse [Google Sheets](https://sheets.new) com sua conta Google.
2. Dê um nome para a planilha, por exemplo: `Casamento Laura & Guilherme - RSVP`.

---

## 2. Acessar o Google Apps Script

1. No menu superior da planilha, clique em **Extensões** > **Apps Script**.
2. Uma nova aba será aberta com o editor de código.
3. Apague qualquer código existente no arquivo `Código.gs` (ou `Code.gs`).
4. Copie todo o conteúdo do arquivo [`Code.gs`](file:///google-apps-script/Code.gs) deste projeto e cole no editor.
5. Clique no ícone de salvar (ícone de disquete) ou pressione `Ctrl + S`.

---

## 3. (Opcional) Inicializar os Cabeçalhos

1. No topo do editor do Apps Script, selecione a função `setupPlanilha` no menu dropdown de funções.
2. Clique no botão **Executar**.
3. Na primeira execução, o Google pedirá autorização para acessar sua planilha.
   - Clique em **Revisar permissões**.
   - Escolha sua conta Google.
   - Clique em **Avançado** > **Acessar [Nome do Projeto] (não seguro)**.
   - Clique em **Permitir**.
4. Volte à planilha: você verá a aba **Confirmacoes** criada e formatada com os cabeçalhos!

---

## 4. Publicar o Web App

Esta etapa é crucial para gerar a URL pública que o frontend irá chamar.

1. No canto superior direito do editor Apps Script, clique no botão azul **Implantar** (ou **Deploy**) > **Nova implantação** (**New deployment**).
2. Na janela que se abrir, clique no ícone de engrenagem ao lado de "Selecionar tipo" e escolha **App da Web** (**Web app**).
3. Preencha as configurações exatamente como indicado abaixo:
   - **Descrição**: `RSVP Convite Casamento`
   - **Executar como** (**Execute as**): **Eu** (`seu-email@gmail.com`)
   - **Quem pode acessar** (**Who has access**): **Qualquer pessoa** (**Anyone**) — *essencial para que os convidados consigam confirmar sem fazer login*.
4. Clique em **Implantar**.
5. Se for solicitado, autorize novamente as permissões da implantação.
6. Copie a **URL do app da Web** gerada (algo parecido com `https://script.google.com/macros/s/AKfycb.../exec`).

---

## 5. Conectar a URL no Convite

1. Abra o arquivo [`js/config.js`](file:///js/config.js).
2. Localize a linha:
   ```javascript
   appsScriptUrl: "COLE_AQUI_A_URL_DO_SEU_GOOGLE_APPS_SCRIPT"
   ```
3. Substitua pelo link copiado, por exemplo:
   ```javascript
   appsScriptUrl: "https://script.google.com/macros/s/AKfycbx.../exec"
   ```
4. Salve o arquivo. Pronto! Toda confirmação enviada pelo convite digital será registrada instantaneamente em tempo real na sua planilha do Google Sheets.

---

## 6. Dicas e Resolução de Dúvidas

- **Modo de Simulação**: Enquanto a URL for o valor padrão (`COLE_AQUI_A_URL_DO_SEU_GOOGLE_APPS_SCRIPT`), o convite funcionará em modo interativo de teste local com alertas visuais, permitindo testar a experiência sem erros.
- **Atualizações no Script**: Se você modificar o código no Apps Script, lembre-se de clicar em **Implantar** > **Gerenciar implantações** > Editar > Criar **Nova versão** para que as mudanças tenham efeito no link do Web App.
