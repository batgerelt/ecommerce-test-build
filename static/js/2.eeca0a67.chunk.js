webpackJsonp([2],{1822:function(e,t,n){"use strict";function a(e,t){return Object.freeze(Object.defineProperties(e,{raw:{value:Object.freeze(t)}}))}Object.defineProperty(t,"__esModule",{value:!0});var r=n(0),i=n.n(r),c=n(8),s=n(565),l=n(26),o=n(308),m=n.n(o),u=n(5),p=a(["\n  margin: 0px 0px 0px 0px;\n  padding-top: 1rem;\n"],["\n  margin: 0px 0px 0px 0px;\n  padding-top: 1rem;\n"]),d=a(['\n  text-align: center;\n  font-size: 1rem;\n  padding: 0px;\n  margin: 0px;\n  font-weight: 500;\n  font-family: "roboto" sans-serif;\n  text-transform: none;\n  color: #63666a;\n'],['\n  text-align: center;\n  font-size: 1rem;\n  padding: 0px;\n  margin: 0px;\n  font-weight: 500;\n  font-family: "roboto" sans-serif;\n  text-transform: none;\n  color: #63666a;\n']),f=s.a.section(p),g=s.a.p(d),b=function(e){var t=Object(r.useRef)(!0);t.current&&(e.evnttype&&e.eventProducts(Object.assign({},y,{posMenu:e.evnttype})),t.current=!1);var n={slidesPerView:window.innerWidth<576?2:e.slidesperview||3,spaceBetween:0,loop:!1,autoplay:{delay:1e3*(e.delay||3),disableOnInteraction:!1},pagination:{type:"bullets",clickable:!0}};try{return i.a.createElement(i.a.Fragment,null,e.evnttype&&i.a.createElement(E,Object.assign({},e,{config:n})),!e.evnttype&&i.a.createElement(x,Object.assign({},e,{config:n})))}catch(e){return console.log("%c 🥜 error: ","font-size:20px;background-color: #ED9EC7;color:#fff;",e)}},E=function(e){return i.a.createElement(f,null,e[e.evnttype]&&e.title&&i.a.createElement("h1",{className:"title m-0"},i.a.createElement("span",{className:"uppercase"},e.title),e.description&&i.a.createElement(g,null,e.icon&&i.a.createElement("i",{className:"text-danger fa "+e.icon+" mr-1",style:{fontSize:"20px"}}),e.description)),i.a.createElement(m.a,Object.assign({},e.config,{containerClass:"swiper-container pt-2",shouldSwiperUpdate:!0,rebuildOnUpdate:!0,renderNextButton:function(){return i.a.createElement(i.a.Fragment,null)},renderPrevButton:function(){return i.a.createElement(i.a.Fragment,null)}}),e.skus&&0===e.skus.length?e[e.evnttype]&&e[e.evnttype].map(function(t){return i.a.createElement("div",null,i.a.createElement(u.j,Object.assign({elastic:!0,isVisible:!0,key:t.skucd,shape:1,item:Object.assign({},t)},e)))}):e.skus&&e.skus.map(function(t){return i.a.createElement("div",null,i.a.createElement(u.j,Object.assign({elastic:!0,isVisible:!0,key:t.skucd,shape:1,item:Object.assign({},t,{imgnm:t.img})},e)))})),e[e.evnttype]&&e.btntxt&&i.a.createElement(c.b,{to:e.link||"#",className:"d-flex justify-content-center pb-3"},i.a.createElement(l.a,{className:"border px-5"},e.btntxt)))},x=function(e){return i.a.createElement(f,null,e.title&&i.a.createElement("h1",{className:"title m-0"},i.a.createElement("span",{className:"uppercase"},e.title),e.description&&i.a.createElement(g,null,e.icon&&i.a.createElement("i",{className:"text-danger fa "+e.icon+" mr-1",style:{fontSize:"20px"}}),e.description)),i.a.createElement(m.a,Object.assign({},e.config,{containerClass:"swiper-container pt-2",shouldSwiperUpdate:!0,rebuildOnUpdate:!0,renderNextButton:function(){return i.a.createElement(i.a.Fragment,null)},renderPrevButton:function(){return i.a.createElement(i.a.Fragment,null)}}),e.skus&&e.skus.map(function(t){return i.a.createElement("div",null,i.a.createElement(u.j,Object.assign({elastic:!0,isVisible:!0,key:t.skucd,shape:1,item:Object.assign({},t,{imgnm:t.img})},e)))})),e.btntxt&&i.a.createElement(c.b,{to:e.link||"#",className:"d-flex justify-content-center pb-3"},i.a.createElement(l.a,{className:"border px-5 bg-white"},e.btntxt)))},y={catId:0,custId:0,value:"",attribute:"",color:"",brand:"",promotion:"",minPrice:0,maxPrice:0,posMenu:"",startsWith:0,rowCount:window.innerWidth<=767?4:window.innerWidth<=1200?8:10,orderColumn:"CATID_ASC, ISAVAILABLE_DESC, SALEPERCENT_DESC, RATE_DESC",highlight:!1};t.default=b}});