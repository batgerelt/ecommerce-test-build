webpackJsonp([0],{7123:function(e,n,t){"use strict";function a(e,n){return Object.freeze(Object.defineProperties(e,{raw:{value:Object.freeze(n)}}))}Object.defineProperty(n,"__esModule",{value:!0});var i=t(0),r=t.n(i),s=t(9),c=t(57),l=t(21),o=t(81),m=t.n(o),d=t(6),u=t(76),p=a(["\n  margin: 0px 0px 0px 0px;\n  padding-top: 1rem;\n"],["\n  margin: 0px 0px 0px 0px;\n  padding-top: 1rem;\n"]),g=a(['\n  text-align: center;\n  font-size: 1rem;\n  padding: 0px;\n  margin: 0px;\n  font-weight: 500;\n  font-family: "roboto" sans-serif;\n  text-transform: none;\n  color: #63666a;\n'],['\n  text-align: center;\n  font-size: 1rem;\n  padding: 0px;\n  margin: 0px;\n  font-weight: 500;\n  font-family: "roboto" sans-serif;\n  text-transform: none;\n  color: #63666a;\n']),f=c.a.section(p),b=(c.a.p(g),function(e){var n=Object(i.useRef)(!0);if(n.current){var t="savedProducts"===e.component?"wishlist":"viewlist";null!==localStorage.getItem("auth")?!1!==e.dynamic["list_"+t]&&e.getWishView(t):!1===e.dynamic["list_"+t]&&e.removeWishView(t),n.current=!1}var a={slidesPerView:window.innerWidth<576?2:e.slidesperview||5,spaceBetween:0,autoplay:{delay:1e3*(e.delay||3),disableOnInteraction:!1},pagination:{type:"bullets",clickable:!0}};try{var s="savedProducts"===e.component?"wishlist":"viewlist";return null!==localStorage.getItem("auth")?r.a.createElement(r.a.Fragment,null,e.dynamic[s]&&e.dynamic[s].length>0&&e.images.length>0&&r.a.createElement(u.a,e),e.dynamic[s]&&e.dynamic[s].length>0&&r.a.createElement(x,Object.assign({},e,{skus:e.dynamic[s],config:Object.assign({loop:window.innerWidth<576?!(e.dynamic[s]&&e.dynamic[s].length<3):!(e.dynamic[s]&&e.dynamic[s].length<6)},a)}))):null}catch(e){return console.log(e)}}),x=function(e){return r.a.createElement(f,null,r.a.createElement(u.c,e),r.a.createElement(m.a,Object.assign({},e.config,{containerClass:"swiper-container pt-2",shouldSwiperUpdate:!0,rebuildOnUpdate:!0,renderNextButton:function(){return r.a.createElement(r.a.Fragment,null)},renderPrevButton:function(){return r.a.createElement(r.a.Fragment,null)}}),e.skus&&e.skus.map(function(n){return r.a.createElement("div",null,r.a.createElement(d.k,Object.assign({issave:"savedProducts"===e.component,elastic:!0,isVisible:!0,key:n.skucd,shape:1,item:Object.assign({},n),tags:e.search.tags},e)))})),e.btntxt&&r.a.createElement(s.b,{to:e.link||"#",className:"d-flex justify-content-center pb-3"},r.a.createElement(l.a,{className:"border px-5 bg-white"},e.btntxt)))};n.default=b}});