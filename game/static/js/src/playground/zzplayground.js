class GamePlayground{
    constructor(root){
        this.root=root;
        this.$playground=$(`<div class="game-playground"></div>`);
        
        this.root.$game.append(this.$playground);
        this.width=this.$playground.width();
        this.height=this.$playground.height();
        this.game_map=new Game_Map(this);
        this.players=[];
        this.players.push(new Game_Player(this,this.width/2,this.height/2,this.height*0.05,"white",this.height*0.15,true));
        for(let i=0;i<6;++i){
            let color=this.get_ramdom_color();
            this.players.push(new Game_Player(this,this.width/2,this.height/2,this.height*0.05,color,this.height*0.15,false));
        }
        this.start();
        
    }
    get_ramdom_color(){                                                 
        let colors=["blue","red","pink","yellow","green","orange"];
        return colors[Math.floor(Math.random()*6)];
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
