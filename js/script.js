const wrapper = document.querySelector(".wrapper"),
  musicImg = document.querySelector(".img-area img"),
  musicName = document.querySelector(".song-details .name"),
  musicArtist = document.querySelector(".song-details .artist"),
  mainAudio = document.querySelector("#main-audio"),
  playPauseBtn = wrapper.querySelector(".play-pause"),
  prevBtn = wrapper.querySelector("#prev"),
  nextBtn = wrapper.querySelector("#next"),
  progressArea = wrapper.querySelector(".progress-area"),
  progressBar = wrapper.querySelector(".progress-bar"),
  repeatBtn = wrapper.querySelector("#repeat-plist"),
  moreMusicBtn = wrapper.querySelector("#more-music"),
  closeMusicBtn = wrapper.querySelector("#close"),
  musicList = wrapper.querySelector(".music-list"),
  ulTag = wrapper.querySelector("ul");

let musicIndex = Math.floor(Math.random() * allMusic.length + 1);
console.log("musicIndex", musicIndex);

window.addEventListener("load", () => {
  loadMusic(musicIndex);
  playSongList();
  mainAudio.addEventListener("timeupdate", (e) => {
    const currentTime = e.target.currentTime; // getting playing song current time
    const duration = e.target.duration; //getting total playing song time;
    let progressWidth = (currentTime / duration) * 100;
    //   console.log(progressWidth);
    progressBar.style.width = `${progressWidth}%`;
  
    let musicCurrentTime = wrapper.querySelector(".current-time"),
      musicDuration = wrapper.querySelector(".max-duration");
  
    mainAudio.addEventListener("loadeddata", () => {
      let mainAudioDuration = mainAudio.duration;
      let totalMin = Math.floor(mainAudioDuration / 60);
      let totalSec = Math.floor(mainAudioDuration % 60);
      totalSec < 10 ? (totalSec = `0${totalSec}`) : "";
      musicDuration.innerText = `${totalMin}:${totalSec}`;
    });
  
    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);
    currentSec < 10 ? (currentSec = `0${currentSec}`) : "";
    musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
  });
});

function loadMusic(indexNumber) {
  musicImg.src = `images/${allMusic[indexNumber - 1].img}.jpg`;
  musicName.innerText = allMusic[indexNumber - 1].name;
  musicArtist.innerText = allMusic[indexNumber - 1].artist;
  mainAudio.src = `songs/${allMusic[indexNumber - 1].src}.mp3`;
}

function playMusic() {
  wrapper.classList.add("paused");
  playPauseBtn.querySelector("i").innerText = "pause";
  mainAudio.play();
  playSongList();
}
function pauseMusic() {
  wrapper.classList.remove("paused");
  playPauseBtn.querySelector("i").innerText = "play_arrow";
  mainAudio.pause();
}

function prevMusic() {
  musicIndex--;
  musicIndex < 1 ? (musicIndex = allMusic.length) : (musicIndex = musicIndex);
  console.log(musicIndex);
  loadMusic(musicIndex);
  playMusic();
  playSongList();
}

function nextMusic() {
  musicIndex++;
  musicIndex > allMusic.length ? (musicIndex = 1) : (musicIndex = musicIndex);
  console.log(musicIndex);
  loadMusic(musicIndex);
  playMusic();
  playSongList();
}

playPauseBtn.addEventListener("click", () => {
  const isMusicPlay = wrapper.classList.contains("paused");
  //first load, wrapper doesn't contain class paused so when click to playPauseBtn it will check  if wrapper contains class "paused" then pauseMusic() else playMusic()
  isMusicPlay ? pauseMusic() : playMusic();
});

prevBtn.addEventListener("click", () => {
  prevMusic();
});

nextBtn.addEventListener("click", () => {
  nextMusic();
});

// update progress bar width according to music current time


//update playing song currentTime on according to the progress bar width
progressArea.addEventListener("click", (e) => {
  let progressWidth = progressArea.clientWidth; //getting width of progressArea
  let clickedOffsetX = e.offsetX; // getting offset X value
  let songDuration = mainAudio.duration; //song total duration
  // console.log(clickedOffsetX, progressWidth, songDuration);

  mainAudio.currentTime = (clickedOffsetX / progressWidth) * songDuration;
  playMusic();
});

//change mode repeat_one, loop,shuffle icon onClick
repeatBtn.addEventListener("click", () => {
  let getText = repeatBtn.innerText;
  switch (getText) {
    case "repeat":
      repeatBtn.innerText = "repeat_one";
      repeatBtn.setAttribute("title", "Song looped");
      break;

    case "repeat_one":
      repeatBtn.innerText = "shuffle";
      repeatBtn.setAttribute("title", "Playback shuffled");

      break;

    case "shuffle":
      repeatBtn.innerText = "repeat";
      repeatBtn.setAttribute("title", "Playlist looped");
      break;
  }
});

//code for what to do after song ended
mainAudio.addEventListener("ended", () => {
  let getText = repeatBtn.innerText;
  switch (getText) {
    case "repeat":
      nextMusic();
      break;

    case "repeat_one":
      mainAudio.currentTime = 0;
      loadMusic(musicIndex);
      playMusic();
      break;

    case "shuffle":
      let randomIndex = Math.floor(Math.random() * allMusic.length + 1);
      console.log("randomIndex", randomIndex);
      if (musicIndex == randomIndex) {
        randomIndex = Math.floor(Math.random() * allMusic.length + 1);
        console.log("anotherrandom", randomIndex);
        musicIndex = randomIndex;
      } else {
        musicIndex = randomIndex;
      }
      loadMusic(musicIndex);
      playMusic();
      break;
  }
});

moreMusicBtn.addEventListener("click", () => {
  musicList.classList.toggle("show");
});

closeMusicBtn.addEventListener("click", () => {
  moreMusicBtn.click();
});

for (let i = 0; i < allMusic.length; i++) {
  //let's pass the song name, artist from the array
  let liTag = `<li li-index="${i + 1}">
                <div class="row">
                  <span>${allMusic[i].name}</span>
                  <p>${allMusic[i].artist}</p>
                </div>
                <span id="${allMusic[i].src}" class="audio-duration">3:40</span>
                <audio class="${allMusic[i].src}" src="songs/${allMusic[i].src}.mp3"></audio>
              </li>`;
  ulTag.insertAdjacentHTML("beforeend", liTag); //inserting the li inside ul tag

  let spanAudioDuration = ulTag.querySelector(`#${allMusic[i].src}`),
    liAudio = ulTag.querySelector(`.${allMusic[i].src}`);
  liAudio.addEventListener("loadeddata", () => {
    let duration = liAudio.duration,
      totalMin = Math.floor(duration / 60),
      totalSec = Math.floor(duration % 60);
    totalSec < 10 ? (totalSec = `0${totalSec}`) : "";
    spanAudioDuration.innerText = `${totalMin}:${totalSec}`;
    spanAudioDuration.setAttribute("t-duration", `${totalMin}:${totalSec}`);
  });
}

function playSongList() {
  const allLiTag = ulTag.querySelectorAll("li");

  for (let j = 0; j < allLiTag.length; j++) {
    let audioTag = allLiTag[j].querySelector(".audio-duration");
    allLiTag[j].setAttribute("onclick", "liClicked(this)");
    //then when click another li, this function will remove the class playing from the last li

    if (allLiTag[j].classList.contains("playing")) {
      allLiTag[j].classList.remove("playing");
      let audioDuration = audioTag.getAttribute("t-duration");
      audioTag.innerText = audioDuration;
    }
    //first add playing class to liTag is clicked
    if (allLiTag[j].getAttribute("li-index") == musicIndex) {
      allLiTag[j].classList.add("playing");
      audioTag.innerText = "Playing";
    }
  }
}

function liClicked(element) {
  getLiIndex = element.getAttribute("li-index");
  musicIndex = getLiIndex;
  loadMusic(musicIndex);
  playMusic();
  playSongList();
}
