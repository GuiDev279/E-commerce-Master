const botoesAddCarrinho = document.querySelectorAll('.adicionar-ao-carrinho');

botoesAddCarrinho.forEach(botao => {
    botao.addEventListener('click', (evento) => {
        const elementoProduto = evento.target.closest(".produto");
        const produtoId = elementoProduto.dataset.id;
        const produtoNome = elementoProduto.querySelector(".nome").textContent;
        const produtoImagem = elementoProduto.querySelector("img").getAttribute("src");
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
        atualizarCarrinhoETabela();
    });
});

function salvarProdutosNoCarrinho(carrinho) {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

function obterProdutosDoCarrinho() {
    try {
        const produtos = localStorage.getItem("carrinho");
        return produtos ? JSON.parse(produtos) : [];
    } catch (error) {
        console.error("Erro ao obter produtos do carrinho:", error);
        return [];
    }
}

function atualizarContadorDoCarrinho() {
    const produtos = obterProdutosDoCarrinho();
    let total = 0;

    produtos.forEach(produto => {
        total += produto.quantidade;
    });

    document.getElementById('contador-carrinho').textContent = total;
}

function renderizarTabelaDoCarrinho() {
    const produtos = obterProdutosDoCarrinho();
    const corpoTabela = document.querySelector("#modal-1-content table tbody");
    corpoTabela.innerHTML = "";

    produtos.forEach(produto => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td class="td-produto">
                <img src="${produto.imagem}" alt="${produto.nome}">
            </td>
            <td>${produto.nome}</td>
            <td class="td-preco-unitario">R$ ${produto.preco.toFixed(2).replace(".", ",")}</td>
            <td class="td-quantidade">
                <input class="input-quantidade" type="number" data-id="${produto.id}" value="${produto.quantidade}" min="1">
            </td>
            <td class="td-preco-total">R$ ${(produto.preco * produto.quantidade).toFixed(2).replace(".", ",")}</td>
            <td>
                <button class="btn-remover" data-id="${produto.id}" id="deletar"></button>
            </td>
        `;
        corpoTabela.appendChild(tr);
    });

    // Event listeners dentro da função renderizarTabelaDoCarrinho
    corpoTabela.querySelectorAll('.btn-remover').forEach(button => {
        button.addEventListener('click', evento => {
            const id = evento.target.dataset.id;
            removerProdutoDoCarrinho(id);
        });
    });

    corpoTabela.querySelectorAll('.input-quantidade').forEach(input => {
        input.addEventListener('input', evento => {
            const produtoId = evento.target.dataset.id;
            const novaQuantidade = parseInt(evento.target.value);
            atualizarQuantidadeDoCarrinho(produtoId, novaQuantidade);
        });
    });
}

function atualizarQuantidadeDoCarrinho(produtoId, novaQuantidade) {
    const produtos = obterProdutosDoCarrinho();
    const produto = produtos.find(produto => produto.id === produtoId);

    if (produto) {
        produto.quantidade = novaQuantidade;
        salvarProdutosNoCarrinho(produtos);
        atualizarCarrinhoETabela();
    }
}

function removerProdutoDoCarrinho(id) {
    const produtos = obterProdutosDoCarrinho();
    const carrinhoAtualizado = produtos.filter(produto => produto.id !== id);
    salvarProdutosNoCarrinho(carrinhoAtualizado);
    atualizarCarrinhoETabela();
}

function atualizarValorTotalCarrinho() {
    const produtos = obterProdutosDoCarrinho();
    let total = 0;

    produtos.forEach(produto => {
        total += produto.preco * produto.quantidade;
    });

    document.querySelector('.total-carrinho').textContent = `Total: R$ ${total.toFixed(2).replace(".", ",")}`;
}

function atualizarCarrinhoETabela() {
    atualizarContadorDoCarrinho();
    renderizarTabelaDoCarrinho();
    atualizarValorTotalCarrinho();
}

atualizarCarrinhoETabela();