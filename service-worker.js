"use strict";var precacheConfig=[["/index.html","f41db35c8298243a329cb3420a47ded5"],["/static/css/main.70f1f11d.css","70f1f11d94558b5e368d3dc3815c4a19"],["/static/css/main.70f1f11d.css.gz","ba2ffce98ccd53dd08057e5af6026830"],["/static/js/main.2bbf3641.js.gz","df406796623640f5c80ef0b7f49b8b25"],["/static/media/001-search.05c14bba.svg","05c14bba53cb2b5c0459505220d2be24"],["/static/media/002-shopping-cart.deb82563.svg","deb82563b1570a4a59f393f8ca0f3a1a"],["/static/media/003-chat-Copy.d9d05ef9.svg","d9d05ef93957ba30bd147753ce4378d4"],["/static/media/003-chat.5229aa77.svg","5229aa77e40996a53e1c68d827b16ca7"],["/static/media/2.abfd0f5e.jpg","abfd0f5e7d4f538116fc92e50e2a61ea"],["/static/media/Lend.f06c3b91.png","f06c3b91407475f3eb30580eb946304f"],["/static/media/candy.22f30731.png","22f30731365907092c9950e7130a308c"],["/static/media/car.117dc5c9.png","117dc5c9e2c835097896de71faba6f39"],["/static/media/card-black.4ecbe480.svg","4ecbe4804a11d9d58774c4a456477623"],["/static/media/cliplist.a6cdbb52.png","a6cdbb52fe359cd90770c777dae2e4bb"],["/static/media/defaultAvatar.16713bc1.png","16713bc1c166d6ad1763d052b59fa41d"],["/static/media/emart-logo.ec6a1350.png","ec6a1350441832a94056d52e63d1af3e"],["/static/media/emartlogo.542d31b7.png","542d31b743de6efde21013291a1a836e"],["/static/media/envelope-black.4712396f.svg","4712396fd6ac66a183071a58d8e9fb9e"],["/static/media/epoint.4fe2c8fb.png","4fe2c8fbdebf26982438de20eaf50393"],["/static/media/error pages-01.7a1d41a6.jpg","7a1d41a6b042438d4722f8d27dd34cc9"],["/static/media/error pages-02.2562b493.jpg","2562b4931dc34f23af1516f776783789"],["/static/media/error-black.eef66d80.svg","eef66d8017d1ae7922990fdd9ae8c808"],["/static/media/error.d6174862.svg","d6174862dc2ba9b57e131a5fa1b43db5"],["/static/media/fontawesome-webfont.674f50d2.eot","674f50d287a8c48dc19ba404d20fe713"],["/static/media/fontawesome-webfont.912ec66d.svg","912ec66d7572ff821749319396470bde"],["/static/media/fontawesome-webfont.af7ae505.woff2","af7ae505a9eed503f8b8e6982036873e"],["/static/media/fontawesome-webfont.b06871f2.ttf","b06871f281fee6b241d60582ae9369b9"],["/static/media/fontawesome-webfont.fee66e71.woff","fee66e712a8a08eef5805a46892932ad"],["/static/media/goup.c52882c6.svg","c52882c697fdcd10b161d2a226c9af4c"],["/static/media/list.28afff3a.svg","28afff3a981b0a50bb76de4ebe419435"],["/static/media/loader.310b42ee.svg","310b42ee3273cdaa27c08c1311d50842"],["/static/media/lock.4e112593.png","4e11259328f86e2f277c4149f51f3a97"],["/static/media/login.731c129f.svg","731c129f50863f7a2dba19e0b831a7c1"],["/static/media/logo.f5cebdcd.png","f5cebdcd26fa56919c893d6a883c44be"],["/static/media/logo.fc6ecce9.jpg","fc6ecce9ad1d77812bbac82d836eec64"],["/static/media/not-found.f64949b8.jpg","f64949b82f165097070c01693e14c250"],["/static/media/pdf.67b5cdb1.png","67b5cdb1dbae6ffc69a55aa9af76a195"],["/static/media/qrcode-white.fcba7580.svg","fcba7580a1f5ce76bb3d32a54d03d8dc"],["/static/media/redpoint.ea96bd79.png","ea96bd790ae2918fe1f0018cced82036"],["/static/media/searchnotfound.a166e18b.jpg","a166e18b9f07b8f94578ea8af7a47f99"],["/static/media/social-black.692015b1.svg","692015b162c5c16bc457c9a4824a858c"],["/static/media/sp_time.7bfbe4b9.png","7bfbe4b9ffd95481c48b1254d32a444b"],["/static/media/sp_time1.ac08b63d.png","ac08b63d2968815ad27dc5a14f0c2692"],["/static/media/superup.d5a107a2.png","d5a107a2180bf4e319f825dd26e75ef1"],["/static/media/tamga.e0cc9ff5.png","e0cc9ff5a091445e08713e44386bdfbb"],["/static/media/tor.0bbef821.png","0bbef8219a60e3e9da5632edde8c5d5c"],["/static/media/user.de413303.png","de4133035519cfc0b172ef0cf69f8761"],["/static/media/user.f990ed44.svg","f990ed44a1a86fd5f00628858f7bd058"]],cacheName="sw-precache-v3-sw-precache-webpack-plugin-"+(self.registration?self.registration.scope:""),ignoreUrlParametersMatching=[/^utm_/],addDirectoryIndex=function(e,a){var t=new URL(e);return"/"===t.pathname.slice(-1)&&(t.pathname+=a),t.toString()},cleanResponse=function(a){return a.redirected?("body"in a?Promise.resolve(a.body):a.blob()).then(function(e){return new Response(e,{headers:a.headers,status:a.status,statusText:a.statusText})}):Promise.resolve(a)},createCacheKey=function(e,a,t,c){var n=new URL(e);return c&&n.pathname.match(c)||(n.search+=(n.search?"&":"")+encodeURIComponent(a)+"="+encodeURIComponent(t)),n.toString()},isPathWhitelisted=function(e,a){if(0===e.length)return!0;var t=new URL(a).pathname;return e.some(function(e){return t.match(e)})},stripIgnoredUrlParameters=function(e,t){var a=new URL(e);return a.hash="",a.search=a.search.slice(1).split("&").map(function(e){return e.split("=")}).filter(function(a){return t.every(function(e){return!e.test(a[0])})}).map(function(e){return e.join("=")}).join("&"),a.toString()},hashParamName="_sw-precache",urlsToCacheKeys=new Map(precacheConfig.map(function(e){var a=e[0],t=e[1],c=new URL(a,self.location),n=createCacheKey(c,hashParamName,t,/\.\w{8}\./);return[c.toString(),n]}));function setOfCachedUrls(e){return e.keys().then(function(e){return e.map(function(e){return e.url})}).then(function(e){return new Set(e)})}self.addEventListener("install",function(e){e.waitUntil(caches.open(cacheName).then(function(c){return setOfCachedUrls(c).then(function(t){return Promise.all(Array.from(urlsToCacheKeys.values()).map(function(a){if(!t.has(a)){var e=new Request(a,{credentials:"same-origin"});return fetch(e).then(function(e){if(!e.ok)throw new Error("Request for "+a+" returned a response with status "+e.status);return cleanResponse(e).then(function(e){return c.put(a,e)})})}}))})}).then(function(){return self.skipWaiting()}))}),self.addEventListener("activate",function(e){var t=new Set(urlsToCacheKeys.values());e.waitUntil(caches.open(cacheName).then(function(a){return a.keys().then(function(e){return Promise.all(e.map(function(e){if(!t.has(e.url))return a.delete(e)}))})}).then(function(){return self.clients.claim()}))}),self.addEventListener("fetch",function(a){if("GET"===a.request.method){var e,t=stripIgnoredUrlParameters(a.request.url,ignoreUrlParametersMatching),c="index.html";(e=urlsToCacheKeys.has(t))||(t=addDirectoryIndex(t,c),e=urlsToCacheKeys.has(t));var n="/index.html";!e&&"navigate"===a.request.mode&&isPathWhitelisted(["^(?!\\/__).*"],a.request.url)&&(t=new URL(n,self.location).toString(),e=urlsToCacheKeys.has(t)),e&&a.respondWith(caches.open(cacheName).then(function(e){return e.match(urlsToCacheKeys.get(t)).then(function(e){if(e)return e;throw Error("The cached response that was expected is missing.")})}).catch(function(e){return console.warn('Couldn\'t serve response for "%s" from cache: %O',a.request.url,e),fetch(a.request)}))}});