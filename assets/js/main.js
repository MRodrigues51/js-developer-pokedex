const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

const maxRecords = 151
const limit = 10
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">                
            </div>
            
        </li>
    `
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})

// Obtém a lista de Pokémon e adiciona um ouvinte de clique a ela
pokemonList.addEventListener("click", function(event) {
    const clickedPokemon = event.target.closest(".pokemon");
    if (clickedPokemon) {
        const pokemonName = clickedPokemon.querySelector(".name").textContent;
        console.log(pokemonName)
        
        // Use o nome do Pokémon para buscar mais detalhes e exibi-los
        fetchPokemonDetails(pokemonName)
            .then(details => {
                // Exiba os detalhes do Pokémon no modal
                displayPokemonDetails(details);
            })
            .catch(error => {
                console.error("Erro ao buscar detalhes do Pokémon:", error);
            });
    }
});

// Função para buscar detalhes do Pokémon da API
function fetchPokemonDetails(pokemonName) {
    // Aqui você deve passar o objeto com a propriedade 'url'
    return pokeApi.getPokemonDetail({ url: `https://pokeapi.co/api/v2/pokemon/${pokemonName}/` });
}


// Função para exibir os detalhes do Pokémon no modal
function displayPokemonDetails(pokemonDetails) {
    const modal = document.getElementById("pokemonDetailsModal");
    const modalContent = document.getElementById("modalContent");
    const closeModalButton = document.getElementById("closeModal");

    console.log(pokemonDetails)
    // modal.innerHTML = `<div class="pokemon ${pokemonDetails.type}"></div>`
    modalContent.innerHTML = `
    <div class="pokemonModal ${pokemonDetails.type}">
        <h2>${pokemonDetails.name}</h2>
        <ol class="types">        
            ${pokemonDetails.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}        
        </ol>
        <img src="${pokemonDetails.photo}" alt="${pokemonDetails.name}">
        <ol>${pokemonDetails.types.map(types => types ).join(' ')}</ol>
        <p>Abilities: ${pokemonDetails.abilities.join(", ")}</p>
        <p>Height: ${pokemonDetails.height}</p>
        <p>Weight: ${pokemonDetails.weight}</p>
        <!-- Outros detalhes do Pokémon -->
    </div>
    `;

    // Exibe o modal
    modal.style.display = "block";

    // Fecha o modal ao clicar no botão de fechar
    closeModalButton.addEventListener("click", function() {
        modal.style.display = "none";
    });
}
