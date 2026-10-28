/**
 * APLICAÇÃO DO CONVITE DE CASAMENTO — LAURA & GUILHERME
 * Lógica do frontend: Renderização dinâmica, Cronômetro, Agenda e RSVP
 */

document.addEventListener("DOMContentLoaded", () => {
  const config = window.WEDDING_CONFIG || {};

  // 1. Inicializa elementos da página e dados configuráveis
  initPageData(config);

  // 2. Inicializa o cronômetro regressivo
  initCountdown(config.event?.isoDate);

  // 3. Inicializa os links de calendário (Google Calendar e iCal)
  initCalendarLinks(config);

  // 4. Inicializa o botão de cópia da chave Pix
  initPixCopy(config);

  // 5. Inicializa o formulário RSVP
  initRsvpForm(config);
});

/**
 * Preenche dados configuráveis na interface
 */
function initPageData(config) {
  // Configuração do Google Maps e Waze
  const mapsBtn = document.getElementById("btn-google-maps");
  const wazeBtn = document.getElementById("btn-waze");
  if (mapsBtn && config.venue?.googleMapsUrl) mapsBtn.href = config.venue.googleMapsUrl;
  if (wazeBtn && config.venue?.wazeUrl) wazeBtn.href = config.venue.wazeUrl;
}

/**
 * Cronômetro Regressivo para o Evento
 */
function initCountdown(targetIsoDate) {
  const daysEl = document.getElementById("cd-days");
  const hoursEl = document.getElementById("cd-hours");
  const minutesEl = document.getElementById("cd-minutes");
  const secondsEl = document.getElementById("cd-seconds");

  if (!daysEl || !targetIsoDate) return;

  const targetDate = new Date(targetIsoDate).getTime();

  function update() {
    const now = new Date().getTime();
    const diff = targetDate - now;

    if (diff <= 0) {
      daysEl.textContent = "00";
      hoursEl.textContent = "00";
      minutesEl.textContent = "00";
      secondsEl.textContent = "00";
      const title = document.querySelector(".countdown-title");
      if (title) title.textContent = "Hoje é o grande dia!";
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, "0");
    hoursEl.textContent = String(hours).padStart(2, "0");
    minutesEl.textContent = String(minutes).padStart(2, "0");
    secondsEl.textContent = String(seconds).padStart(2, "0");
  }

  update();
  setInterval(update, 1000);
}

/**
 * Geração de Links de Calendário (Google Agenda e Arquivo .ics)
 */
function initCalendarLinks(config) {
  const gcalBtn = document.getElementById("btn-add-gcal");
  const icalBtn = document.getElementById("btn-add-ical");

  const startIso = config.event?.isoDate || "2026-11-24T18:30:00";
  const startDate = new Date(startIso);
  const durationMin = config.event?.calendarDurationMinutes || 240;
  const endDate = new Date(startDate.getTime() + durationMin * 60000);

  function formatGCalDate(d) {
    return d.toISOString().replace(/-|:|\.\d\d\d/g, "");
  }

  const title = encodeURIComponent(`Jantar de Casamento — ${config.couple?.fullTitle || "Laura & Guilherme"}`);
  const details = encodeURIComponent("Junte-se a nós para celebrar o nosso amor com um delicioso jantar!");
  const location = encodeURIComponent(`${config.venue?.name || "Churrascaria Carro de Boi"}`);
  const dates = `${formatGCalDate(startDate)}/${formatGCalDate(endDate)}`;

  if (gcalBtn) {
    gcalBtn.href = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
    gcalBtn.target = "_blank";
  }

  if (icalBtn) {
    icalBtn.addEventListener("click", (e) => {
      e.preventDefault();
      downloadIcsFile({
        title: `Jantar de Casamento — ${config.couple?.fullTitle || "Laura & Guilherme"}`,
        description: "Junte-se a nós para celebrar o nosso amor com um delicioso jantar!",
        location: config.venue?.name || "Churrascaria Carro de Boi",
        startDate,
        endDate
      });
    });
  }
}

/**
 * Cria e baixa o arquivo iCal (.ics) para iPhone/Mac/Outlook
 */
function downloadIcsFile({ title, description, location, startDate, endDate }) {
  function formatIcsDate(date) {
    return date.toISOString().replace(/-|:|\.\d\d\d/g, "");
  }

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Casamento Laura e Guilherme//PT-BR",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    `DTSTART:${formatIcsDate(startDate)}`,
    `DTEND:${formatIcsDate(endDate)}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "jantar-casamento-laura-e-guilherme.ics";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Função Global para Copiar a Chave Pix com Feedback Visual Instantâneo
 */
window.copyPixKey = function (event) {
  if (event && event.stopPropagation) event.stopPropagation();

  const config = window.WEDDING_CONFIG || {};
  const pixKey = config.pix?.keyDisplay || "117.374.344-82";
  const copyBtn = document.getElementById("btn-copy-pix");
  const copyText = document.getElementById("copy-btn-text");
  const toast = document.getElementById("pix-toast");

  // 1. Feedback visual imediato e responsivo (Optimistic UI)
  if (copyBtn) copyBtn.classList.add("copied");
  if (copyText) copyText.textContent = "✓ Chave Copiada!";
  if (toast) toast.classList.add("show");

  clearTimeout(window._pixCopyTimeout);
  window._pixCopyTimeout = setTimeout(() => {
    if (copyBtn) copyBtn.classList.remove("copied");
    if (copyText) copyText.textContent = "Copiar Chave";
    if (toast) toast.classList.remove("show");
  }, 3500);

  // 2. Cópia segura para a área de transferência
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(pixKey).catch(() => fallbackCopy(pixKey));
  } else {
    fallbackCopy(pixKey);
  }
};

function fallbackCopy(text) {
  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const res = document.execCommand("copy");
    document.body.removeChild(textArea);
    return res;
  } catch (e) {
    return false;
  }
}

/**
 * Inicialização de Eventos da Chave Pix
 */
function initPixCopy(config) {
  const copyBox = document.getElementById("pix-copy-box");
  const copyBtn = document.getElementById("btn-copy-pix");

  if (copyBtn) {
    copyBtn.addEventListener("click", (e) => window.copyPixKey(e));
  }

  if (copyBox) {
    copyBox.addEventListener("click", (e) => window.copyPixKey(e));
    copyBox.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        window.copyPixKey(e);
      }
    });
  }
}

/**
 * Lógica do Formulário RSVP e Integração Google Apps Script
 */
function initRsvpForm(config) {
  const form = document.getElementById("rsvp-form");
  const attendanceRadios = document.querySelectorAll('input[name="attendance"]');
  const companionsSection = document.getElementById("companions-wrapper");
  const companionsSelect = document.getElementById("companions-count");
  const companionsList = document.getElementById("companions-inputs-list");
  const submitBtn = document.getElementById("btn-submit-rsvp");
  const submitText = document.getElementById("submit-text");
  const submitSpinner = document.getElementById("submit-spinner");
  const feedbackEl = document.getElementById("rsvp-feedback");
  const retryBtn = document.getElementById("btn-feedback-retry");

  let isSubmitting = false;

  // 1. Alterna visualização de acompanhantes conforme Sim/Não
  attendanceRadios.forEach((radio) => {
    radio.addEventListener("change", (e) => {
      const isYes = e.target.value === "Sim";
      if (isYes && config.rsvp?.allowCompanions) {
        companionsSection.style.display = "block";
      } else {
        companionsSection.style.display = "none";
        if (companionsSelect) companionsSelect.value = "0";
        if (companionsList) companionsList.innerHTML = "";
      }
    });
  });

  // 2. Gera campos dinâmicos conforme quantidade de acompanhantes
  if (companionsSelect && companionsList) {
    companionsSelect.addEventListener("change", (e) => {
      const count = parseInt(e.target.value, 10) || 0;
      renderCompanionInputs(count, companionsList);
    });
  }

  function renderCompanionInputs(count, container) {
    container.innerHTML = "";
    if (count <= 0) return;

    for (let i = 1; i <= count; i++) {
      const field = document.createElement("div");
      field.className = "companion-field-item";
      field.innerHTML = `
        <label for="companion_name_${i}">Nome completo do acompanhante ${i}:</label>
        <input 
          type="text" 
          id="companion_name_${i}" 
          name="companion_name_${i}" 
          class="form-input" 
          placeholder="Ex: Maria Clara Silva" 
          required
        />
      `;
      container.appendChild(field);
    }
  }

  // 3. Submissão do Formulário
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Coleta dados
    const guestName = (document.getElementById("guest-name")?.value || "").trim();
    const attendanceRadio = document.querySelector('input[name="attendance"]:checked');
    const attendanceValue = attendanceRadio ? attendanceRadio.value : "";
    const companionsCount = attendanceValue === "Sim" 
      ? parseInt(companionsSelect?.value || 0, 10) 
      : 0;
    
    // Coleta nomes dos acompanhantes
    const companionNames = [];
    if (attendanceValue === "Sim" && companionsCount > 0) {
      for (let i = 1; i <= companionsCount; i++) {
        const input = document.getElementById(`companion_name_${i}`);
        if (input && input.value.trim()) {
          companionNames.push(input.value.trim());
        }
      }
    }

    const notes = (document.getElementById("guest-notes")?.value || "").trim();

    // Validações
    if (!guestName) {
      alert("Por favor, informe seu nome completo.");
      document.getElementById("guest-name")?.focus();
      return;
    }

    if (!attendanceValue) {
      alert("Por favor, selecione se você poderá ou não comparecer.");
      return;
    }

    if (attendanceValue === "Sim" && companionsCount > 0 && companionNames.length < companionsCount) {
      alert("Por favor, preencha o nome de todos os acompanhantes selecionados.");
      return;
    }

    // Prepara payload
    const payload = {
      nome_convidado: guestName,
      presenca_confirmada: attendanceValue,
      quantidade_acompanhantes: companionsCount,
      nomes_acompanhantes: companionNames.join(", "),
      observacoes: notes,
      origem: "Convite Digital Web",
      timestamp: new Date().toISOString()
    };

    // Atualiza estado da UI para enviando
    isSubmitting = true;
    submitBtn.disabled = true;
    submitText.textContent = "Enviando confirmação...";
    submitSpinner.style.display = "inline-block";
    hideFeedback();

    const scriptUrl = config.rsvp?.appsScriptUrl;
    const isMock = !scriptUrl || scriptUrl.includes("COLE_AQUI") || scriptUrl.includes("YOUR_");

    try {
      if (isMock) {
        // Simulação com pequeno delay para testes de interface
        await new Promise((resolve) => setTimeout(resolve, 900));
        console.log("[RSVP Mock] Dados recebidos com sucesso:", payload);
        showSuccess({
          guestName,
          attendance: attendanceValue,
          message: attendanceValue === "Sim"
            ? "Presença confirmada com sucesso! Mal podemos esperar para celebrar com você."
            : "Agradecemos por nos avisar. Sentiremos sua falta!"
        });
      } else {
        // Envio real ao Google Apps Script
        // Utilizamos text/plain para contornar preflight CORS no Apps Script
        const response = await fetch(scriptUrl, {
          method: "POST",
          headers: {
            "Content-Type": "text/plain;charset=utf-8"
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error(`Erro na comunicação com o servidor (${response.status})`);
        }

        const data = await response.json();

        if (data.status === "success") {
          showSuccess({
            guestName,
            attendance: attendanceValue,
            isMock: false,
            message: data.message
          });
        } else {
          throw new Error(data.message || "Erro retornado pelo servidor.");
        }
      }
    } catch (err) {
      console.error("[RSVP Error]:", err);
      showError(err.message || "Não foi possível enviar sua confirmação no momento. Verifique sua conexão e tente novamente.");
    } finally {
      isSubmitting = false;
      submitBtn.disabled = false;
      submitText.textContent = "Confirmar Presença";
      submitSpinner.style.display = "none";
    }
  });

  // Botão de tentar novamente em caso de erro
  if (retryBtn) {
    retryBtn.addEventListener("click", () => {
      hideFeedback();
    });
  }

  function showSuccess({ guestName, attendance, message }) {
    form.style.display = "none";
    feedbackEl.className = "form-feedback success";
    feedbackEl.style.display = "block";

    const titleEl = document.getElementById("feedback-title");
    const textEl = document.getElementById("feedback-text");
    const noteEl = document.getElementById("feedback-note");

    if (titleEl) {
      titleEl.textContent = attendance === "Sim" ? "Presença Confirmada!" : "Agradecemos o Aviso!";
    }

    if (textEl) {
      textEl.innerHTML = `Olá, <strong>${escapeHtml(guestName)}</strong>! ${message || "Sua confirmação foi registrada com sucesso."}`;
    }

    if (noteEl) {
      noteEl.innerHTML = `<small style="color: #4b7352; display:block; margin-top:8px;">Seus dados foram salvos com sucesso.</small>`;
    }

    feedbackEl.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function showError(msg) {
    feedbackEl.className = "form-feedback error";
    feedbackEl.style.display = "block";

    const titleEl = document.getElementById("feedback-title");
    const textEl = document.getElementById("feedback-text");
    const noteEl = document.getElementById("feedback-note");

    if (titleEl) titleEl.textContent = "Ops! Não foi possível registrar";
    if (textEl) textEl.textContent = msg;
    if (noteEl) noteEl.textContent = "Por favor, tente novamente ou entre em contato diretamente com os noivos.";

    feedbackEl.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function hideFeedback() {
    feedbackEl.style.display = "none";
  }

  function escapeHtml(string) {
    const div = document.createElement("div");
    div.textContent = string;
    return div.innerHTML;
  }
}
