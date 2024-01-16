import { formatTime } from './utils.js';

const playPauseButton = document.getElementById('playPause');
const songProgress = document.getElementById('song-progress');
const timeElapsed = document.getElementById('time-elapsed');
const totalDuration = document.getElementById('total-duration');
const volumeBtn = document.getElementById('volume-btn');
const volumeControl = document.getElementById('volume-control');
const volumeControlContainer = document.getElementById('volume-control-container');
const lyricsElement = document.getElementById('lyrics');
const lyricsShowButton = document.getElementById('lyrics-show');
const likeThisButton = document.getElementById('like-this');

let isSlideProgress = false;

let lastLyricIndex = -1;

/**
 *
 * @param {number} progress
 * @param {number | null} currentTime
 */
export function changeProgress(progress, currentTime) {
    // 确保用户没有在滑动
    if (!isSlideProgress) {
        songProgress.value = progress;
    }

    if (!currentTime || isNaN(currentTime)) {
        return;
    }

    timeElapsed.textContent = formatTime(currentTime);
    let currentLyricIndex = 0;

    for (let i = 0; i < window.attach.lyricsArray.length; i++) {
        if (currentTime >= window.attach.lyricsArray[i].time) {
            currentLyricIndex = i;
        }
    }

    if (currentLyricIndex != lastLyricIndex) {
        const text = window.attach.lyricsArray[currentLyricIndex].text;
        lyricsElement.classList.remove('lyrics-active');
        // lyricsElement.textContent = lyricsArray[currentLyricIndex].text;
        setTimeout(() => {
            lyricsElement.textContent = text;
            lyricsElement.classList.add('lyrics-active');
            lastLyricIndex = currentLyricIndex;
        }, 100);
        return;
    }
}

export function changeVolume(volume) {
    volumeControl.style.display = 'block';
    volumeControl.value = volume;
}

/**
 *
 * @param {boolean} status
 */
export function changePlayButtonStatus(status) {
    if (!status) {
        playPauseButton.style.backgroundImage = "url('./images/play_icon.svg')";
    } else {
        playPauseButton.style.backgroundImage =
            "url('./images/pause_icon.svg')";
    }
}

/**
 *
 * @param {()=>void} func
 */
export function listenPlayButtonClick(func) {
    playPauseButton.addEventListener('click', function () {
        func();
    });
}

/**
 *
 * @param {number} duration
 */
export function setTotalDuration(duration) {
    if (duration == null || duration == undefined || duration == Infinity || isNaN(duration) || duration < 0) {
        return;
    }
    totalDuration.textContent = formatTime(duration);
}

/**
 *
 * @param {(progress: number) => void} func
 */
export function listenProgressChange(func) {
    songProgress.addEventListener('input', function () {
        func(this.value);
    });
}

export function clickPlayButton() {
    playPauseButton.click();
}

/**
 *
 * @param {(progress: number) => void} func
 */
export function listenVolumeChange(func) {
    volumeControl.addEventListener('input', function () {
        func(this.value);
    });
}

// 音量按钮点击事件处理函数
volumeBtn.addEventListener('click', function () {
    volumeControlContainer.classList.toggle('volume-control-container__opened')
});

songProgress.addEventListener('mousedown', () => {
    isSlideProgress = true;
});

songProgress.addEventListener('mouseup', () => {
    isSlideProgress = false;
});

// 添加点击外部隐藏音量控制的事件监听
document.addEventListener('click', function (event) {
    const isClickInsideVolumeContainer =
        volumeBtn.contains(event.target) ||
        volumeControl.contains(event.target);

    if (!isClickInsideVolumeContainer) {
        // 如果点击的是音量按钮或滑动条之外的地方，则隐藏音量滑动条
        volumeControlContainer.classList.remove('volume-control-container__opened')
    }

});

//歌词显隐性（lrcExistLike设置hide时这个按钮也隐藏）
lyricsShowButton.addEventListener('click', function () {
    const lyricsContainer = document.getElementById('lyrics-container');
    if (this.classList.toggle('with-line')) {
        lyricsContainer.style.display = 'none';
    } else {
        lyricsContainer.style.display = 'inline-block';
    }
});

//喜欢按钮
likeThisButton.addEventListener('click', function () {
    if (this.classList.toggle('like-this-btn-active')) {
        //
    } else {
        //
    }
});