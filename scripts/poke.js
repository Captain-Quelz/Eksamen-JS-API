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

const defaultImage = "assets/klipartz-picachu.png"; // Standardbilde

function createCustomPokemon() {
  const name = document.getElementById("custom-name").value.trim();
  const type = document
    .getElementById("custom-type")
    .value.toLowerCase()
    .trim();
  if (!name || !allTypes.includes(type)) {
    alert("Please enter a valid name and a type from the predefined list.");
    return;
  }

  const newPokemon = {
    name: name.charAt(0).toUpperCase() + name.slice(1),
    image: defaultImage,
    types: [type],
  };

  allPokemons.push(newPokemon); // Legg til den nye Pokémonen i hovedlisten
  displayedPokemons.push(newPokemon); // Oppdater listen som vises
  saveCustomPokemons(); // Lagre den nye Pokémonen i localStorage
  displayPokemons(); // Oppdater visningen for å inkludere den nye Pokémonen
}

function saveCustomPokemons() {
  // Filtrer ut kun brukergenererte Pokémoner basert på bildestien
  const customPokemons = allPokemons.filter((p) => p.image === defaultImage);
  localStorage.setItem("customPokemons", JSON.stringify(customPokemons));
}

function loadCustomPokemons() {
  // Last inn lagrede Pokémoner fra localStorage og legg dem til i hovedlisten
  const customPokemons =
    JSON.parse(localStorage.getItem("customPokemons")) || [];
  allPokemons = allPokemons.concat(customPokemons);
  displayedPokemons = [...allPokemons];
}

window.onload = function () {
  fetchPokemons(); // Hent Pokémon fra API-et og vis dem
  loadCustomPokemons(); // Last inn brukergenererte Pokémoner fra lokal lagring og vis dem
  createFilterButtons(); // Opprett filtreringsknapper
  styleCustomPokemonForm(); // Style skjemaet for å opprette nye Pokemon
};

// --------------------------------------------------------

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
    const pokemonName =
      pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

    // Stor forbokstav på alle types
    const formattedTypes = pokemon.types
      .map((type) => type.charAt(0).toUpperCase() + type.slice(1))
      .join(", ");

    card.innerHTML = `
            <img src="${pokemon.image}" alt="${pokemonName}" style="max-width:90%;height:auto;margin-top:10px;">
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

// Start funksjonen når vinduet lastes
window.onload = fetchPokemons;

window.onload = function () {
  fetchPokemons();
  createFilterButtons();
  styleCustomPokemonForm();
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
