if ('serviceWorker' in navigator){
    navigator.serviceWorker.register('js/sw.js')
    .then(registration => {
        console.log('Service Worker registrado com sucesso!')
    })
    .catch(error => {
        console.error('Registração de Service Worker malsucedido. :(')
    })
}

const typeTranslate = {
  normal: "Normal",
  fire: "Fogo",
  water: "Água",
  grass: "Planta",
  electric: "Elétrico",
  ice: "Gelo",
  fighting: "Lutador",
  poison: "Veneno",
  ground: "Terra",
  flying: "Voador",
  psychic: "Psíquico",
  bug: "Inseto",
  rock: "Pedra",
  ghost: "Fantasma",
  dark: "Sombrio",
  dragon: "Dragão",
  steel: "Aço",
  fairy: "Fada"
};

let pokeName = document.querySelector(".pokemon_name")
let pokeType = document.querySelector(".pokemon_type")
let pokeHeight = document.querySelector(".pokemon_height")
let pokeWeight = document.querySelector(".pokemon_weight")
let pokeImage = document.getElementById("pokemonimage"); /* Quando comecei o projeto, eu tinha colocado essa variável dentro do escopo da função 
e isso foi um problema, porque não me atentei, quando fui criar o checkbox de transformar em shiny, eu estava tentando manipular a variável que tinha sido
instanciada dentro da função 'procurarPokemon', preciso me atentar mais em relação a isso.*/

function procurarPokemon () {
    pokemonEscolhido = document.getElementById("pokemon").value; // para a manipulação do VALOR que foi colocado no input precisa usar o .value, se não ele vai receber o ElementHTML
    let pokeCry = document.getElementById("audioCry");
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonEscolhido}`)
    .then(resposta => resposta.json())
    .then(dados => {
        NormalSrc = dados.sprites.other["official-artwork"].front_default;
        ShinySrc = dados.sprites.other["official-artwork"].front_shiny;
        pokeImage.src = NormalSrc; // por padrão o pokeImage recebe o pokémon na forma normal dele.
        pokeName.innerHTML = `${dados.name} #${dados.id}`
        pokeType.innerHTML = "Tipo: " + dados.types
  .map(t => typeTranslate[t.type.name] || t.type.name)
  .join(", ");
        pokeHeight.innerHTML = `Height: ${dados.height / 10} m`
        pokeWeight.innerHTML = `Peso: ${dados.weight / 10} kg`
        pokeCry.src = dados.cries.latest; 
        pokeCry.play(); // usei o .play() para poder tocar o audio
    })
    .catch(error =>
        console.error("Um erro aconteceu", error)
    )
    if(check.checked == true){
        check.checked = false; 
    }
}

const check = document.getElementById("checkShiny");

const botao = document.getElementById("search-pokemon");

botao.addEventListener('click', procurarPokemon); // fiquei horas quebrando a cabeça, pois estava usando () e quando uso () a função roda imediatamente, logo o retorno iria ser undefined

check.addEventListener('change', () => {
    if(check.checked){
        pokeImage.src = ShinySrc; 
    } else {
        pokeImage.src = NormalSrc;
    }
});



