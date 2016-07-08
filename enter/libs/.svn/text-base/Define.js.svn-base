/**
 * Created by dyfox on 15-11-3.
 */
var mainView;
var verNumber = "?v1.0.2";
var GAME_TYPE = {
    //2
    SoundEffects:{name:"おもしろ効果音", enable:true,gameid:"benriya_omosiro",description:"ボタン１つで簡単再生。ドッキリにも使える面白い効果音集",icon:"01_fun_"},
    PitapatBomb:{name:"ドキドキ爆弾ゲーム", enable:true,gameid:"benriya_dokidoki",description:"みんなで遊べる爆弾リレーゲーム。爆発前にスマホを渡そう",icon:"02_pitapat_"},
    Lighting:{name:"照明セット", enable:true,gameid:"benriya_syoumei",description:"ペンライト、ネオンサインから選べるよ",icon:"03_neon_"},
    //1
    MajorityVote:{name:"多数決", enable:true,gameid:"benriya_tasuuketu",description:"意見が割れたらこれで解決!何に投票したかはひみつだよ",icon:"04_vote_"},
    Sortilege:{name:"くじ引き", enable:true,gameid:"benriya_kuji",description:"くじの中身はあなた次第出るかな大当たり!?",icon:"05_kuji_"},
    GhostLeg:{name:"あみだくじ", enable:true,gameid:"benriya_amida",description:"簡単シンプルなあみだくじゴールに近づくワクワク感!",icon:"06_amida_"},
    RussianRoulette:{name:"ロシアンルーレット", enable:true,gameid:"benriya_russian",description:"指先に運命をゆだねよう!ルーレットでドキドキ運試し",icon:"07_russian_"},
    ADDutchpay:{name:"お勘定・天国と地獄", enable:true,gameid:"benriya_kannjyou",description:"お会計でも楽しんじゃおう天使と悪魔はダレに微笑む?",icon:"08_warikan_"},
    LoveRedLine:{name:"運命の赤い糸", enable:true,gameid:"benriya_unmei",description:"座席決めとカップリング運命のお相手はすぐ隣に!?",icon:"09_love_"},
    Polygraph:{name:"うそ発見器", enable:true,gameid:"benriya_uso",description:"指をおくだけ、即発見!あなたは正直者?うそつき?",icon:"10_lie_"},
    Grouping:{name:"チーム分け", enable:true,gameid:"benriya_team",description:"人数、グループ数を自由に設定これで平等チーム分け",icon:"11_team_"}
    //
    //Test:{name:"common", enable:true},
};

var GAME_FONT = {
    PRO_W6:"HiraKakuProN-W6",
    PRO_W3:"HiraKakuProN-W3",
    AZUSA:"AzusaHyuga"
};

function PAD(num, n) {
    var y="00000000000000000000000000000"+num;
    return y.substr(y.length-n);
};

function ADD_CHANGESTATE_CALLBACK(cb, context){
    window.changeState_cb = cb;
    window.changeState_context = context;
};