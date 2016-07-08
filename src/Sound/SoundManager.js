/**
 * Created by nhnst on 10/23/15.
 */

(function (){

    var soundId = null;

    var audioEngine = cc.audioEngine;

    window.SoundManager = SoundManager;

    var audio = null;

    function SoundManager(){
        /*  获得支持的声音文件
        var support = [];
        var audio = document.createElement("audio");
        if(audio.canPlayType) {
            var ogg = audio.canPlayType('audio/ogg; codecs="vorbis"');
            if (ogg && ogg !== "") support.push(".ogg");
            var mp3 = audio.canPlayType("audio/mpeg");
            if (mp3 && mp3 !== "") support.push(".mp3");
            var wav = audio.canPlayType('audio/wav; codecs="1"');
            if (wav && wav !== "") support.push(".wav");
            var mp4 = audio.canPlayType("audio/mp4");
            if (mp4 && mp4 !== "") support.push(".mp4");
            var m4a = audio.canPlayType("audio/x-m4a");
            if (m4a && m4a !== "") support.push(".m4a");
        }
       */
    }

    SoundManager.instance = function(){
        if(!window.soundManager){
            window.soundManager = new SoundManager();
        }
        return window.soundManager;
    };

/************************     Music      ************************/
    SoundManager.prototype.playMusic = function (MUSIC_FILE,loop) {
        cc.log("play background music");
        audioEngine.playMusic(MUSIC_FILE, loop);
    };

    SoundManager.prototype.stopMusic = function (clear) {
        cc.log("stop background music");
        if (audioEngine.isMusicPlaying())
            audioEngine.stopMusic(clear);
    };

    SoundManager.prototype.addMusicVolume = function () {
        cc.log("add bakcground music volume");
        audioEngine.setMusicVolume(audioEngine.getMusicVolume() + 0.1);
    };

    SoundManager.prototype.subMusicVolume = function () {
        cc.log("sub backgroud music volume");
        audioEngine.setMusicVolume(audioEngine.getMusicVolume() - 0.1);
    };

    SoundManager.prototype.isMusicPlaying = function () {
        if (audioEngine.isMusicPlaying()) {
            cc.log("background music is playing");
        }
        else {
            cc.log("background music is not playing");
        }
    };
/************************     Effect      ************************/
    SoundManager.prototype.playEffect = function (EFFECT_FILE) {
        cc.log("play effect=="+EFFECT_FILE);
        soundId = audioEngine.playEffect(EFFECT_FILE);
        //soundId.addEventListener('ended', function(){
        //    cc.log("1111");
        //}, false);
        return soundId;
    };

    SoundManager.prototype.stopEffect = function (id) {
        cc.log("stop effect");
        if(id){
            audioEngine.stopEffect(id);
            id = null;
        }else{
            audioEngine.stopEffect(soundId);
            soundId = null;
        }

    };

    SoundManager.prototype.stopAllEffects = function () {
        cc.log("stop all effects");
        audioEngine.stopAllEffects();
        soundId = null;
    };

    SoundManager.prototype.addEffectsVolume = function () {
        cc.log("add effects volume");
        audioEngine.setEffectsVolume(audioEngine.getEffectsVolume() + 0.1);
    };

    SoundManager.prototype.subEffectsVolume = function () {
        cc.log("sub effects volume");
        audioEngine.setEffectsVolume(audioEngine.getEffectsVolume() - 0.1);
    };

    /************************     other      ************************/

    SoundManager.prototype.playSong = function (selector,srcPath,loop) {
        try
        {
            SoundManager.prototype.stopSong();
            audio = document.createElement("audio");
            //audio = document.getElementById("audio");
            var rootPath = cc.game.config["resPath"];
            audio.src = rootPath + srcPath;
            if(loop)
                audio.loop = true;
            else
                audio.loop = false;
            audio.play();
            //audio.autoplay = "autoplay";
            //document.appendChild(audio);
            //播放控制函数
            //audio.addEventListener("loadeddata",
            //    function() {
            //    }, false);
            //
            //audio.addEventListener("pause",
            //    function() { //监听暂停
            //    }, false);
            //audio.addEventListener("play",
            //    function() { //监听暂停
            //    }, false);

            if(selector && !loop)
                audio.addEventListener("ended", selector, false);
        }
        catch (e)
        {
            //alert(e.message);
            //alert(e.description);
            //alert(e.number);
            //alert(e.name);
            //throw new Error(10,"asdasdasd");
            SoundManager.prototype.stopSong();
        }


    };

    SoundManager.prototype.stopSong = function () {
        SoundManager.prototype.stopMusic();
        if(audio){
            audio.pause();
            audio = null;
        }

    };

})();