webpackJsonp([5],{1921:function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var r=t(0),a=t.n(r),o=(t(588),t(318)),l=t.n(o),c=t(9),d=function(e){try{var n={slidesPerView:window.innerWidth<576?2:e.slidesperview||1,spaceBetween:window.innerWidth<576?5:10,loop:!0,autoplay:{delay:1e3*(e.delay||3),disableOnInteraction:!1},pagination:{type:"bullets",clickable:!0}};return a.a.createElement(l.a,Object.assign({},n,{shouldSwiperUpdate:!0,rebuildOnUpdate:!0,style:{paddingTop:"1px"},renderNextButton:function(){return a.a.createElement(a.a.Fragment,null)},renderPrevButton:function(){return a.a.createElement(a.a.Fragment,null)}}),e.brands&&e.brands.map(function(e){var n="https://cdn.emartmall.mn/"+e.imgnm;return n&&a.a.createElement(c.b,{to:"/brand/"+e.brandid,className:"border mt-5"},a.a.createElement("div",{style:{backgroundImage:"url("+n+")",backgroundSize:"100%",backgroundRepeat:"no-repeat",backgroundPosition:"center",height:"200px",backgroundColor:"#fff"}}))}))}catch(e){return console.log("%c 🥪 error: ","font-size:20px;background-color: #93C0A4;color:#fff;",e),a.a.createElement(a.a.Fragment,null)}};n.default=d}});