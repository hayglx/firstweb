class Game_Particle extends Base_Object{
    constructor(playground,x,y,radius,color,vx,vy,speed){
        super();
        this.playground=playground;
        this.scale=this.playground.scale;
        this.ctx=this.playground.game_map.ctx;
        this.x=x;
        this.y=y;
        this.vx=vx;
        this.vy=vy;
        this.color=color;
        this.speed=speed;
        this.friction=0.1;
        this.radius=radius;
        this.eps=0.1;
    }
    start(){}
    update(){
        if(this.eps>this.speed){
            this.destroy();
            return false;
        }
        this.x+=this.vx*this.speed*this.timedelta/1000;
        this.y+=this.vy*this.speed*this.timedelta/1000;
        this.speed*=(1-this.friction);
        this.render();
    }
    render(){
        this.ctx.beginPath();
        this.ctx.arc(this.x*this.scale,this.y*this.scale,this.radius*this.scale,0,Math.PI*2,false);
        this.ctx.fillStyle=this.color;
        this.ctx.fill();
    }
}