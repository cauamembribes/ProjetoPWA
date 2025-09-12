/* O Service Worker é um script que o navegador executa em segundo plano, ele funciona como 
intermediário entre a aplicação e a redes, que permite funcionalidades como funcionar 
de forma offline, permite receber notificações mesmo que o app esteja fechado, 
sincronização em segundo plano e etc*/

const CACHE_NAME = "app-cache-v1"; // constante onde vai ser salvo os arquivos

const cache_items = [ // lista de arquivos que você quer guardar logo na instalação (cache estático).
    "js/sw.js",
    "js/script.js",
    "index.html",
    "manifest.json",
    "style.css"
];

const POKEMON_IDS = Array.from({length: 151}, (_, i) => i + 1);

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(async (cache) => {
            for (let id of POKEMON_IDS) {
                try {
                    let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
                    cache.put(`https://pokeapi.co/api/v2/pokemon/${id}`, response.clone());
                } catch (err) {
                    console.log('Erro ao cachear Pokémon', id);
                }
            }
        })
    );
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {  // mantém só o cache atual
                        console.log('Service Worker: Cache antigo removido', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});


self.addEventListener('fetch', (e) => {
    if (e.request.url.includes('pokeapi.co/api/v2/pokemon')) {
        e.respondWith(
            caches.match(e.request).then((cachedResponse) => {
                if (cachedResponse) return cachedResponse;

                return fetch(e.request).then((networkResponse) => {
                    return caches.open(CACHE_NAME).then((cache) => {
                        cache.put(e.request, networkResponse.clone());
                        return networkResponse;
                    });
                });
            }).catch((erro) => {
                console.log("Ocorreu um erro.", erro)
            })
        );
    }
});




