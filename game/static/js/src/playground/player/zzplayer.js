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
