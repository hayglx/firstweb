class GamePlayground{
    constructor(root){
        this.root=root;
        this.$playground=$(`<div class="game-playground"></div>`);
        this.hide();
        this.start();
    }
    get_ramdom_color(){
        let colors=["blue","red","pink","yellow","green","orange"];
        return colors[Math.floor(Math.random()*6)];
    }
    resize(){
        this.width=this.$playground.width();
        this.height=this.$playground.height();
        let unit=Math.min(this.width/16,this.height/9);
        this.width=unit*16;
        this.height=unit*9;
        this.scale=this.height;
        if(this.game_map)this.game_map.resize();
    }
    show(mode){//显示游戏界面
        this.root.$game.append(this.$playground);
        this.game_map=new Game_Map(this);
        this.$playground.show();
        this.width=this.$playground.width();
        this.height=this.$playground.height();
        this.notice_board=new NoticeBoard(this);
        this.player_count=0;

        this.resize();
        this.state='waiting';//waiting->fighting->over
        this.mode=mode;
        this.players=[];
        let outer=this;
        this.players.push(new Game_Player(this,this.width/2/this.scale,this.height/2/this.scale,0.05,"white",0.15,'me',this.root.settings.username,this.root.settings.photo));

        if(mode==="single mode"){
            for(let i=0;i<6;++i){
                let color=this.get_ramdom_color();
                this.players.push(new Game_Player(this,this.width/2/this.scale,0.5,0.05,color,0.15,'robot'));
            }
        }
        else if(mode=="multi mode"){
            this.mps=new MultiPlayerSocket(this);

            this.mps.ws.onopen=function(){
                outer.mps.send_create_player(outer.root.settings.username,outer.root.settings.photo);
            };
        }
    }
    hide(){//隐藏游戏界面
        this.$playground.hide();
    }
    start(){
        let outer=this;
        $(window).resize(function(){
            outer.resize();
        });
    }
}
