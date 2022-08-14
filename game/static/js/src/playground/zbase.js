class GamePlayground{
    constructor(root){
        this.root=root;
        this.$playground=$(`<div>游戏界面</div>`);
        this.root.$game.append(this.$playground);
        this.start();
    }
    show(){//显示游戏界面
        this.$playground.show();
    }
    hide(){//隐藏游戏界面
        this.$playground.hide();
    }
    start(){
        
    }
}
