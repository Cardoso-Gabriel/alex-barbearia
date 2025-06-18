function salvarServicos() {
    const servicosSelecionados = [];
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');

    checkboxes.forEach((checkbox) => {
        if (checkbox.checked) {
            const texto = checkbox.parentElement.textContent.trim();
            const nome = texto.split('R$')[0].trim();
            const preco = parseFloat(texto.split('R$')[1].replace(',', '.'));

            // Aqui você pode definir o tempo de cada serviço manualmente, baseado no nome
            let tempo = 0;
            if (nome.includes('CORTE')) tempo = 30;
            else if (nome.includes('BARBA') || nome.includes('PEZINHO') || nome.includes('SOMBRACELHA') || nome.includes('LIMPEZA') || nome.includes('HIDRATAÇÃO')) tempo = 15;
            else if (nome.includes('LUZES') || nome.includes('PLATINADO') || nome.includes('SELAGEM') || nome.includes('ALISAMENTO')) tempo = 45;
            else tempo = 20;  // Tempo padrão se quiser

            servicosSelecionados.push({
                nome: nome,
                preco: preco,
                tempo: tempo
            });
        }
    });

    if (servicosSelecionados.length === 0) {
        alert('Por favor, selecione pelo menos um serviço antes de continuar.');
        return;
    }

    localStorage.setItem('servicosSelecionados', JSON.stringify(servicosSelecionados));

    // Ir para a página do barbeiro
    window.location.href = 'barbeiro.html';
}
