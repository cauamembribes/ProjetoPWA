

function procurarPokemon () {
    let pokemonEscolhido = document.getElementById("pokemon").value; // para a manipulação do VALOR que foi colocado no input precisa usar o .value, se não ele vai receber o ElementHTML
    let pokeImage = document.getElementById("pokemonimage");
    let pokeImageShiny = document.getElementById("pokemonimageshiny")
    let pokeCry = document.getElementById("audioCry")
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonEscolhido}`)
    .then(resposta => resposta.json())
    .then(dados => {
        pokeImage.src = dados.sprites.other["official-artwork"].front_default; // .src usado para manipular o src (source) do <img>
        pokeImageShiny.src = dados.sprites.other["official-artwork"].front_shiny;
        pokeCry.src = dados.cries.latest; 
        pokeCry.play(); // usei o .play() para poder tocar o audio
    })
    .catch(error =>
        console.error("Um erro aconteceu", error)
    )
}

const botao = document.getElementById("search-pokemon");

botao.addEventListener('click', procurarPokemon); // fiquei horas quebrando a cabeça, pois estava usando () e quando uso () a função roda imediatamente, logo o retorno iria ser undefined



