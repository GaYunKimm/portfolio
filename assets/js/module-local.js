'use strict';
(() => {
  const $themeBtn = document.querySelector(".theme-toggle-btn");
  //data 로드
  const load = () => {
    const data = localStorage.getItem("application");
    if (data !== null) {
      return JSON.parse(data);
    } else {
      return {
        background: "null",
        user: "",
      }
    }
  }
  //Data 값 저장
  const data = load();
  //로컬스토리지 저장
  const save = () => {
    localStorage.setItem("application", JSON.stringify(data));
  }
  //Func 테마 변경
  const changeTheme = (theme) => {
    const themeIcon = theme === "dark" ? "light_mode" : "nights_stay";
    const themeText = theme === "dark" ? "라이트모드" : "다크모드";
    const themeData = theme === "dark" ? "light" : "dark"

    $themeBtn.querySelector(".gnb-list-text").innerText = themeText;
    $themeBtn.querySelector(".gnb-list-icon span").innerText = themeIcon;
    $themeBtn.dataset.theme = themeData;
    document.body.dataset.theme = theme;

    data.background = theme;
    save(data)
  }

  //초기화 Theme
  changeTheme(data.background);
  //클릭 버튼
  $themeBtn.addEventListener("click", (e) => {
    const theme = e.currentTarget.dataset.theme;
    changeTheme(theme);
  });
})();
