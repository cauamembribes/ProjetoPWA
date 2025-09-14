/* 
 Service Worker é um script que o navegador executa em segundo plano.
 Ele funciona como intermediário entre a aplicação e a rede, trazendo recursos como:
 - Funcionamento offline (cacheando arquivos);
 - Receber notificações push mesmo com o app fechado;
 - Sincronização em segundo plano;
 - Melhor desempenho em aplicações web.
*/

const CACHE_NAME = "app-cache-v1"; // Nome do cache.

const cache_items = [ 
    // Arquivos principais do app que já serão armazenados na instalação do Service Worker (cache estático).
    "js/sw.js",
    "js/script.js",
    "index.html",
    "manifest.json",
    "style.css"
];

const POKEMON_IDS = Array.from({length: 251}, (_, i) => i + 1); 
// Gera um array com IDs de 1 até 251 (primeiras gerações).

// EVENTO INSTALL -> Disparado na primeira vez que o SW é registrado.
// Aqui podemos preparar e salvar no cache os arquivos básicos e dados iniciais.
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(async (cache) => {
            // Cacheia os arquivos estáticos
            await cache.addAll(cache_items);

            // Pré-carrega os primeiros 251 Pokémons
            for (let id of POKEMON_IDS) {
                try {
                    let request = new Request(`https://pokeapi.co/api/v2/pokemon/${id}`);
                    let response = await fetch(request);
                    if (response.ok) {
                        cache.put(request, response.clone()); // salva pelo Request
                    }
                } catch (err) {
                    console.log('Erro ao cachear Pokémon', id, err);
                }
            }
        })
    );
});

// EVENTO ACTIVATE -> Ocorre quando o service worker recém-instalado assume o controle.
// Aqui limpamos caches antigos para manter apenas a versão atual.
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {  
                        console.log('Service Worker: Cache antigo removido', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// EVENTO FETCH -> Intercepta todas as requisições da aplicação.
// Aqui podemos responder com o cache ou buscar da rede.
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            // Se já tiver cache, retorna
            if (cachedResponse) return cachedResponse;

            // Caso contrário, busca da rede e salva no cache
            return fetch(event.request).then((networkResponse) => {
                // Só salva no cache se a resposta for válida
                if (!networkResponse || !networkResponse.ok) {
                    return networkResponse;
                }

                return caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, networkResponse.clone()); 
                    return networkResponse;
                });
            });
        }).catch((err) => {
            console.log("Erro durante o fetch:", err);
            // Aqui daria para retornar um fallback offline se você quiser
        })
    );
});
