"use strict";var precacheConfig=[["/index.html","8f6f504103a372b057fc4a1f4494fc1d"],["/static/css/main.85eea150.css","85eea1505b8b49ccf8bdc3e9f5b26b69"],["/static/css/main.85eea150.css.gz","b47e126aed7aadcbaab7abe448c074b1"],["/static/js/0.40125bcf.chunk.js","fb32e2f692940c6dbb90c45e6cad88dc"],["/static/js/1.39aedfe7.chunk.js","c945427213a6574bd56680194a6e1093"],["/static/js/2.254bc91e.chunk.js","b8f7ba50192b5bbff827cc7573aa3f1a"],["/static/js/3.c0850445.chunk.js","acf7cd08d0952a4b1c851b9fcd02649c"],["/static/js/4.d603a1ca.chunk.js","a9b48b8f9d13f696efcd2afbf9a1a8be"],["/static/js/5.003849bb.chunk.js","edba92a4030e84f5a9543198c3a530b0"],["/static/js/6.a6f15db0.chunk.js","8df3e0a33337d4375156c6c26c3bcd7d"],["/static/js/7.8ac8b00c.chunk.js","a07cbeb179e338d66a3ff83072972909"],["/static/js/main.9931ee9f.js.gz","110b5ab14efcb755a40701a65f421ff4"],["/static/media/001-search.05c14bba.svg","05c14bba53cb2b5c0459505220d2be24"],["/static/media/002-shopping-cart.deb82563.svg","deb82563b1570a4a59f393f8ca0f3a1a"],["/static/media/003-chat-Copy.d9d05ef9.svg","d9d05ef93957ba30bd147753ce4378d4"],["/static/media/003-chat.5229aa77.svg","5229aa77e40996a53e1c68d827b16ca7"],["/static/media/2.abfd0f5e.jpg","abfd0f5e7d4f538116fc92e50e2a61ea"],["/static/media/Lend.f06c3b91.png","f06c3b91407475f3eb30580eb946304f"],["/static/media/SocialPay.69766c06.png","69766c068851655b936695caec11cec2"],["/static/media/candy.22f30731.png","22f30731365907092c9950e7130a308c"],["/static/media/car.117dc5c9.png","117dc5c9e2c835097896de71faba6f39"],["/static/media/card-black.4ecbe480.svg","4ecbe4804a11d9d58774c4a456477623"],["/static/media/cliplist.a6cdbb52.png","a6cdbb52fe359cd90770c777dae2e4bb"],["/static/media/defaultAvatar.16713bc1.png","16713bc1c166d6ad1763d052b59fa41d"],["/static/media/emart-logo.ec6a1350.png","ec6a1350441832a94056d52e63d1af3e"],["/static/media/emartlogo.542d31b7.png","542d31b743de6efde21013291a1a836e"],["/static/media/envelope-black.4712396f.svg","4712396fd6ac66a183071a58d8e9fb9e"],["/static/media/epoint.4fe2c8fb.png","4fe2c8fbdebf26982438de20eaf50393"],["/static/media/error pages-01.7a1d41a6.jpg","7a1d41a6b042438d4722f8d27dd34cc9"],["/static/media/error pages-02.2562b493.jpg","2562b4931dc34f23af1516f776783789"],["/static/media/error-black.eef66d80.svg","eef66d8017d1ae7922990fdd9ae8c808"],["/static/media/error.d6174862.svg","d6174862dc2ba9b57e131a5fa1b43db5"],["/static/media/goup.c52882c6.svg","c52882c697fdcd10b161d2a226c9af4c"],["/static/media/list.28afff3a.svg","28afff3a981b0a50bb76de4ebe419435"],["/static/media/loader.310b42ee.svg","310b42ee3273cdaa27c08c1311d50842"],["/static/media/lock.4e112593.png","4e11259328f86e2f277c4149f51f3a97"],["/static/media/login.731c129f.svg","731c129f50863f7a2dba19e0b831a7c1"],["/static/media/logo.f5cebdcd.png","f5cebdcd26fa56919c893d6a883c44be"],["/static/media/logo.fc6ecce9.jpg","fc6ecce9ad1d77812bbac82d836eec64"],["/static/media/not-found.f64949b8.jpg","f64949b82f165097070c01693e14c250"],["/static/media/pdf.67b5cdb1.png","67b5cdb1dbae6ffc69a55aa9af76a195"],["/static/media/qrcode-white.fcba7580.svg","fcba7580a1f5ce76bb3d32a54d03d8dc"],["/static/media/redpoint.ea96bd79.png","ea96bd790ae2918fe1f0018cced82036"],["/static/media/searchnotfound.a166e18b.jpg","a166e18b9f07b8f94578ea8af7a47f99"],["/static/media/sp_time.7bfbe4b9.png","7bfbe4b9ffd95481c48b1254d32a444b"],["/static/media/sp_time1.ac08b63d.png","ac08b63d2968815ad27dc5a14f0c2692"],["/static/media/superup.d5a107a2.png","d5a107a2180bf4e319f825dd26e75ef1"],["/static/media/tamga.e0cc9ff5.png","e0cc9ff5a091445e08713e44386bdfbb"],["/static/media/tor.0bbef821.png","0bbef8219a60e3e9da5632edde8c5d5c"],["/static/media/user.de413303.png","de4133035519cfc0b172ef0cf69f8761"],["/static/media/user.f990ed44.svg","f990ed44a1a86fd5f00628858f7bd058"]],cacheName="sw-precache-v3-sw-precache-webpack-plugin-"+(self.registration?self.registration.scope:""),ignoreUrlParametersMatching=[/^utm_/],addDirectoryIndex=function(e,a){var c=new URL(e);return"/"===c.pathname.slice(-1)&&(c.pathname+=a),c.toString()},cleanResponse=function(a){return a.redirected?("body"in a?Promise.resolve(a.body):a.blob()).then(function(e){return new Response(e,{headers:a.headers,status:a.status,statusText:a.statusText})}):Promise.resolve(a)},createCacheKey=function(e,a,c,t){var n=new URL(e);return t&&n.pathname.match(t)||(n.search+=(n.search?"&":"")+encodeURIComponent(a)+"="+encodeURIComponent(c)),n.toString()},isPathWhitelisted=function(e,a){if(0===e.length)return!0;var c=new URL(a).pathname;return e.some(function(e){return c.match(e)})},stripIgnoredUrlParameters=function(e,c){var a=new URL(e);return a.hash="",a.search=a.search.slice(1).split("&").map(function(e){return e.split("=")}).filter(function(a){return c.every(function(e){return!e.test(a[0])})}).map(function(e){return e.join("=")}).join("&"),a.toString()},hashParamName="_sw-precache",urlsToCacheKeys=new Map(precacheConfig.map(function(e){var a=e[0],c=e[1],t=new URL(a,self.location),n=createCacheKey(t,hashParamName,c,/\.\w{8}\./);return[t.toString(),n]}));function setOfCachedUrls(e){return e.keys().then(function(e){return e.map(function(e){return e.url})}).then(function(e){return new Set(e)})}self.addEventListener("install",function(e){e.waitUntil(caches.open(cacheName).then(function(t){return setOfCachedUrls(t).then(function(c){return Promise.all(Array.from(urlsToCacheKeys.values()).map(function(a){if(!c.has(a)){var e=new Request(a,{credentials:"same-origin"});return fetch(e).then(function(e){if(!e.ok)throw new Error("Request for "+a+" returned a response with status "+e.status);return cleanResponse(e).then(function(e){return t.put(a,e)})})}}))})}).then(function(){return self.skipWaiting()}))}),self.addEventListener("activate",function(e){var c=new Set(urlsToCacheKeys.values());e.waitUntil(caches.open(cacheName).then(function(a){return a.keys().then(function(e){return Promise.all(e.map(function(e){if(!c.has(e.url))return a.delete(e)}))})}).then(function(){return self.clients.claim()}))}),self.addEventListener("fetch",function(a){if("GET"===a.request.method){var e,c=stripIgnoredUrlParameters(a.request.url,ignoreUrlParametersMatching),t="index.html";(e=urlsToCacheKeys.has(c))||(c=addDirectoryIndex(c,t),e=urlsToCacheKeys.has(c));var n="/index.html";!e&&"navigate"===a.request.mode&&isPathWhitelisted(["^(?!\\/__).*"],a.request.url)&&(c=new URL(n,self.location).toString(),e=urlsToCacheKeys.has(c)),e&&a.respondWith(caches.open(cacheName).then(function(e){return e.match(urlsToCacheKeys.get(c)).then(function(e){if(e)return e;throw Error("The cached response that was expected is missing.")})}).catch(function(e){return console.warn('Couldn\'t serve response for "%s" from cache: %O',a.request.url,e),fetch(a.request)}))}});