'use strict';
const $video = document.querySelector("#live");
const $wrapper = document.querySelector(".wrapper");
const $btnMute = document.querySelector(".video-btn-mute");

//타겟잡기
function getTarget(elem, className) {
  while (!elem.classList.contains(className)) {
    elem = elem.parentNode;
    if (elem.nodeName === "BODY") {
      elem = null;
      return
    }
  }
  return elem;
}

//동영상 뮤트
$btnMute.addEventListener("click", (e) => {
  e.preventDefault();
  let $mute = getTarget(e.target, "video-btn-mute");
  console.log($mute);
  if ($video.muted === true) {
    $mute.querySelector(".icon").textContent = "volume_up";
    $video.muted = false;
  }
  else {
    $mute.querySelector(".icon").textContent = "volume_off";
    $video.muted = true;
  }
})

//화면 클릭시 상세화면 or 컨트롤 바
$video.addEventListener("click", (e) => {
  e.preventDefault();
  $wrapper.classList.contains("video-detail-active") ?
    $wrapper.classList.remove("video-detail-active") :
    $wrapper.classList.add("video-detail-active");
}); 