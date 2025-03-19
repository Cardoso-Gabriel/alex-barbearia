function selecionarImagem(imgClicada, nomeId) {
    // Seleciona todas as imagens e remove a classe "ativa"
    document.querySelectorAll('.imagem').forEach(img => img.classList.remove('ativa'));
    // Seleciona todos os nomes e reseta a cor para preto
    document.querySelectorAll('.nome').forEach(nome => nome.style.color = "#000");

    // Adiciona a classe "ativa" apenas à imagem clicada
    imgClicada.classList.add('ativa');

    // Muda a cor do nome associado
    document.getElementById(nomeId).style.color = "#F2E8D5";
}