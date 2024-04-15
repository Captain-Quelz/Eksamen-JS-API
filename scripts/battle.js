// Globale variabler for å lagre Pokémon-data
let pokemons = [];

// Funksjon for å hente data for tre Pokémon
async function fetchPokemonData() {
    const pokemonNames = ['pikachu', 'bulbasaur', 'charmander'];
    const requests = pokemonNames.map(name =>
        fetch(`https://pokeapi.co/api/v2/pokemon/${name}`).then(response => response.json())
    );
    pokemons = await Promise.all(requests);
    displayPokemons();
}

// Funksjon for å vise Pokémon og la brukeren velge en for kampen
function displayPokemons() {
    const container = document.getElementById('pokemon-container');
    pokemons.forEach(pokemon => {
        const pokemonElement = document.createElement('div');
        pokemonElement.innerHTML = `
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
            <h3>${pokemon.name.toUpperCase()}</h3>
            <button onclick="selectPokemon('${pokemon.name}')">Velg</button>
        `;
        container.appendChild(pokemonElement);
    });
}

// Funksjon for å velge en Pokémon og starte en kamp
function selectPokemon(name) {
    const playerPokemon = pokemons.find(pokemon => pokemon.name === name);
    const enemyPokemon = pokemons[Math.floor(Math.random() * pokemons.length)];
    fight(playerPokemon, enemyPokemon);
}

// Simulerer kampen og bestemmer vinneren
function fight(playerPokemon, enemyPokemon) {
    const playerPower = playerPokemon.stats[1].base_stat + playerPokemon.stats[3].base_stat;
    const enemyPower = enemyPokemon.stats[1].base_stat + enemyPokemon.stats[3].base_stat;
    const result = playerPower >= enemyPower ? 'vunnet' : 'tapt';
    alert(`Du har ${result}! Din kraft: ${playerPower}, Motstanderens kraft: ${enemyPower}`);
}

// Kall denne funksjonen når siden lastes for å initiere spillet
window.onload = fetchPokemonData;
