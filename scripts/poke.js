const apiUrl = "https://pokeapi.co/api/v2/pokemon?limit=50";

async function fetchPokemons() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        const pokemons = data.results;
        return pokemons;
    } catch (error) {
        console.error("Error fetching pokemons:", error);
        return [];
    }
}

async function fetchPokemonDetails(pokemonUrl) {
    try {
        const response = await fetch(pokemonUrl);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching pokemon details:", error);
        return null;
    }
}

function createPokemonCard(pokemon) {
    const card = document.createElement("div");
    card.classList.add("pokemon-card");
    card.style.backgroundColor = getTypeColor(pokemon.types[0].type.name);
    card.style.width = "180px"; // Øker bredden på kortet
    card.style.padding = "10px"; // Legger til padding
    
    const img = document.createElement("img");
    img.src = pokemon.sprites.front_default;
    img.style.display = "block"; // Sørger for at bildet blir sentrert
    img.style.margin = "0 auto"; // Sørger for at bildet blir sentrert
    img.style.width = "100px"; // Justerer størrelsen på bildet
    
    const name = document.createElement("h3");
    name.textContent = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1); // Første bokstav stor
    
    const type = document.createElement("p");
    type.textContent = pokemon.types[0].type.name.charAt(0).toUpperCase() + pokemon.types[0].type.name.slice(1); // Første bokstav stor

    const saveButton = document.createElement("button");
    saveButton.textContent = "Lagre";
    saveButton.addEventListener("click", () => savePokemon(pokemon));

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Slette";
    deleteButton.addEventListener("click", () => deletePokemon(pokemon));

    const editButton = document.createElement("button");
    editButton.textContent = "Redigere";
    editButton.addEventListener("click", () => editPokemon(pokemon));

    card.appendChild(img);
    card.appendChild(name);
    card.appendChild(type);
    card.appendChild(saveButton);
    card.appendChild(deleteButton);
    card.appendChild(editButton);

    return card;
}

function getTypeColor(type) {
    switch (type) {
        case "fire":
            return "#FF7F0F"; // Oransje
        case "water":
            return "#6890F0"; // Blå
        case "grass":
            return "#78C850"; // Grønn
        case "electric":
            return "#F8D030"; // Gul
        case "ice":
            return "#98D8D8"; // Lyseblå
        case "fighting":
            return "#C03028"; // Rødbrun
        case "poison":
            return "#A040A0"; // Lilla
        case "ground":
            return "#E0C068"; // Beige
        case "flying":
            return "#A890F0"; // Lys lilla
        case "psychic":
            return "#F85888"; // Rosa
        case "bug":
            return "#A8B820"; // Mørkegrønn
        case "rock":
            return "#B8A038"; // Brun
        case "ghost":
            return "#705898"; // Lilla-blå
        case "dragon":
            return "#7038F8"; // Mørkeblå
        case "dark":
            return "#705848"; // Mørkegrå
        case "steel":
            return "#B8B8D0"; // Lysegrå
        case "fairy":
            return "#EE99AC"; // Lyserosa
        case "normal":
        default:
            return "#A8A878"; // Gråbrun
    }
}

async function renderPokemons() {
    const pokemons = await fetchPokemons();
    const container = document.getElementById("pokemon-container");
    container.innerHTML = "";
    container.style.display = "grid"; // Setter kontaineren til CSS Grid Layout
    container.style.gridTemplateColumns = "repeat(auto-fill, 200px)"; // Definerer kolonnebredden
    container.style.gap = "20px"; // Legger til mellomrom mellom kortene
    container.style.justifyContent = "center"; // Sentrerer kortene på siden
    for (const pokemon of pokemons) {
        const pokemonDetails = await fetchPokemonDetails(pokemon.url);
        if (pokemonDetails) {
            const card = createPokemonCard(pokemonDetails);
            container.appendChild(card);
        }
    }
}

document.addEventListener("DOMContentLoaded", renderPokemons);
