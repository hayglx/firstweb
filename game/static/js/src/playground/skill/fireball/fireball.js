class Game_Fireball extends Base_Object{
    constructor(playground,player,x,y,radius,color,speed,move_len,vx,vy,damage){
        super();
        this.playground=playground;
        this.scale=this.playground.scale;
        this.player=player;
        this.x=x;
        this.y=y;
        this.radius=radius;
        this.color=color;
        this.speed=speed;
        this.ctx=playground.game_map.ctx;
        this.move_len=move_len;
        this.eps=0.1;
        this.vx=vx;
        this.vy=vy;
        this.damage=damage;
        this.uuid=this.player.uuid;
        console.log('create fireball:',this.uuid);
    }
    start(){}
    update(){
        if(this.move_len<this.eps){
            this.destroy();
            return false;
        }
        this.update_move();
        if(this.player.character!=='enemy')
            this.update_attack();
        this.render();
    }
    update_move(){
        let moved=Math.min(this.move_len,this.speed*this.timedelta/1000);
        this.x+=this.vx*moved;
        this.y+=this.vy*moved;
        this.move_len-=moved;
    }
    update_attack(){
        for(let i=0;i<this.playground.players.length;++i){
            let player=this.playground.players[i];
            if(player!=this.player&&this.is_collision(player)){
                this.attack(player);
                break;
            }
        }
    }
    get_dist(x1,y1,x2,y2){
        let a1=x2-x1,a2=y2-y1;
        return Math.sqrt(a1*a1+a2*a2);
    }
    is_collision(player){
        let distance=this.get_dist(this.x,this.y,player.x,player.y);
        return distance<=this.radius+player.radius;
    }
    attack(player){
        this.destroy();
        let angle=Math.atan2(player.y-this.y,player.x-this.x);
        player.is_attacked(angle,this.damage);
        if(this.playground.mode==='multi mode'){
            this.playground.mps.send_attack(player.uuid,player.x,player.y,angle,this.damage,this.uuid);
        }
    }
    render(){
        this.ctx.beginPath();
        this.ctx.arc(this.x*this.scale,this.y*this.scale,this.radius*this.scale,0,Math.PI*2,false);
        this.ctx.fillStyle=this.color;
        this.ctx.fill();
    }
    on_destroy(){
        let fireballs=this.player.fireballs;
        for(let i=0;i<fireballs.length;i++){
            if(fireballs[i]===this){
                fireballs.splice(i,1);
                break;
            }
        }
    }

}
