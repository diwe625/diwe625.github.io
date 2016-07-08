/**
 * Created by dyfox on 15-10-16.
 */
(function (){

    function SceneController(){

    }

    SceneController.instance = function(){
        if(!window.sceneController){
            window.sceneController = new SceneController();
        }
        return window.sceneController;
    };

    SceneController.prototype.replaceScene = function(scene, res){
        cc.loader.releaseAll();
        if(res){
            var tempRes = [];
            for(var i in res){
                tempRes.push(res[i]);
            }
            for(var i in GlobalRes){
                tempRes.push(GlobalRes[i]);
            }
            cc.LoaderScene.preload(tempRes, function () {
                cc.director.runScene(scene);
            }, this);
        }else{
            cc.director.runScene(scene);
        }
    };

    SceneController.prototype.gotoScene = function(type){
        if(type == -1){
            SceneController.instance().replaceScene(new MainScene(), g_MainRes);
            return;
        }

        if(type == -2){
            SceneController.instance().replaceScene(new TestScene(), []);
            return;
        }

        if(!type.enable){
            return;
        }
        switch (type.name){
            case  GAME_TYPE.Grouping.name:
                SceneController.instance().replaceScene(new GroupingScene(), g_GroupingRes);
                break;
            case  GAME_TYPE.RussianRoulette.name:
                SceneController.instance().replaceScene(new RussianRouletteScene(), g_RussianRouletteRes);
                break;
            case  GAME_TYPE.Sortilege.name:
                SceneController.instance().replaceScene(new SortilegeScene(), g_SortilegeRes);
                break;
            case  GAME_TYPE.MajorityVote.name:
                SceneController.instance().replaceScene(new MajorityVoteScene(), g_MajorityVoteRes);
                break;
            case  GAME_TYPE.GhostLeg.name:
                SceneController.instance().replaceScene(new GhostLegScene(), g_GhostLegRes);
                break;
            case  GAME_TYPE.LoveRedLine.name:
                SceneController.instance().replaceScene(new LoveRedLineScene(), g_LoveRedLineRes);
                break;
            case  GAME_TYPE.Polygraph.name:
                SceneController.instance().replaceScene(new PolygraphScene(), g_PolygraphRes);
                break;
            case  GAME_TYPE.ADDutchpay.name:
                SceneController.instance().replaceScene(new ADDutchpayScene(), g_ADDutchpayRes);
                break;
            case  GAME_TYPE.PitapatBomb.name:
                SceneController.instance().replaceScene(new PitapatBombScene(), g_PitapatBombRes);
                break;
            case  GAME_TYPE.SoundEffects.name:
                SceneController.instance().replaceScene(new SoundEffectsScene(), g_SoundEffectsRes);
                break;
            case  GAME_TYPE.Lighting.name:
                SceneController.instance().replaceScene(new LightingScene(), g_LightingRes);
                break;
        }
    };

    window.SceneController = SceneController;

})();