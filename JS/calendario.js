const calendar = document.getElementById('calendar');
const monthYear = document.getElementById('monthYear');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');
const timeSlotsContainer = document.getElementById('timeSlots');
const selectedInfo = document.getElementById('selectedInfo');
const reserveBtn = document.getElementById('reserveBtn');
const summaryDiv = document.getElementById('summary');
const clientNameInput = document.getElementById('clientName');

let currentDate = new Date();
let selectedDay = null;
let selectedTime = null;

// Carrega reservas antigas (se tiver)
let reservas = JSON.parse(localStorage.getItem('reservas')) || {};

function formatDateKey(date) {
  return date.toISOString().split('T')[0];
}

function renderCalendar(date) {
  const oldDays = document.querySelectorAll('.day, .empty');
  oldDays.forEach(day => day.remove());

  const options = { month: 'long', year: 'numeric' };
  monthYear.textContent = date.toLocaleDateString('pt-BR', options);

  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  const startDay = firstDay.getDay();
  const totalDays = lastDay.getDate();

  for (let i = 0; i < startDay; i++) {
    const emptyCell = document.createElement('div');
    emptyCell.classList.add('empty');
    calendar.appendChild(emptyCell);
  }

  for (let day = 1; day <= totalDays; day++) {
    const dayCell = document.createElement('div');
    dayCell.classList.add('day');
    dayCell.textContent = day;

    if (selectedDay &&
        selectedDay.getDate() === day &&
        selectedDay.getMonth() === date.getMonth() &&
        selectedDay.getFullYear() === date.getFullYear()) {
      dayCell.classList.add('selected');
    }

    dayCell.addEventListener('click', () => {
      selectedDay = new Date(date.getFullYear(), date.getMonth(), day);
      selectedTime = null;
      summaryDiv.style.display = 'none';
      renderCalendar(currentDate);
      renderTimeSlots();
      updateReserveButton();
      showSelected();
    });

    calendar.appendChild(dayCell);
  }
}

function generateTimeSlots() {
  const slots = [];
  for (let hour = 8; hour <= 18; hour++) {
    for (let min of [0, 15, 30, 45]) {
      if (hour === 18 && min > 0) continue;
      slots.push(`${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`);
    }
  }
  return slots;
}

function renderTimeSlots() {
  timeSlotsContainer.innerHTML = '';

  if (!selectedDay) {
    timeSlotsContainer.textContent = 'Selecione um dia no calendário acima.';
    reserveBtn.disabled = true;
    return;
  }

  const slots = generateTimeSlots();
  const dateKey = formatDateKey(selectedDay);
  const reservasDoDia = reservas[dateKey] || {};
  const barbeiro = localStorage.getItem('barbeiroSelecionado');

  slots.forEach(time => {
    const slotDiv = document.createElement('div');
    slotDiv.classList.add('time-slot');
    slotDiv.textContent = time;

    // Bloqueia horários já reservados para o barbeiro
    if (reservasDoDia[time] && reservasDoDia[time].barbeiro === barbeiro) {
      slotDiv.style.backgroundColor = '#ccc';
      slotDiv.style.pointerEvents = 'none';
      slotDiv.title = `Reservado por ${reservasDoDia[time].cliente}`;
    } else if (selectedTime === time) {
      slotDiv.classList.add('selected');
    }

    if (!slotDiv.style.pointerEvents) {
      slotDiv.addEventListener('click', () => {
        selectedTime = time;
        renderTimeSlots();
        updateReserveButton();
        showSelected();
        summaryDiv.style.display = 'none';
      });
    }

    timeSlotsContainer.appendChild(slotDiv);
  });

  updateReserveButton();
}

function showSelected() {
  if (!selectedDay || !selectedTime) {
    selectedInfo.textContent = '';
    return;
  }
  selectedInfo.textContent = `Dia: ${selectedDay.toLocaleDateString('pt-BR')} | Horário: ${selectedTime}`;
}

function updateReserveButton() {
  reserveBtn.disabled = !selectedDay || !selectedTime || clientNameInput.value.trim() === '';
}

clientNameInput.addEventListener('input', updateReserveButton);

reserveBtn.addEventListener('click', () => {
  const clientName = clientNameInput.value.trim();
  if (!clientName) {
    alert('Por favor, digite seu nome antes de reservar.');
    return;
  }

  const servicos = JSON.parse(localStorage.getItem('servicosSelecionados')) || [];
  const barbeiro = localStorage.getItem('barbeiroSelecionado') || 'Não selecionado';

  let tempoTotal = servicos.reduce((soma, s) => soma + s.tempo, 0);
  const blocos = Math.ceil(tempoTotal / 15);
  const dateKey = formatDateKey(selectedDay);

  if (!reservas[dateKey]) reservas[dateKey] = {};

  const [hora, minuto] = selectedTime.split(':').map(Number);
  for (let i = 0; i < blocos; i++) {
    const novaHora = new Date(selectedDay.getFullYear(), selectedDay.getMonth(), selectedDay.getDate(), hora, minuto + (i * 15));
    const slot = `${String(novaHora.getHours()).padStart(2, '0')}:${String(novaHora.getMinutes()).padStart(2, '0')}`;

    reservas[dateKey][slot] = {
      barbeiro: barbeiro,
      cliente: clientName
    };
  }

  localStorage.setItem('reservas', JSON.stringify(reservas));

  let valorTotal = servicos.reduce((soma, s) => soma + s.preco, 0);
  let listaServicos = servicos.map(s => `- ${s.nome} (${s.tempo} min) - R$${s.preco}`).join('\n');

  const resumo = `
✅ Reserva Confirmada ✅

📅 Data: ${selectedDay.toLocaleDateString('pt-BR')}
🕒 Início: ${selectedTime}
👤 Barbeiro: ${barbeiro}
👥 Cliente: ${clientName}

📝 Serviços:
${listaServicos}

⏱️ Tempo total: ${tempoTotal} minutos
💰 Valor total: R$${valorTotal}
  `;

  summaryDiv.textContent = resumo;
  summaryDiv.style.display = 'block';

  selectedTime = null;
  clientNameInput.value = '';
  renderTimeSlots();
  updateReserveButton();
  showSelected();
});

prevMonthBtn.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar(currentDate);
  selectedDay = null;
  selectedTime = null;
  summaryDiv.style.display = 'none';
  renderTimeSlots();
  updateReserveButton();
  showSelected();
});

nextMonthBtn.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar(currentDate);
  selectedDay = null;
  selectedTime = null;
  summaryDiv.style.display = 'none';
  renderTimeSlots();
  updateReserveButton();
  showSelected();
});

renderCalendar(currentDate);
renderTimeSlots();
