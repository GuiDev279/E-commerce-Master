const botoesAddCarrinho = document.querySelectorAll('.adicionar-ao-carrinho')

botoesAddCarrinho.forEach(botao => {
    botao.addEventListener('click', (evento) => {

        // pega o elemento pai mais proximo com a classe "produto"
        const elementoProduto = evento.target.closest(".produto");

        // pega o id do produto do html
        const produtoId = elementoProduto.dataset.id;
        const produtoNome = elementoProduto.querySelector(".nome").textContent;
        const produtoImagem = elementoProduto.querySelector("img").getAttribute("src");

        // pega o preço do produto do html, tranforma de string para float e remove o "R$ " e troca a virgula por ponto
        const produtoPreco = parseFloat(elementoProduto.querySelector('.preco').textContent.replace("R$ ", "").replace(".", "").replace(",", "."));

        const carrinho = obterProdutosDoCarrinho();

        const existeProduto = carrinho.find(produto => produto.id === produtoId);

        if (existeProduto) {
            existeProduto.quantidade += 1;
        } else {
            const produto = {
                id: produtoId,
                nome: produtoNome,
                imagem: produtoImagem,
                preco: produtoPreco,
                quantidade: 1,
            };
            carrinho.push(produto);
        }
        salvarProdutosNoCarrinho(carrinho);
        atualizarContadorDoCarrinho();
        renderizarTabelaDoCarrinho();
    })
})

function salvarProdutosNoCarrinho(carrinho){
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

function obterProdutosDoCarrinho() {
    const produtos = localStorage.getItem("carrinho")
    return produtos ? JSON.parse(produtos) : [];
}


function atualizarContadorDoCarrinho(){
    const produtos = obterProdutosDoCarrinho();
    let total = 0;

    produtos.forEach(produto => {
        total += produto.quantidade
    })

    document.getElementById('contador-carrinho').textContent = total
}

atualizarContadorDoCarrinho();

function renderizarTabelaDoCarrinho(){
    const produtos = obterProdutosDoCarrinho();
    const corpoTabela = document.querySelector("#modal-1-content table tbody");
    corpoTabela.innerHTML = ""; // limpa tabela antes de redenrizar

    produtos.forEach(produto => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td class="td-produto">
                            <img src="${produto.imagem}" 
                            alt="${produto.nome}">
                        </td>
                        <td>${produto.nome}</td>
                        <td class="td-preco-unitario">R$ ${produto.preco.toFixed(2).replace("." , ",")}</td>
                        <td class="td-quantidade"><input type="number" value="${produto.quantidade}" min="1"></td>
                        <td class="td-preco-total">R$ ${produto.preco.toFixed(2).replace("." , ",")}</td>
                        <td><button class="btn-remover" data-id="${produto.id}" id="deletar"></button></td>`;
        corpoTabela.appendChild(tr);
    })
}

renderizarTabelaDoCarrinho()

const corpoTabela = document.querySelector("#modal-1-content table tbody");
corpoTabela.addEventListener('click', evento => {
    if(evento.target.classList.contains("btn-remover")){
        const id = evento.target.dataset.id;
        removerProdutoDoCarrinho(id);
    }
})

function removerProdutoDoCarrinho(id){
    const produtos = obterProdutosDoCarrinho();
    const carrinhoAtualizado = produtos.filter(produto => produto.id !== id);
    salvarProdutosNoCarrinho(carrinhoAtualizado);
    atualizarContadorDoCarrinho()
    renderizarTabelaDoCarrinho()
}