webpackJsonp([1],{7133:function(e,n,t){"use strict";function a(e,n){return Object.freeze(Object.defineProperties(e,{raw:{value:Object.freeze(n)}}))}Object.defineProperty(n,"__esModule",{value:!0});var r=t(0),i=t.n(r),o=t(9),c=t(57),s=t(20),l=t(6),d=t(71),m=a(["\n  margin: 0px 0px 0px 0px;\n  padding-top: 1rem;\n"],["\n  margin: 0px 0px 0px 0px;\n  padding-top: 1rem;\n"]),p=a(['\n  text-align: center;\n  font-size: 1rem;\n  padding: 0px;\n  margin: 0px;\n  font-weight: 500;\n  font-family: "roboto" sans-serif;\n  text-transform: none;\n  color: #63666a;\n'],['\n  text-align: center;\n  font-size: 1rem;\n  padding: 0px;\n  margin: 0px;\n  font-weight: 500;\n  font-family: "roboto" sans-serif;\n  text-transform: none;\n  color: #63666a;\n']),g=c.a.section(m),u=(c.a.p(p),{catId:0,custId:0,value:"",attribute:"",color:"",brand:"",promotion:"",minPrice:0,maxPrice:0,rowCount:10,posMenu:"",startsWith:0,orderColumn:"",highlight:!1,module:"popular"}),f=function(e){var n=Object(r.useRef)(!0),t=e.dynamic["RESPONSE_DYNAMIC_CONTENT_"+e.contentid],a=e.dynamic["REQUEST_DYNAMIC_CONTENT_"+e.contentid];e.dynamic["RESPONSE_DYNAMIC_CONTENT_"+e.contentid+"_TOTAL"];if(n.current){if((void 0===a||!a)&&void 0===t){var c=5===e.cart?window.innerWidth<=767?4:window.innerWidth<=1200?8:10:window.innerWidth<=767?2:6;e.getWidgetContent({params:{contentid:e.contentid,body:Object.assign({},u,{catId:e.catid?e.catid:0,rowCount:c}),url:"/search/elastic",method:"POST"}})}n.current=!1}var m=3===e.cart?2:1;return void 0===t||0===t.length?i.a.createElement(i.a.Fragment,null):i.a.createElement(i.a.Fragment,null,e.images&&e.images.length>0&&i.a.createElement(d.a,e),i.a.createElement(g,null,i.a.createElement(d.c,e),i.a.createElement("div",{className:"container pad10 pt-2"},i.a.createElement("div",{className:"row row10"},i.a.createElement("div",{className:"container pad10"},i.a.createElement("div",{className:"row row10"},t&&t.map(function(n,t){return i.a.createElement(l.b,Object.assign({elastic:!0,key:t,shape:m,item:Object.assign({},n,{tags:e.search.tags}),tags:e.search.tags},e))})))),i.a.createElement(o.b,{to:e.link||"#",className:"d-flex justify-content-center pb-3"},i.a.createElement(s.a,{className:"border px-5 show-all-btn"},e.btntxt||"Цааш үзэх")))))};n.default=Object(o.f)(f)}});