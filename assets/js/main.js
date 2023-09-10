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
        
        // Mais detalhes do pokemon por .name
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

  function displayPokemonDetails(pokemonDetails) {
    // Obtém elementos da DOM
    const modal = document.getElementById("pokemonDetailsModal");
    const modalContent = document.getElementById("modalContent");
    const closeModalButton = document.getElementById("closeModal");
  
    // Monta a estrutura HTML do modal
    const modalHTML = generateModalHTML(pokemonDetails);
    
    // Define o conteúdo do modal
    modalContent.innerHTML = modalHTML;
  
    // Exibe o modal
    modal.style.display = "block";
  
    // Fecha o modal
    closeModalButton.addEventListener("click", function() {
      modal.style.display = "none";
    });
  }
  
 
  function generateModalHTML(pokemonDetails) {

    // Soma os valores do array
      function somarArray(arr) {
        return arr.reduce((acumulador, valorAtual) => acumulador + valorAtual, 0);
      }

      // Soma os valores do array statsResult
      const soma = somarArray(pokemonDetails.statsResult);

      console.log(soma);
  
  
  
    // Gera a estrutura HTML do modal com base nos detalhes do Pokémon
    return `
      <div class="pokemonModal ${pokemonDetails.type}">
        <div class="firstContentModal">
          <div class="headerContentModal">        
            <span class="name">${pokemonDetails.name}</span>
            <span class="number">#${pokemonDetails.number}</span>
          </div>
          <span class="types">        
            ${generateTypeHTML(pokemonDetails.types)}        
          </span>
        </div>        
        <div class="imgContentModal">
          <img src="${pokemonDetails.photo}" alt="${pokemonDetails.name}">
        </div>
        <div class="containerContentModal">
          
          <nav>
            <ul>
              <li><a href="#" onclick="showContent('contentAbout', this); return false;" class="ativo">About</a></li>
              <li><a href="#" onclick="showContent('contentBaseStats', this); return false;">Base Stats</a></li>
              <li><a href="#" onclick="showContent('contentEvolution', this); return false;">Evolution</a></li>
              <li><a href="#" onclick="showContent('contentMoves', this); return false;">Moves</a></li>
            </ul>
          </nav>
      <div id="contentAbout" class="conteudo" style="display: block;">
        <span>Species <p> ${pokemonDetails.name}</p></span>
        <span>Height <p> ${pokemonDetails.height}</p></span>
        <span>Weight <p> ${pokemonDetails.weight}</p></span>
        <span>Abilities <p> ${pokemonDetails.abilities.join(", ")}</p></span>        
      </div>

      <div id="contentBaseStats" class="conteudo" style="display: none;">
        <div class="stats">
          <span>HP <p>${pokemonDetails.statsResult[0]}</p></span>
          <span>Attack <p>${pokemonDetails.statsResult[1]}</p></span>
          <span>Defense <p>${pokemonDetails.statsResult[2]}</p></span>
          <span>Sp. Atk <p>${pokemonDetails.statsResult[3]}</p></span>
          <span>Sp. Def <p>${pokemonDetails.statsResult[4]}</p></span>  
          <span>Speed <p>${pokemonDetails.statsResult[5]}</p></span>
          <span>Total <p>${soma}</p></span>
        </div>    
      </div>
      <div id="contentEvolution" class="conteudo" style="display: none;">Evolution</div>
      <div id="contentMoves" class="conteudo" style="display: none;">Moves</div>
        </div>
      </div>
    `;
  }
  
  function generateTypeHTML(types) {
    // HTML para os tipos do Pokémon
    return types.map(type => `<li class="type ${type}">${type}</li>`).join('');
  }

  function showContent(id, link) {
    const conteudos = document.querySelectorAll('.conteudo');
    const links = document.querySelectorAll('nav a'); // Seleciona todos os links de navegação
    
    // Remove a classe 'ativo' de todos os links
    links.forEach(navLink => {
        navLink.classList.remove('ativo');
    });

    conteudos.forEach(conteudo => {
        if (conteudo.id === id) {
            if (conteudo.style.display === 'block' || conteudo.style.display === '') {
                conteudo.style.display = 'none';
            } else {
                conteudo.style.display = 'block';
                link.classList.add('ativo');
            }
        } else {
            conteudo.style.display = 'none';
        }
    });
  }
