// Globale variabler for å lagre Pokémon-data
let pokemons = [];

// Definerer bakgrunnsfarger basert på Pokémon-typer
function getBackgroundColor(type) {
  const typeColors = {
    normal: "#A8A878",
    fire: "#F08030",
    water: "#6890F0",
    electric: "#F8D030",
    grass: "#78C850",
    ice: "#98D8D8",
    fighting: "#C03028",
    poison: "#A040A0",
    ground: "#E0C068",
    flying: "#A890F0",
    psychic: "#F85888",
    bug: "#A8B820",
    rock: "#B8A038",
    ghost: "#705898",
    dragon: "#7038F8",
    dark: "#705848",
    steel: "#B8B8D0",
    fairy: "#EE99AC",
  };
  return typeColors[type] || "#68A090"; // Returnerer en standardfarge hvis typen ikke finnes
}

// Funksjon for å hente data for tre Pokémon
async function fetchPokemonData() {
  const pokemonNames = ["pikachu", "bulbasaur", "charmander"];
  const requests = pokemonNames.map((name) =>
    fetch(`https://pokeapi.co/api/v2/pokemon/${name}`).then((response) =>
      response.json()
    )
  );
  pokemons = await Promise.all(requests);
  displayPokemons();
}

// Funksjon for å vise Pokémon på nettsiden
function displayPokemons() {
    const container = document.getElementById('pokemon-container');
    container.innerHTML = '';
    container.style.display = 'flex';
    container.style.flexWrap = 'wrap';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'flex-start';
    container.style.padding = '20px';
    container.style.gap = '20px';

    pokemons.forEach(pokemon => {
        const card = document.createElement('div');
        card.style.padding = '10px';
        card.style.margin = '10px';
        card.style.border = '1px solid #ccc';
        card.style.background = getBackgroundColor(pokemon.types[0].type.name); // Bruker den første typen som er listet
        card.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        card.style.borderRadius = '10px';
        card.style.width = '200px';
        card.style.minHeight = '300px';
        card.style.display = 'flex';
        card.style.flexDirection = 'column';
        card.style.alignItems = 'center';
        card.style.justifyContent = 'space-between';

        const pokemonName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
        const formattedTypes = pokemon.types.map(type => type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)).join(', ');

        card.innerHTML = `
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" style="max-width:90%;height:auto;margin-top:10px;">
            <h3>${pokemonName}</h3>
            <p>Type: ${formattedTypes}</p>
            <button onclick="selectPokemon('${pokemon.name}')">Velg</button>
        `;
        container.appendChild(card);
    });
}


// Definerer typeeffektivitet
const typeEffectiveness = {
  fire: {
    effectiveAgainst: ["grass", "ice", "bug"],
    weakAgainst: ["water", "rock", "fire"],
  },
  water: {
    effectiveAgainst: ["fire", "ground", "rock"],
    weakAgainst: ["electric", "grass"],
  },
  grass: {
    effectiveAgainst: ["water", "ground", "rock"],
    weakAgainst: ["fire", "ice", "poison"],
  },
  electric: {
    effectiveAgainst: ["water", "flying"],
    weakAgainst: ["ground", "grass"],
  },
  ice: {
    effectiveAgainst: ["grass", "ground", "flying"],
    weakAgainst: ["fire", "fighting", "rock"],
  },
  fighting: {
    effectiveAgainst: ["ice", "normal", "rock"],
    weakAgainst: ["flying", "psychic", "fairy"],
  },
  poison: {
    effectiveAgainst: ["grass", "fairy"],
    weakAgainst: ["ground", "psychic"],
  },
  ground: {
    effectiveAgainst: ["fire", "electric", "poison"],
    weakAgainst: ["water", "grass", "ice"],
  },
  flying: {
    effectiveAgainst: ["grass", "fighting", "bug"],
    weakAgainst: ["electric", "ice", "rock"],
  },
  psychic: {
    effectiveAgainst: ["fighting", "poison"],
    weakAgainst: ["bug", "ghost", "dark"],
  },
  bug: {
    effectiveAgainst: ["grass", "psychic", "dark"],
    weakAgainst: ["fire", "flying", "rock"],
  },
  rock: {
    effectiveAgainst: ["fire", "ice", "flying"],
    weakAgainst: ["water", "grass", "fighting"],
  },
  ghost: { effectiveAgainst: ["psychic", "ghost"], weakAgainst: ["dark"] },
  dragon: {
    effectiveAgainst: ["dragon"],
    weakAgainst: ["ice", "dragon", "fairy"],
  },
  dark: {
    effectiveAgainst: ["psychic", "ghost"],
    weakAgainst: ["fighting", "bug", "fairy"],
  },
  steel: {
    effectiveAgainst: ["ice", "rock", "fairy"],
    weakAgainst: ["fire", "fighting", "ground"],
  },
  fairy: {
    effectiveAgainst: ["fighting", "dragon", "dark"],
    weakAgainst: ["poison", "steel"],
  },
};

// Funksjon for å beregne kraft basert på typeeffektivitet
function calculateTypeEffectiveness(pokemon, opponent) {
  let effectiveness = 1; // Basiskraft hvis ingen effektivitetsregler gjelder
  const pokemonPrimaryType =
    pokemon.types.length > 0 ? pokemon.types[0].type.name : null;
  const opponentPrimaryType =
    opponent.types.length > 0 ? opponent.types[0].type.name : null;

  if (!pokemonPrimaryType || !opponentPrimaryType) {
    console.warn(
      "En eller begge Pokémon mangler gyldige typer.",
      pokemon,
      opponent
    );
    return effectiveness; // Returnerer grunneffektivitet hvis en nødvendig type mangler
  }

  const pokemonTypeRules = typeEffectiveness[pokemonPrimaryType];
  const opponentTypeRules = typeEffectiveness[opponentPrimaryType];

  if (!pokemonTypeRules || !opponentTypeRules) {
    console.warn(
      "En eller begge typer er ikke definert i effektivitetsreglene.",
      pokemonPrimaryType,
      opponentPrimaryType
    );
    return effectiveness;
  }

  if (pokemonTypeRules.effectiveAgainst.includes(opponentPrimaryType)) {
    effectiveness = 1.5; // 50% mer effektiv
  } else if (pokemonTypeRules.weakAgainst.includes(opponentPrimaryType)) {
    effectiveness = 0.5; // 50% mindre effektiv
  }

  return effectiveness;
}

// Funksjon for å velge en Pokémon og starte en kamp
function selectPokemon(name) {
  const playerPokemon = pokemons.find((pokemon) => pokemon.name === name);
  const enemyPokemon = pokemons[Math.floor(Math.random() * pokemons.length)];
  fight(playerPokemon, enemyPokemon);
}

// Simulerer kampen og bestemmer vinneren
function fight(playerPokemon, enemyPokemon) {
  const playerEffectiveness = calculateTypeEffectiveness(
    playerPokemon,
    enemyPokemon
  );
  const enemyEffectiveness = calculateTypeEffectiveness(
    enemyPokemon,
    playerPokemon
  );

  const playerPower =
    (playerPokemon.stats[1].base_stat + playerPokemon.stats[3].base_stat) *
    playerEffectiveness;
  const enemyPower =
    (enemyPokemon.stats[1].base_stat + enemyPokemon.stats[3].base_stat) *
    enemyEffectiveness;

  const result = playerPower >= enemyPower ? "vunnet" : "tapt";
  alert(
    `Du har ${result}! Din kraft: ${playerPower.toFixed(
      2
    )}, Motstanderens kraft: ${enemyPower.toFixed(2)}`
  );
}

// Funksjon for å vise Pokémon på nettsiden
function displayPokemons() {
  const container = document.getElementById("pokemon-container");
  container.innerHTML = "";
  container.style.display = "flex";
  container.style.flexWrap = "wrap";
  container.style.justifyContent = "center"; // Sentrerer kortene
  container.style.alignItems = "flex-start";
  container.style.padding = "20px"; // Padding rundt hele containeren
  container.style.gap = "20px"; // Fast gap mellom elementene, sikrer jevn avstand

  pokemons.forEach((pokemon) => {
    const card = document.createElement("div");
    card.style.padding = "10px";
    card.style.margin = "10px";
    card.style.border = "1px solid #ccc";
    card.style.background = getBackgroundColor(pokemon.types[0]); // Funksjonen må defineres for å returnere farge basert på typen
    card.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
    card.style.borderRadius = "10px";
    card.style.width = "200px"; // Fast bredde for konsistens
    card.style.minHeight = "300px"; // Fast minimumshøyde for konsistens
    card.style.display = "flex";
    card.style.flexDirection = "column";
    card.style.alignItems = "center";
    card.style.justifyContent = "space-between";

    // Navn med stor forbokstav
    const pokemonName =
      pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    // Formatering av type
    const formattedTypes = pokemon.types
      .map(
        (type) =>
          type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)
      )
      .join(", ");

    card.innerHTML = `
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" style="max-width:90%;height:auto;margin-top:10px;">
            <h3>${pokemonName}</h3>
            <p>Type: ${formattedTypes}</p>
            <button onclick="selectPokemon('${pokemon.name}')">Velg</button>
        `;
    container.appendChild(card);
  });
}

// Kall denne funksjonen når siden lastes for å initiere spillet
window.onload = fetchPokemonData;
