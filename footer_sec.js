function puImgPs(){for(var e=qSell(".ntry img.imgThm"),t=0;t<e.length;t++)if(e[t].getAttribute("data-src")){var n=e[t].getAttribute("data-src");1!=n.includes("blogspot")&&1!=n.includes("googleusercontent")||1!=n.includes("-pd")&&1!=n.includes("-p-k-no-nu")||0!=n.includes("-rw")||e[t].setAttribute("data-src",n.replace("-nu","-nu-rw-e30").replace("-pd","-pd-rw-e30"))}} "undefined"!=typeof infinite_scroll&&infinite_scroll.on("load",() => { puImgPs();typeof puViews=="function"&&(puViews());typeof bkMrk=="function"&&(bkMrk());typeof pushAds=="function"&&(pushAds()); });


/* Dark Mode */ function darkMode(){var e=qSel("#mainCont");Pu.sLS("webMode","drK"===Pu.gLS("webMode")?"lgT":"drK"),"drK"===Pu.gLS("webMode")?(e.classList.remove("syD","lgT"),addCt(e,"drK")):(e.classList.remove("drK","syD"),addCt(e,"lgT")),themeColor("themeC")};
/* Header Scroll */ function headScroll(){var e=window.pageYOffset||document.documentElement.scrollTop,d=qSel("#header"),l=qSel("#mobile-menu");20<e?(addCt(d,"stick"),addCt(l,"slide")):(remCt(d,"stick"),remCt(l,"slide"))}window.addEventListener("scroll",headScroll);
/* Private Blog Notif */ "true"==isPrivateBlog&&toastNotif('<i class="check"></i>'+blogTitle+" Blog is Private.");

 
/* LAZYLOAD SCRIPTS - DON'T REMOVE FUNCTIONS */
function lazyCustomJs(){
  /* lazy category post */ if(getid('HTML2')!=null){ctgryPst(ctgryLb1, '#HTML2 .ctgry', 6, 600, 200, true);if(getid('HTML3')!=null){ctgryPst(ctgryLb2, '#HTML3 .ctgry', 6, 600, 200, true)}};
  /* YOUR CUSTOM JS */
};
function scrollCustomJs(){
  /* YOUR CUSTOM JS */
};