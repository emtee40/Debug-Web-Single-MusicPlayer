import { formatTime } from './utils.js';
import { draw } from './draw.js';
import AudioPlayer from './audioPlayer.js';
import * as ui from './ui.js';

// 定义全局变量
const spectrumCanvas = document.getElementById('spectrum-canvas');
const coverImage = document.getElementById('cover-image');
const coverImageContainer = document.getElementById('cover-container');
const topSpectrumCanvas = document.getElementById('top-spectrum-canvas');
const bottomSpectrumCanvas = document.getElementById('bottom-spectrum-canvas');

const player = new AudioPlayer();

async function initAudioPlayer() {
    const { data: attachData } = await import('./attach.js');
    // create player
    player.create(attachData.musicURL, attachData.mediaType);

    const audio = player.audio;

    audio.onloadedmetadata = function () {
        ui.setTotalDuration(audio.duration);
    };

    audio.addEventListener('timeupdate', function () {
        const progress = (audio.currentTime / audio.duration) * 100;
        ui.changeProgress(progress, audio.currentTime);
    });
    audio.addEventListener('ended', function () {
        ui.changeProgress(0, null);
        ui.changePlayButtonStatus(false);
    });

    // 格式化时间
}

function startVisualizer() {
    const audioContext = player.audioContext;

    draw(player.analyser, spectrumCanvas, coverImage, coverImageContainer, topSpectrumCanvas, bottomSpectrumCanvas);

    if (audioContext.state === 'suspended') {
        // 仅在用户点击后恢复AudioContext
        audioContext.resume().then(() => {
            console.log('AudioContext resumed!');
        });
    }
}


// 播放暂停按钮功能
ui.listenPlayButtonClick(async () => {
    if (!player.init) {
        await initAudioPlayer();
    }

    if (player.paused) {
        player.play();
        startVisualizer();
    } else {
        player.pause();
    }

    ui.changePlayButtonStatus(!player.paused);
});

// 进度控制事件
ui.listenProgressChange((progress) => {
    player.currentTime = player.duration * (progress / 100);
});

// 音量滑动条输入事件处理函数
ui.listenVolumeChange((volume) => {
    player.volume = volume / 100;
});

const playPauseButton = document.getElementById('playPause');
const volumeControlInput = document.getElementById('volume-control');
const volumeStep = 5; // 音量调整的步长
const progressStep = 5; // 进度调整的步长
const maxVolume = 100; // 音量的最大值
document.addEventListener('keydown', function (event) {
    if (event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA' && event.target.isContentEditable !== true) {
        if (event.code === 'Space') {
            event.preventDefault();
            playPauseButton.click();
        } else if (event.code === 'ArrowLeft' || event.code === 'ArrowRight') {
            event.preventDefault();
            updateProgress(event.code === 'ArrowLeft' ? -progressStep : progressStep);
        } else if (event.code === 'ArrowUp' || event.code === 'ArrowDown') {
            event.preventDefault();
            updateVolume(event.code === 'ArrowUp' ? volumeStep : -volumeStep);
        }
    }
});
//Volume/Progress 0-100
function updateVolume(step) {
    const volume = player.volume * 100;
    const newVolume = volume + step;
    if (newVolume >= 0 && newVolume <= maxVolume) {
        const lastDisplay = volumeControlInput.style.display;
        volumeControlInput.style.display = 'block';
        player.volume = newVolume / 100;
        volumeControlInput.value = newVolume;
    }
}


function updateProgress(step) {
    const progress = player.currentTime / player.duration * 100;
    const newProgress = progress + step;
    if (newProgress >= 0 && newProgress <= 100) {
        player.currentTime = player.duration * (newProgress / 100);
    }
}

import('./attach.js').then((module) => {
    module.ensureLyricsArray()
})
