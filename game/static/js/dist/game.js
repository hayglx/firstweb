class F_GameMenu{
    constructor(root){
        this.root=root;
        this.$menu = $(`
<div class="game-menu">
    <div class="game-menu-field">
        <div class="game-menu-field-item game-menu-field-item-singlemode">
            单人模式
        </div>
        <br>
        <div class="game-menu-field-item game-menu-field-item-multimode">
            多人模式
        </div>
        <br>
        <div class="game-menu-field-item game-menu-field-item-settings">
            设置
        </div>
    </div>
</div>
`);
        this.root.$game.append(this.$menu);
        this.$single=this.$menu.find('.game-menu-field-item-singlemode');
        this.$multi=this.$menu.find('.game-menu-field-item-multimode');
        this.$settings=this.$menu.find('.game-menu-field-item-settings');
        this.start();
    }
    start(){
        this.add_listening_events();
    }
    add_listening_events(){
        let outer=this;
        this.$single.click(function(){
            outer.hide();
            outer.root.playground.show();
        });
        this.$multi.click(function(){
            console.log("click multi mode");
        });
        this.$settings.click(function(){
            console.log("click settings");
        });
    }
    
    show(){//显示menu页面
        this.$menu.show();
    }
    hide(){//隐藏menu界面
        this.$menu.hide();
    }
}
let GAME_OBJECTS=[];
class Base_Object{
    constructor(){
        GAME_OBJECTS.push(this);
        this.has_called_start=false;//是否执行过start函数
        this.timedelta=0;//当前帧距离上一帧的时间间隔
    }
    start()// 只会在第一帧执行
    {
    
    }
    update()//每一帧执行
    {

    }
    on_destroy()//销毁前执行
    {

    }
    destroy()//销毁该物体
    {
        this.on_destroy();
        for(let i=0;i<GAME_OBJECTS.length;i++){
            if(AX_GAME_OBJECTS[i]===this){
                GAME_OBJECTS.splice(i,1);
                break;
            }
        }
    }
}

let last_timestamp;
let GAME_ANIMATION=function(timestamp){
    for(let i=0;i<GAME_OBJECTS.length;i++){
        let obj=GAME_OBJECTS[i];
        if(!obj.has_called_start){
            obj.start();
            obj.has_called_start=true;
        }
        else{
            obj.timedelta=timestamp-last_timestamp;
            obj.update();
        }
    }
    last_timestamp=timestamp;
    requestAnimationFrame(GAME_ANIMATION);
}
requestAnimationFrame(GAME_ANIMATION);






class Game_Map extends Base_Object{
    constructor(playground){
        super();
        this.playground=playground;
        this.$canvas=$(`<canvas></canvas>`);
        this.ctx=this.$canvas[0].getContext('2d');
        this.ctx.canvas.width=this.playground.width;
        this.ctx.canvas.height=this.playground.height;
        this.playground.$playground.append(this.$canvas);
    
    }
    start(){
    
    }
    update(){
        this.render();
    }
    render(){
        this.ctx.fillStyle="rgba(100,11,200,0.5)";
        this.ctx.fillRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height);
    }
}
class Game_Player extends Base_Object{
    constructor(playground,x,y,radius,color,speed,is_me){
        super();
        this.x=x;
        this.y=y;
        this.playground=playground;
        this.ctx=this.playground.game_map.ctx;
        this.radius=radius;
        this.speed=speed;
        this.is_me=is_me;
        this.color=color;
        this.eps=0.1;

        this.vx=0;
        this.vy=0;
        this.move_len=0;
    }
    start(){
        if(this.is_me){
            this.add_listening_events();
        }
    }
    add_listening_events(){
        this.playground.game_map.$canvas.on("contextmenu",function(){return false;});
        let outer=this;
        this.playground.game_map.$canvas.mousedown(function(e){
            if(e.which===3){
                outer.move_to(e.clientX,e.clientY);
            }
        })
    }
    move_to(tx,ty){
        this.move_len=this.get_dist(this.x,this.y,tx,ty);
        let angle=Math.atan2(ty-this.y,tx-this.x);
        this.vx=Math.cos(angle);
        this.vy=Math.sin(angle);
        //console.log(this.move_len,this.vx);
        //console.log(this.x,this.y);
    }
    get_dist(x1,y1,x2,y2){
        let dx=x2-x1;
        let dy=y2-y1;
        return Math.sqrt(dx*dx+dy*dy);
    }
    update(){

        if(this.move_len<this.eps){
            this.move_len=0;
            this.vx=this.vy=0;
        }
        else{
            let moved_act=Math.min(this.move_len,(this.speed*this.timedelta/1000));
            this.x+=this.vx*moved_act;
            this.y+=this.vy*moved_act;
            this.move_len-=moved_act;
        }
        this.render();
    }
    render(){
        this.ctx.beginPath();
        this.ctx.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
        this.ctx.fillStyle=this.color;
        this.ctx.fill();
    }
}
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
export class F_Game{
    constructor(id){
        this.id=id;
        this.$game=$('#'+id);
        //this.menu=new F_GameMenu(this);
        this.playground= new GamePlayground(this);
    }
}
