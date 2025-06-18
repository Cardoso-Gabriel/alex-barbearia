function selecionarImagem(imgClicada, nomeId) {
    // Limpa seleção anterior
    document.querySelectorAll('.imagem').forEach(img => img.classList.remove('ativa'));
    document.querySelectorAll('.nome').forEach(nome => nome.style.color = "#000");

    // Destaca a imagem clicada
    imgClicada.classList.add('ativa');
    document.getElementById(nomeId).style.color = "#F2E8D5";

    // Salva a escolha do barbeiro no LocalStorage
    const nomeFormatado = nomeId.charAt(0).toUpperCase() + nomeId.slice(1);
    localStorage.setItem('barbeiroSelecionado', nomeFormatado);
}

// Esta função vai ser chamada no clique do botão
function confirmarBarbeiro() {
    const barbeiro = localStorage.getItem('barbeiroSelecionado');

    if (!barbeiro) {
        alert('Por favor, selecione um barbeiro antes de continuar.');
        return;
    }

    // Agora sim: redireciona para o calendário
    window.location.href = 'calendario.html';
}
