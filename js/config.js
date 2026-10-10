/**
 * CONFIGURAÇÃO DO CONVITE DE CASAMENTO E INTEGRAÇÃO RSVP
 * 
 * Centralize aqui todas as informações do evento e a URL do endpoint do Google Apps Script.
 * Edite os campos conforme necessário.
 */

const WEDDING_CONFIG = {
  // Informações dos Noivos
  couple: {
    bride: "Laura",
    groom: "Guilherme",
    fullTitle: "Laura & Guilherme",
    tagline: "Junte-se a nós para o nosso jantar de casamento",
    closingMessage: "Esperamos por você!"
  },

  // Data e Horário
  event: {
    type: "Jantar de Casamento",
    displayDate: "24/11",
    displayTime: "18h30",
    fullDateText: "24 de Novembro",
    fullTimeText: "18h30",
    year: 2026, // Ano do evento (configurável)
    // Data ISO para o cronômetro regressivo e links de calendário (formato: AAAA-MM-DDTHH:mm:ss)
    isoDate: "2026-11-24T18:30:00",
    calendarDurationMinutes: 240 // Duração aproximada de 4 horas
  },

  // Local do Evento e Valores
  venue: {
    name: "Churrascaria Carro de Boi",
    subtitle: "Recepção e Jantar",
    address: "Churrascaria Carro de Boi",
    details: "Estacionamento com manobrista no local",
    // Links de navegação GPS
    googleMapsUrl: "https://maps.app.goo.gl/qPtjUUcLbGxwZCNV7",
    wazeUrl: "https://waze.com/ul?q=Churrascaria+Carro+de+Boi",
    pricing: {
      adultPackage: "R$ 95,00 p/ pessoa",
      kidsWithoutDrinks: "R$ 45,00 (5 a 8 anos - s/ bebida)",
      kidsWithDrinks: "R$ 60,00 (5 a 8 anos - c/ bebida)",
      includedDrinks: "Água, refrigerante e três tipos de suco"
    }
  },

  // Regras de Confirmação de Presença (RSVP)
  rsvp: {
    deadlineDate: "10 de Novembro",
    allowCompanions: true,
    maxCompanions: 4, // Limite máximo de acompanhantes selecionáveis no formulário
    
    /**
     * URL DO GOOGLE APPS SCRIPT
     * 
     * Cole aqui a URL gerada após publicar o Web App no Google Apps Script:
     * Exemplo: "https://script.google.com/macros/s/AKfycbx.../exec"
     * 
     * Enquanto estiver vazio ou com o placeholder, o formulário entrará
     * automaticamente em MODO DE SIMULAÇÃO para validação e testes locais.
     */
    appsScriptUrl: "https://script.google.com/macros/s/AKfycbxsq0UTMpVsnLgGzXt9vJy4_LD-45C8JMeqO-XMtFA0pZ31GwtcYfG16rNYotZ351Bd5g/exec"
  }
};

// Exporta globalmente para uso na aplicação
if (typeof window !== "undefined") {
  window.WEDDING_CONFIG = WEDDING_CONFIG;
}
