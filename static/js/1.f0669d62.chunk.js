webpackJsonp([1],{1900:function(e,t,n){"use strict";function a(e,t){return Object.freeze(Object.defineProperties(e,{raw:{value:Object.freeze(t)}}))}Object.defineProperty(t,"__esModule",{value:!0});var r=n(0),i=n.n(r),c=n(8),o=n(59),s=n(20),l=n(7),d=a(["\n  margin: 0px 0px 0px 0px;\n  padding-top: 1rem;\n"],["\n  margin: 0px 0px 0px 0px;\n  padding-top: 1rem;\n"]),m=a(['\n  text-align: center;\n  font-size: 1rem;\n  padding: 0px;\n  margin: 0px;\n  font-weight: 500;\n  font-family: "roboto" sans-serif;\n  text-transform: none;\n  color: #63666a;\n'],['\n  text-align: center;\n  font-size: 1rem;\n  padding: 0px;\n  margin: 0px;\n  font-weight: 500;\n  font-family: "roboto" sans-serif;\n  text-transform: none;\n  color: #63666a;\n']),p=o.a.section(d),u=o.a.p(m),f={catId:0,custId:0,value:"",attribute:"",color:"",brand:"",promotion:"",minPrice:0,maxPrice:0,rowCount:10,posMenu:"",startsWith:0,orderColumn:"",highlight:!1,module:"popular"},g=function(e){var t=Object(r.useRef)(!0),n=e.dynamic["RESPONSE_DYNAMIC_CONTENT_"+e.contentid],a=e.dynamic["REQUEST_DYNAMIC_CONTENT_"+e.contentid];e.dynamic["RESPONSE_DYNAMIC_CONTENT_"+e.contentid+"_TOTAL"];if(t.current){if((void 0===a||!a)&&void 0===n){var o=5===e.cart?window.innerWidth<=767?4:window.innerWidth<=1200?8:10:window.innerWidth<=767?2:6;e.getWidgetContent({params:{contentid:e.contentid,body:Object.assign({},f,{catId:e.catid?e.catid:0,rowCount:o}),url:"/search/elastic",method:"POST"}})}t.current=!1}var d=3===e.cart?2:1;return void 0===n||0===n.length?i.a.createElement(i.a.Fragment,null):i.a.createElement(p,null,e.title&&i.a.createElement("h1",{className:"title m-0"},i.a.createElement("span",{className:"uppercase"},e.title),e.description&&i.a.createElement(u,null,e.icon&&i.a.createElement("i",{className:"text-danger fa "+e.icon+" mr-1",style:{fontSize:"20px"}}),e.description)),i.a.createElement("div",{className:"container pad10 pt-2"},i.a.createElement("div",{className:"row row10"},i.a.createElement("div",{className:"container pad10"},i.a.createElement("div",{className:"row row10"},n&&n.map(function(t,n){return i.a.createElement(l.b,Object.assign({elastic:!0,key:n,shape:d,item:Object.assign({},t,{tags:e.search.tags}),tags:e.search.tags},e))})))),i.a.createElement(c.b,{to:e.link||"#",className:"d-flex justify-content-center pb-3"},i.a.createElement(s.a,{className:"border px-5 show-all-btn"},e.btntxt))))};t.default=Object(c.f)(g)}});