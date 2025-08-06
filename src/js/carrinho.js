/*
Objetivo 1 - quando clicar no botao de adicionar ao carrinho temos que atualizar o contador, adicionar o produto no localStorage e atualizar o html do carrinho
	parte 1 - vamos adicionar +1 no icone do carrinho
		passo 1 - pegar os botões de adicionar ao carrinho do html
		passo 2 - adicionar uma evento de escuta nesses botões pra quando clicar disparar uma ação
		passo 3 - pega as informações do produto clicado e adicionar no localStorage
		passo 4 - atualizar o contador do carrinho de compras
		passo 5 - renderizar a tabela do carrinho de compras

Objetivo 2 - remover produtos do carrinho
	passo 1  - pegar o botão de deletar do html
	passo 2 - adicionar evento de escuta no tbody
	passo 3 - remover o produto do localStorage
	passo 4 - atualizar o html do carrinho retirando o produto

Objetivo 3 - Atualizar os valores do carrinho
	passo 1 - adicionar evento de escuta no input do tbody
	passo 2 - atualizar o valor total do produto
	passo 3 - atualizar o valor total do carrinho
*/

// Objetivo 1 - quando clicar no botao de adicionar ao carrinho temos que atualizar o contador, adicionar o produto no localStorage e atualizar o html do carrinho
//     parte 1 - vamos adicionar +1 no icone do carrinho
//         passo 1 - pegar os botões de adicionar ao carrinho do html

const botoesAdicionarAoCarrinho = document.querySelectorAll(".adicionar-ao-carrinho");

// passo 2 - adicionar uma evento de escuta nesses botões pra quando clicar disparar uma ação
botoesAdicionarAoCarrinho.forEach(botao => {
	botao.addEventListener("click", evento => {
		//passo 3 - pega as informações do produto clicado e adicionar no localStorage
		const elementoProduto = evento.target.closest(".produto");
		const produtoId = elementoProduto.dataset.id;
		const produtoNome = elementoProduto.querySelector(".nome").textContent;
		const produtoImagem = elementoProduto.querySelector("img").getAttribute("src");
		const produtoPreco = parseFloat(elementoProduto.querySelector(".preco").textContent.replace("R$ ", "").replace(".", "").replace(",", "."));

		//buscar a lista de produtos do localStorage
		const carrinho = obterProdutosDoCarrinho();
		//testar se o produto já existe no carrinho
		const existeProduto = carrinho.find(produto => produto.id === produtoId);

		//se existe produto, incrementar a quantidade
		if (existeProduto) {
			existeProduto.quantidade += 1;
		} else {
			//se não existe, adicionar o produto com quantidade 1
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
	const produtos = localStorage.getItem("carrinho");
	return produtos ? JSON.parse(produtos) : [];
}

//passo 4 - atualizar o contador do carrinho de compras
function atualizarContadorCarrinho() {
	const produtos = obterProdutosDoCarrinho();
	let total = 0;

	produtos.forEach(produto => {
		total += produto.quantidade;
	});

	document.getElementById("contador-carrinho").textContent = total;
}


// Refatoração: função mais enxuta, uso de template string para melhor legibilidade,
// e uso de map/join para evitar múltiplos reflows do DOM (melhora performance)
function renderizarTabelaDoCarrinho() {
	const produtos = obterProdutosDoCarrinho();
	const corpoTabela = document.querySelector("#modal-1-content table tbody");

	// Melhoria: gera todo o HTML de uma vez e insere, ao invés de vários appendChild
	corpoTabela.innerHTML = produtos.map(produto => `
		<tr>
			<td class="td-produto">
				<img src="${produto.imagem}" alt="${produto.nome}" />
			</td>
			<td>${produto.nome}</td>
			<td class="td-preco-unitario">R$ ${produto.preco.toFixed(2).replace('.', ',')}</td>
			<td class="td-quantidade">
				<input type="number" class="input-quantidade" data-id="${produto.id}" value="${produto.quantidade}" min="1" />
			</td>
			<td class="td-preco-total">R$ ${(produto.preco * produto.quantidade).toFixed(2).replace('.', ',')}</td>
			<td><button class="btn-remover" data-id="${produto.id}" id="deletar"></button></td>
		</tr>
	`).join("");
}

// Objetivo 2 - remover produtos do carrinho
//     passo 1  - pegar o botão de deletar do html

const corpoTabela = document.querySelector("#modal-1-content table tbody");

//passo 2 - adicionar evento de escuta no tbody
corpoTabela.addEventListener("click", evento => {
	if (evento.target.classList.contains("btn-remover")) {
		const id = evento.target.dataset.id;
		//passo 3 - remover o produto do localStorage
		removerProdutoDoCarrinho(id);
	}
});

//passo 1 - adicionar evento de escuta no input do tbody

// Refatoração: tratamento de quantidade inválida e atualização só se necessário
corpoTabela.addEventListener("input", evento => {
	if(evento.target.classList.contains("input-quantidade")){
		const id = evento.target.dataset.id;
		let novaQuantidade = parseInt(evento.target.value);
		if(isNaN(novaQuantidade) || novaQuantidade < 1) {
			novaQuantidade = 1;
			evento.target.value = 1; // Melhoria: impede valores inválidos
		}
		const produtos = obterProdutosDoCarrinho();
		const produto = produtos.find(produto => produto.id === id);
		if(produto && produto.quantidade !== novaQuantidade){
			produto.quantidade = novaQuantidade;
			salvarProdutosNoCarrinho(produtos);
			atualizarCarrinhoETabela();
		}
	}
});

// passo 4 - atualizar o html do carrinho retirando o produto

// Refatoração: função mais enxuta e sem variáveis desnecessárias
function removerProdutoDoCarrinho(id) {
	const carrinhoAtualizado = obterProdutosDoCarrinho().filter(produto => produto.id !== id);
	salvarProdutosNoCarrinho(carrinhoAtualizado);
	atualizarCarrinhoETabela();
}

// passo 3 - atualizar o valor total do carrinho

// Refatoração: uso de reduce para somar total, código mais limpo
function atualizarValorTotalCarrinho() {
	const produtos = obterProdutosDoCarrinho();
	const total = produtos.reduce((soma, produto) => soma + produto.preco * produto.quantidade, 0);
	document.querySelector("#total-carrinho").textContent = `Total: R$ ${total.toFixed(2).replace('.', ',')}`;
	document.querySelector("#subtotal-pedidos .valor").textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

function atualizarCarrinhoETabela(){
	atualizarContadorCarrinho();
	renderizarTabelaDoCarrinho();
	atualizarValorTotalCarrinho();
}

atualizarCarrinhoETabela();

async function calcularFrete(cep) {
	//TROQUE PELA SUA URL DO N8N
	const url = "https://guidev279.app.n8n.cloud/webhook-test/8b1fd8b0-d120-4bd6-9a9e-08acae963100";
	try {
		// Busca as medidas dos produtos do arquivo JSON
		const medidasResponse = await fetch('./js/medidas-produtos.json');
		const medidas = await medidasResponse.json();

		// Monta o array de produtos do carrinho com as medidas corretas
		const produtos = obterProdutosDoCarrinho();
		const products = produtos.map(produto => {
			// Procura as medidas pelo id do produto
			const medida = medidas.find(m => m.id === produto.id);
			return {
				quantity: produto.quantidade,
				height: medida ? medida.height : 4,
				length: medida ? medida.length : 30,
				width: medida ? medida.width : 25,
				weight: medida ? medida.weight : 0.25
			};
		});

		const resposta = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({cep, products}),
		});
		if (!resposta.ok) throw new Error("Erro ao calcular frete");
		const resultado = await resposta.json();
		// Supondo que o resultado tenha a propriedade frete
		return resultado.price;
	} catch (erro) {
		console.error("Erro ao calcular frete:", erro);
		return null;
	}
}

const btnCalcularFrete = document.getElementById("btn-calcular-frete");
const inputCep = document.getElementById("input-cep");
const valorFrete = document.getElementById("valor-frete");

btnCalcularFrete.addEventListener("click", async () => {
	const cep = inputCep.value.trim();

	// Validação do CEP
	const erroCep = document.querySelector(".erro");
	if (!validarCep(cep)) {
		erroCep.textContent = "CEP inválido.";
		erroCep.style.display = "block";
		return;
	}

	const valorFrete = await calcularFrete(cep);	
	const precoFormatado = valorFrete.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
	document.querySelector("#valor-frete .valor").textContent = precoFormatado;
	document.querySelector("#valor-frete").style.display = "flex";

	const totalCarrinhoElemento = document.querySelector("#total-carrinho");
	const valorTotalCarrinho = parseFloat(totalCarrinhoElemento.textContent.replace("Total: R$ ", "").replace('.', ',').replace(',', '.'));
	
	const totalComFrete = valorTotalCarrinho + valorFrete;
	const totalComFreteFormatado = totalComFrete.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
	totalCarrinhoElemento.textContent = `Total: R$ ${totalComFreteFormatado}`;
});


function validarCep(cep){
	const regexCep = /^[0-9]{5}-?[0-9]{3}$/;
	return regexCep.test(cep);
}
