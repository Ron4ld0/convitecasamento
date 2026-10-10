/**
 * GOOGLE APPS SCRIPT — BACKEND PARA CONFIRMAÇÃO DE PRESENÇA (RSVP)
 * Casamento: Laura & Guilherme
 * 
 * Este script recebe as confirmações enviadas pelo convite digital
 * e as grava em uma aba chamada "Confirmacoes" no Google Sheets.
 */

// Nome da aba onde serão salvas as confirmações
const SHEET_NAME = "Confirmacoes";

// Cabeçalhos que serão criados automaticamente se a aba for nova
const HEADERS = [
  "ID",
  "Data da Resposta",
  "Nome do Convidado",
  "Presença Confirmada",
  "Qtd Acompanhantes",
  "Nomes dos Acompanhantes",
  "Observações",
  "Data do Evento"
];

/**
 * Função para testar se o Web App está online via requisição GET
 */
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "online",
    message: "Endpoint de RSVP do Casamento de Laura & Guilherme ativo.",
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Função principal que recebe as confirmações via POST
 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  
  // Aguarda até 10 segundos para obter o bloqueio contra concorrência
  try {
    lock.waitLock(10000);
  } catch (error) {
    return createJsonResponse({
      status: "error",
      message: "O servidor está ocupado processando outra resposta. Por favor, tente novamente em alguns segundos."
    });
  }

  try {
    // 1. Parsing dos dados recebidos (suporta JSON no corpo ou parâmetros urlencoded/form)
    let data = {};
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        // Fallback para form-urlencoded se não for JSON puro
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    // 2. Validação dos campos obrigatórios
    const nomeConvidado = (data.nome_convidado || data.name || "").toString().trim();
    const presencaConfirmada = (data.presenca_confirmada || data.confirmed || "").toString().trim();
    const qtdAcompanhantes = parseInt(data.quantidade_acompanhantes || data.companions_count || 0, 10) || 0;
    const nomesAcompanhantes = (data.nomes_acompanhantes || data.companions_names || "").toString().trim();
    const observacoes = (data.observacoes || data.notes || "").toString().trim();

    if (!nomeConvidado) {
      return createJsonResponse({
        status: "error",
        message: "O nome completo do convidado é obrigatório."
      });
    }

    if (!presencaConfirmada) {
      return createJsonResponse({
        status: "error",
        message: "A confirmação de presença (Sim ou Não) é obrigatória."
      });
    }

    // 3. Acesso à planilha ativa
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);

    // Se a aba não existir, cria e formata os cabeçalhos
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      sheet.appendRow(HEADERS);
      
      // Formata a linha de cabeçalho
      const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#343733");
      headerRange.setFontColor("#FFFFFF");
      sheet.setFrozenRows(1);
    }

    // 4. Criação do registro
    const id = Utilities.getUuid().substring(0, 8).toUpperCase();
    const dataHoraAtual = Utilities.formatDate(new Date(), "America/Sao_Paulo", "dd/MM/yyyy HH:mm:ss");

    const row = [
      id,
      dataHoraAtual,
      nomeConvidado,
      presencaConfirmada,
      qtdAcompanhantes,
      nomesAcompanhantes,
      observacoes,
      "24/11 • 18h30"
    ];

    sheet.appendRow(row);

    // 5. Retorno de sucesso
    return createJsonResponse({
      status: "success",
      message: presencaConfirmada === "Sim" 
        ? "Presença confirmada com sucesso! Mal podemos esperar para celebrar com você."
        : "Agradecemos por nos avisar. Sentiremos sua falta!",
      id: id,
      convidado: nomeConvidado
    });

  } catch (err) {
    return createJsonResponse({
      status: "error",
      message: "Erro interno ao salvar os dados: " + err.toString()
    });
  } finally {
    // Libera a trava de concorrência
    lock.releaseLock();
  }
}

/**
 * Função auxiliar para gerar respostas em formato JSON com headers limpos
 */
function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Função utilitária para inicializar manualmente a planilha (opcional)
 * Você pode rodar esta função uma vez no editor do Apps Script para pré-criar a aba.
 */
function setupPlanilha() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  sheet.getRange(1, 1, 1, HEADERS.length)
    .setFontWeight("bold")
    .setBackground("#343733")
    .setFontColor("#FFFFFF");
  sheet.setFrozenRows(1);
  SpreadsheetApp.flush();
  Logger.log("Aba 'Confirmacoes' configurada com sucesso!");
}
