const apiUrl = "https://pokeapi.co/api/v2/pokemon";
let allPokemons = [];
let displayedPokemons = [];
const allTypes = [
  "normal",
  "fire",
  "water",
  "electric",
  "grass",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
];

// Funksjon for å hente 50 Pokémon fra APIet
async function fetchPokemons() {
  try {
    const response = await fetch(`${apiUrl}?limit=50`);
    const data = await response.json();
    const pokemonDetailsPromises = data.results.map((pokemon) =>
      fetch(pokemon.url).then((res) => res.json())
    );
    allPokemons = await Promise.all(pokemonDetailsPromises);
    allPokemons = allPokemons.map((p) => ({
      name: p.name,
      image: p.sprites.front_default,
      types: p.types.map((t) => t.type.name),
    }));
    displayedPokemons = [...allPokemons];
    displayPokemons();
    createFilterButtons();
  } catch (error) {
    console.error("Failed to fetch Pokemons:", error);
  }
}

// Custom pokemon --------------------------------------------------------

// "Vennligst skriv inn navn og en av typene som vises under."

const defaultImage = "assets/klipartz-picachu.png"; // Standardbilde

function createCustomPokemon() {
    const name = document.getElementById("custom-name").value.trim();
    const type = document.getElementById("custom-type").value.toLowerCase().trim();
    if (!name || !allTypes.includes(type)) {
        alert("Vennligst skriv inn navn og en av typene som vises under.");
        return;
    }

    const newPokemon = {
        name: name.charAt(0).toUpperCase() + name.slice(1),
        image: defaultImage,
        types: [type],
    };

    allPokemons.push(newPokemon);
    displayedPokemons.push(newPokemon);
    displayPokemons();

    // Lagrer kun brukergenererte Pokémon separat
    updateCustomPokemonsStorage(newPokemon);
}

function updateCustomPokemonsStorage(newPokemon) {
    let customPokemons = JSON.parse(localStorage.getItem("customPokemons")) || [];
    customPokemons.push(newPokemon);
    localStorage.setItem("customPokemons", JSON.stringify(customPokemons));
}

function saveCustomPokemons() {
    const customPokemons = allPokemons.filter(p => p.image === defaultImage);
    localStorage.setItem("savedPokemons", JSON.stringify(customPokemons));
    displaySavedPokemons(); // Oppdater visningen av lagrede Pokémon umiddelbart etter lagring
}

function loadCustomPokemons() {
    const customPokemons = JSON.parse(localStorage.getItem("customPokemons")) || [];
    allPokemons = [...allPokemons, ...customPokemons];
    displayedPokemons = [...allPokemons];
    displayPokemons();
}


// Lagring ---------------------------------------------------------

const maxPokemonSave = 5; // Maksimalt antall Pokémon brukeren kan lagre

function savePokemon(pokemonName) {
    const savedPokemons = getSavedPokemons();
    if (savedPokemons.length >= maxPokemonSave) {
        alert("Du har nådd maksimalt antall lagrede Pokémon. Slett en for å lagre nye.");
        return;
    }

    const pokemonToSave = allPokemons.find(pokemon => pokemon.name === pokemonName);
    if (!pokemonToSave || savedPokemons.some(p => p.name === pokemonName)) {
        alert("Denne Pokémon er allerede lagret eller finnes ikke.");
        return;
    }

    savedPokemons.push(pokemonToSave);
    localStorage.setItem("savedPokemons", JSON.stringify(savedPokemons));
    displaySavedPokemons();  // Oppdater visningen av lagrede Pokémon umiddelbart etter lagring
}

function deletePokemon(pokemonName) {
    let customPokemons = JSON.parse(localStorage.getItem("customPokemons")) || [];
    customPokemons = customPokemons.filter(pokemon => pokemon.name !== pokemonName);
    localStorage.setItem("customPokemons", JSON.stringify(customPokemons));  // Oppdaterer customPokemons i localStorage

    let savedPokemons = getSavedPokemons();
    savedPokemons = savedPokemons.filter(pokemon => pokemon.name !== pokemonName);
    localStorage.setItem("savedPokemons", JSON.stringify(savedPokemons));  // Oppdaterer savedPokemons i localStorage

    allPokemons = allPokemons.filter(pokemon => pokemon.name !== pokemonName);
    displayedPokemons = allPokemons;
    displayPokemons();  // Oppdaterer visningen for alle Pokémon
    displaySavedPokemons();  // Oppdaterer visningen av lagrede Pokémon
}


function getSavedPokemons() {
    return JSON.parse(localStorage.getItem("savedPokemons")) || [];
}

function displaySavedPokemons() {
    const container = document.getElementById("saved-pokemon-container");
    if (!container) {
        console.error("Container for lagrede Pokémon mangler på siden.");
        return;
    }
    container.innerHTML = "";
    container.style.display = "flex";
    container.style.flexWrap = "wrap";
    container.style.justifyContent = "flex-start";
    container.style.alignItems = "flex-start";
    container.style.padding = "20px";
    container.style.gap = "20px";

    const savedPokemons = getSavedPokemons();
    savedPokemons.forEach(pokemon => {
        const card = document.createElement("div");
        card.style.padding = "10px";
        card.style.margin = "10px";
        card.style.border = "1px solid #ccc";
        card.style.background = getBackgroundColor(pokemon.types[0]);
        card.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
        card.style.borderRadius = "10px";
        card.style.width = "200px";
        card.style.minHeight = "300px";
        card.style.display = "flex";
        card.style.flexDirection = "column";
        card.style.alignItems = "center";
        card.style.justifyContent = "space-between";

        const pokemonName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
        const formattedTypes = pokemon.types.map(type => type.charAt(0).toUpperCase() + type.slice(1)).join(", ");
        const imageStyle = 'max-width:90%; height:auto;';

        card.innerHTML = `
            <img src="${pokemon.image}" alt="${pokemonName}" style="${imageStyle} margin-top:10px;">
            <h3>${pokemonName}</h3>
            <p>Type: ${formattedTypes}</p>
            <div style="width:100%; text-align:center; margin-top:10px;">
                <button onclick="removeSavedPokemon('${pokemon.name}')">Fjern</button>
            </div>
        `;
        container.appendChild(card);
    });
}


function removeSavedPokemon(pokemonName) {
    let savedPokemons = getSavedPokemons();
    savedPokemons = savedPokemons.filter(pokemon => pokemon.name !== pokemonName);
    localStorage.setItem("savedPokemons", JSON.stringify(savedPokemons));
    displaySavedPokemons();  // Oppdater visningen av lagrede Pokémon umiddelbart etter fjerning
}

// Funksjon for å vise Pokemon på nettsiden
function displayPokemons() {
    const container = document.getElementById("pokemon-container");
    container.innerHTML = "";
    container.style.display = "flex";
    container.style.flexWrap = "wrap";
    container.style.justifyContent = "flex-start"; // Justerer kortene til å starte fra venstre
    container.style.alignItems = "flex-start";
    container.style.padding = "20px"; // Padding rundt hele containeren
    container.style.gap = "20px"; // Fast gap mellom elementene, sikrer jevn avstand
  
    displayedPokemons.forEach((pokemon) => {
      const card = document.createElement("div");
      card.style.padding = "10px";
      card.style.margin = "10px";
      card.style.border = "1px solid #ccc";
      card.style.background = getBackgroundColor(pokemon.types[0]);
      card.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
      card.style.borderRadius = "10px";
      card.style.width = "200px"; // Fast bredde
      card.style.minHeight = "300px"; // Fast minimumshøyde
      card.style.display = "flex";
      card.style.flexDirection = "column";
      card.style.alignItems = "center";
      card.style.justifyContent = "space-between";
  
      // Stor forbokstav i navnet
      const pokemonName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
  
      // Stor forbokstav på alle types
      const formattedTypes = pokemon.types.map(type => type.charAt(0).toUpperCase() + type.slice(1)).join(", ");
  
      // Juster bildets størrelse hvis det er standardbildet
      const imageStyle = pokemon.image === defaultImage ? 'width:100px; height:100px;' : 'max-width:90%; height:auto;';
  
      card.innerHTML = `
          <img src="${pokemon.image}" alt="${pokemonName}" style="${imageStyle} margin-top:10px;">
          <h3>${pokemonName}</h3>
          <p>Type: ${formattedTypes}</p>
          <div style="width:100%; text-align:center; margin-top:10px;">
              <button style="margin-right: 5px;" onclick="savePokemon('${pokemon.name}')">Lagre</button>
              <button style="margin-right: 5px;" onclick="deletePokemon('${pokemon.name}')">Slett</button>
              <button onclick="editPokemon('${pokemon.name}')">Rediger</button>
          </div>
      `;
      container.appendChild(card);
    });
  }
  

// Funksjon for å opprette filterknappene
function createFilterButtons() {
  const buttonsContainer = document.getElementById("filter-buttons");
  buttonsContainer.innerHTML = "";

  // Setter stil for filterknappene
  buttonsContainer.style.display = "flex";
  buttonsContainer.style.justifyContent = "center"; // Midtstiller knappene
  buttonsContainer.style.flexWrap = "wrap"; // Tillater knappene å bryte på neste linje ved behov
  buttonsContainer.style.marginTop = "20px"; // Legger til luft over knappene
  buttonsContainer.style.marginBottom = "10px"; // Legger til litt mindre luft under de første knappene

  allTypes.forEach((type) => {
    const button = document.createElement("button");
    button.innerText = type.charAt(0).toUpperCase() + type.slice(1); // Gjør første bokstav stor
    button.onclick = () => filterPokemons(type);
    button.style.margin = "5px"; // Legger til litt plass rundt hver knapp
    buttonsContainer.appendChild(button);
  });

  // Legger til en knapp for å fjerne filtreringen og vise alle pokémons
  const allButtonContainer = document.createElement("div"); // Oppretter en ny div for "Vis Alle"-knappen
  allButtonContainer.style.width = "100%"; // Setter bredden til 100% for å tvinge knappen ned på ny linje
  allButtonContainer.style.display = "flex"; // Bruker flex for å justere knappen sentralt
  allButtonContainer.style.justifyContent = "center"; // Midtstiller knappen i sin container
  allButtonContainer.style.marginTop = "10px"; // Legger til margin for å separere fra andre knapper

  const allButton = document.createElement("button");
  allButton.innerText = "Vis Alle";
  allButton.onclick = () => {
    displayedPokemons = [...allPokemons];
    displayPokemons();
  };
  allButton.style.margin = "10px"; // Legger til margin rundt "Vis Alle"-knappen
  allButton.style.padding = "10px 20px"; // Gjør knappen større ved å legge til mer padding
  allButton.style.fontSize = "1.1em"; // Gjør tekst større

  allButtonContainer.appendChild(allButton);
  buttonsContainer.appendChild(allButtonContainer); // Legger "Vis Alle"-knappen i sin egen container
}

// Funksjon for å filtrere Pokémon basert på type
function filterPokemons(type) {
  displayedPokemons = allPokemons.filter((pokemon) =>
    pokemon.types.includes(type)
  );
  displayPokemons();
}

// Hjelpefunksjon for å velge bakgrunnsfarge basert på typen
function getBackgroundColor(type) {
  const typeColors = {
    fire: "#FDDFDF",
    water: "#DEF3FD",
    grass: "#DEFDE0",
    electric: "#FCF7DE",
    ice: "#E0FFFF",
    fighting: "#C2B280",
    poison: "#C8A2C8",
    ground: "#E0C068",
    flying: "#C6B7F5",
    psychic: "#FA92B2",
    bug: "#C2D21E",
    rock: "#B8A038",
    ghost: "#705898",
    dragon: "#7038F8",
    dark: "#705848",
    steel: "#B8B8D0",
    fairy: "#EE99AC",
    normal: "#C6C6A7",
  };
  return typeColors[type] || "#F5F5F5";
}

window.onload = function () {
    fetchPokemons().then(() => {
        loadCustomPokemons();  // Laster inn kun brukergenererte Pokémon etter API-last
        createFilterButtons();
        styleCustomPokemonForm();
        displaySavedPokemons();  // Sørger for å vise lagrede Pokémon ved oppstart
    });
};


function styleCustomPokemonForm() {
  const form = document.getElementById("custom-pokemon-form");
  // Style container
  form.style.display = "flex";
  form.style.justifyContent = "center";
  form.style.flexWrap = "wrap";
  form.style.margin = "20px 0";

  // Style inputs and button within the form
  const inputs = form.querySelectorAll("input");
  inputs.forEach((input) => {
    input.style.padding = "10px";
    input.style.margin = "5px";
  });

  const button = form.querySelector("button");
  button.style.padding = "10px";
  button.style.margin = "5px";
}
