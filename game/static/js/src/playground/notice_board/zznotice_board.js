class NoticeBoard extends Base_Object{
    constructor(playground){
        super();
        this.playground=playground;
        this.ctx=this.playground.game_map.ctx;
        this.text="已就绪："+this.playground.player_count+"人";
        this.start;
    }
    start(){

    }
    write(text){
        if(this.playground.state=='waiting')this.text="已就绪："+this.playground.player_count+"人";
        else if(this.playground.state=='fighting')this.text="开始战斗！";
    }
    update(){
        this.render();
    }
    render(){
        this.ctx.font=this.playground.width/40 + 'px serif';
        this.ctx.fillStyle='white';
        //this.ctx.textAlign='center';
        this.ctx.fillText(this.text,this.playground.width/2,this.playground.height/20);
    }
}
