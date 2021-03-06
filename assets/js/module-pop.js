'use strict';
(() => {
  //팝업
  const $menuBtn = document.querySelector(".menu-button");
  const $recentBtn = document.querySelector(".recent-btn");
  const $searchBtn = document.querySelector(".search-btn");
  const $popDark = document.querySelector(".dark");
  const $popCloseBtn = document.querySelectorAll(".pop-close-btn");
  let setID;
  //Func 팝업열기
  const popUp = (e) => {
    const href = e.currentTarget.dataset.href;
    const $pop = document.querySelector(href);
    const $popclose = $pop.querySelector(".pop-close-btn");

    if ($pop.style.display === "block" && e.target.dataset.href === document.body.dataset.pop) return;
    if (document.body.classList.contains("bodyfixed")) {
      //clearTimeout(setID);
      closePop(e, document.body);
    }

    document.body.classList.add('bodyfixed');
    document.body.dataset.pop = href;

    $pop.setAttribute("tabindex", "0")
    $pop.focus();
    $pop.style.display = `block`;

    $popDark.style.display = "block";
    $popDark.style.opacity = "1";

    $popDark.dataset.href = href;
    $popclose.dataset.href = href;

    setID = setTimeout(() => {
      $pop.style.transform = `translate3d(0%,0,0)`;
    }, 300);
  }
  //Func 팝업닫기
  const closePop = (e, eTartget) => {
    const href = eTartget ? eTartget.dataset.pop : e.currentTarget.dataset.href;
    const $pop = document.querySelector(href);
    const $popclose = $pop.querySelector(".pop-close-btn");

    $popDark.dataset.href = "";
    $popclose.dataset.href = "";

    document.body.classList.remove('bodyfixed');
    document.body.dataset.pop = "";

    $pop.setAttribute("tabindex", "-1");
    $menuBtn.focus();
    $pop.style.transform = `translate3d(-100%,0,0)`;
    $popDark.style.opacity = "0";

    if (eTartget) {
      $popDark.style.display = "none";
      $pop.style.display = `block`;
    } else {
      setTimeout(() => {
        $popDark.style.display = "none";
        $pop.style.display = `block`;
      }, 300);
    }

  }

  //메뉴열기
  $menuBtn.addEventListener("click", (e) => { popUp(e) });
  //최근본 열기
  $recentBtn.addEventListener("click", (e) => { popUp(e) });
  $searchBtn.addEventListener("click", (e) => { popUp(e) });
  //팝업닫기
  $popCloseBtn.forEach(elem => {
    elem.addEventListener("click", (e) => {
      closePop(e);
    });
  });
  //오버레이 팝업창 닫기
  $popDark.addEventListener("click", (e) => { closePop(e); });

  document.body.classList.add("loader-body");
  const $loader = document.querySelector(".loader")


  window.addEventListener('load', () => {

    //loading bar 재생 제거
    //바디 재생 제거
    setTimeout(() => {
      document.body.classList.remove("loader-body");
      //  $loader.remove();
    }, 500);
    //loader 지우기

  });

})();
