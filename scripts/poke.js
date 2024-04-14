const apiUrl = 'https://pokeapi.co/api/v2/pokemon';
let allPokemons = [];
let displayedPokemons = [];
const allTypes = ["normal", "fire", "water", "electric", "grass", "ice", "fighting", "poison", "ground", "flying", "psychic", "bug", "rock", "ghost", "dragon", "dark", "steel", "fairy"];

// Funksjon for å hente 50 Pokémon fra APIet
async function fetchPokemons() {
    try {
        const response = await fetch(`${apiUrl}?limit=50`);
        const data = await response.json();
        const pokemonDetailsPromises = data.results.map(pokemon => fetch(pokemon.url).then(res => res.json()));
        allPokemons = await Promise.all(pokemonDetailsPromises);
        allPokemons = allPokemons.map(p => ({
            name: p.name,
            image: p.sprites.front_default,
            types: p.types.map(t => t.type.name)
        }));
        displayedPokemons = [...allPokemons];
        displayPokemons();
        createFilterButtons();
    } catch (error) {
        console.error('Failed to fetch Pokemons:', error);
    }
}

// Funksjon for å vise Pokémon på nettsiden
function displayPokemons() {
    const container = document.getElementById('pokemon-container');
    container.innerHTML = '';
    container.style.display = 'flex'; // Setter display til flex for å bruke flexbox layout
    container.style.flexWrap = 'wrap'; // Lar elementene bryte til neste linje
    container.style.justifyContent = 'space-around'; // Distribuerer plass mellom og rundt elementene
    container.style.alignItems = 'flex-start'; // Justerer elementer fra toppen

    displayedPokemons.forEach(pokemon => {
        const card = document.createElement('div');
        card.style.padding = '10px';
        card.style.margin = '5px';
        card.style.border = '1px solid #ccc';
        card.style.background = getBackgroundColor(pokemon.types[0]);
        card.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        card.style.borderRadius = '10px'; // Avrundede hjørner
        card.style.width = '150px'; // Fast bredde for kortene
        card.style.height = '250px'; // Fast høyde for kortene
        card.style.display = 'flex'; // Bruker flex layout innenfor hvert kort
        card.style.flexDirection = 'column'; // Elementene er organisert vertikalt
        card.style.alignItems = 'center'; // Sentrerer elementene horisontalt
        card.style.justifyContent = 'space-around'; // Distribuerer plass rundt elementene
        card.innerHTML = `
            <img src="${pokemon.image}" alt="${pokemon.name}" style="width:100px;height:100px;">
            <h3>${pokemon.name}</h3>
            <p>Type: ${pokemon.types.join(', ')}</p>
            <button onclick="savePokemon('${pokemon.name}')">Lagre</button>
            <button onclick="deletePokemon('${pokemon.name}')">Slett</button>
            <button onclick="editPokemon('${pokemon.name}')">Rediger</button>
        `;
        container.appendChild(card);
    });
}


// Funksjon for å opprette filterknapper for hver type
function createFilterButtons() {
    const buttonsContainer = document.getElementById('filter-buttons');
    buttonsContainer.innerHTML = ''; // Clear existing buttons
    allTypes.forEach(type => {
        const button = document.createElement('button');
        button.innerText = type.charAt(0).toUpperCase() + type.slice(1); // Capitalize the first letter
        button.onclick = () => filterPokemons(type);
        buttonsContainer.appendChild(button);
    });

    // Add a button to clear the filter and show all pokemons
    const allButton = document.createElement('button');
    allButton.innerText = 'Vis Alle';
    allButton.onclick = () => {
        displayedPokemons = [...allPokemons];
        displayPokemons();
    };
    buttonsContainer.appendChild(allButton);
}

// Funksjon for å filtrere Pokémon basert på type
function filterPokemons(type) {
    displayedPokemons = allPokemons.filter(pokemon => pokemon.types.includes(type));
    displayPokemons();
}

// Hjelpefunksjon for å velge bakgrunnsfarge basert på typen
function getBackgroundColor(type) {
    const typeColors = {
        fire: '#FDDFDF',
        water: '#DEF3FD',
        grass: '#DEFDE0',
        electric: '#FCF7DE',
        ice: '#E0FFFF',
        fighting: '#C2B280',
        poison: '#C8A2C8',
        ground: '#E0C068',
        flying: '#C6B7F5',
        psychic: '#FA92B2',
        bug: '#C2D21E',
        rock: '#B8A038',
        ghost: '#705898',
        dragon: '#7038F8',
        dark: '#705848',
        steel: '#B8B8D0',
        fairy: '#EE99AC',
        normal: '#C6C6A7'
    };
    return typeColors[type] || '#F5F5F5';
}

// Start funksjonen når vinduet lastes
window.onload = fetchPokemons;
