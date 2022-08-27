class Game_Player extends Base_Object{
    constructor(playground,x,y,radius,color,speed,character,username,photo){
        super();
        this.x=x;
        this.y=y;
        this.playground=playground;
        this.ctx=this.playground.game_map.ctx;
        this.radius=radius;
        this.speed=speed;
        this.character=character;
        this.username=username;
        this.photo=photo;
        this.color=color;
        this.eps=0.01;
        
        this.fireballs=[];
        this.vx=0;
        this.vy=0;
        this.damage_vx=0;
        this.damage_vy=0
        this.damage_speed=0;
        this.friction=0.1;
        this.move_len=0;
        this.spent_time=0;

        this.cur_skill=null;
        
        if(this.character!=="robot"){
            this.img=new Image();
            this.img.src=this.photo;
        }
        this.fireball_coldtime=0.5;
        this.fireball_img=new Image();
        this.fireball_img.src='https://cdn.acwing.com/media/article/image/2021/12/02/1_9340c86053-fireball.png';
    }
    start(){
        this.playground.player_count++;
        this.playground.notice_board.write('');
        if(this.playground.player_count>=3){
            this.playground.state='fighting';
            this.playground.notice_board.write('');
        }
        if(this.character==='me'){
            this.add_listening_events();
        }
        else if(this.character==='robot'){
            let tx=Math.random()*this.playground.width/this.playground.scale;
            let ty=Math.random()*this.playground.height/this.playground.scale;
            this.move_to(tx,ty);
        }
    }
    add_listening_events(){
        let outer=this;
        this.playground.game_map.$canvas.on("contextmenu",function(){return false;});
        this.playground.game_map.$canvas.mousedown(function(e){
            if(outer.playground.state!=='fighting')return false;
            const rect=outer.ctx.canvas.getBoundingClientRect();
            if(e.which===3){//鼠标右键
                let tx=(e.clientX-rect.left)/outer.playground.scale;
                let ty=(e.clientY-rect.top)/outer.playground.scale;
                outer.move_to(tx,ty);
                if(outer.playground.mode==='multi mode'){
                    outer.playground.mps.send_move_to(tx,ty);
                }
            }
            else if(e.which===1){//鼠标左键
                let tx=(e.clientX-rect.left)/outer.playground.scale;
                let ty=(e.clientY-rect.top)/outer.playground.scale;
                if(outer.cur_skill==="fireball"){
                    if(outer.fireball_coldtime!=0)return fasle;
                    let fireball=outer.shoot_fireball(tx,ty);
                    if(outer.playground.mode==='multi mode'){
                        outer.playground.mps.send_shoot_fireball(tx,ty,fireball.uuid);
                    }
                    outer.fireball_coldtime=0.5;
                }
                outer.cur_skill=null;
            }
        });
        $(window).keydown(function(e){
            if(outer.playground.state!=='fighting')return;
            if(e.which===81){//q键
                if(outer.fireball_coldtime!=0)return;
                outer.cur_skill="fireball";
            }
            
        });
    }
    shoot_fireball(tx,ty){
        let x=this.x,y=this.y;
        let radius=0.01;
        let angle=Math.atan2(ty-y,tx-x);
        let color="orange";
        let vx=Math.cos(angle),vy=Math.sin(angle);
        let speed=0.6;
        let move_len=0.8;

        let fireball=new Game_Fireball(this.playground,this,x,y,radius,color,speed,move_len,vx,vy,0.01);
        this.fireballs.push(fireball);
        return fireball;
    }
    move_to(tx,ty){
        this.move_len=this.get_dist(this.x,this.y,tx,ty);
        let angle=Math.atan2(ty-this.y,tx-this.x);
        this.vx=Math.cos(angle);
        this.vy=Math.sin(angle);
    }
    destroy_fireball(uuid){
        for(let i=0;i<this.fireballs.length;i++){
            let fireball=this.fireballs[i];
            if(fireball.uuid===uuid){
                fireball.destroy();
                break;
            }
        }
    }
    get_dist(x1,y1,x2,y2){
        let dx=x2-x1;
        let dy=y2-y1;
        return Math.sqrt(dx*dx+dy*dy);
    }
    is_attacked(angle,damage){
        let num=10+Math.random()*5;
        for(let i=0;i<num;++i){
            let x=this.x,y=this.y;
            let radius=Math.max(this.radius,0.01)*(Math.random()+0.5)*0.1;
            let angle=Math.PI*2*Math.random();
            let vx=Math.cos(angle);
            let vy=Math.sin(angle);
            let color=this.color;
            let speed=damage*100;
            new Game_Particle(this.playground,x,y,radius,color,vx,vy,speed);
        }
        this.radius-=damage;
        if(this.radius<this.eps){
            this.destroy();
            return false;
        }
        this.damage_vx=Math.cos(angle);
        this.damage_vy=Math.sin(angle);
        this.damage_speed=this.speed*5;
        this.speed*=1.1;
    }
    receive_attack(x,y,angle,damage,ball_uuid,attacker){
        attacker.destroy_fireball(ball_uuid);
        this.x=x;
        this.y=y;
        this.is_attacked(angle,damage);
    }
    update(){
        this.spent_time+=this.timedelta/1000;
        if(this.character==='me'&&this.playground.state==="fighting"){
            this.update_coldtime();
        }
        this.update_move();
        this.render();
    }
    update_coldtime(){
        console.log(this.fireball_coldtime);
        this.fireball_coldtime-=this.timedelta/1000;
        if(this.fireball_coldtime<0)this.fireball_coldtime=0;
    }
    update_move(){
        if(this.damage_speed>this.eps*10){
            this.vx=this.vy=0;
            this.move_len=0;
            this.x+=this.damage_vx*this.damage_speed*this.timedelta/1000;
            this.y+=this.damage_vy*this.damage_speed*this.timedelta/1000;
            this.damage_speed*=(1-this.friction);
        }else{
            if(this.spent_time>5&&Math.random()<this.timedelta/1000/3&&this.character==='robot'){
                let len=this.playground.players.length;
                let index=Math.floor(Math.random()*len);
                let sx=this.playground.players[index].x;
                let sy=this.playground.players[index].y;
                if(this.playground.players[index]!=this)
                    this.shoot_fireball(sx,sy);
            }

            this.damage_speed=0;
            if(this.move_len<this.eps){
                this.move_len=0;
                this.vx=this.vy=0;
                if(this.character==='robot')
                {
                    let tx=Math.random()*this.playground.width/this.playground.scale;
                    let ty=Math.random()*this.playground.height/this.playground.scale;
                    this.move_to(tx,ty);
                }
            }
            else{
                let moved_act=Math.min(this.move_len,(this.speed*this.timedelta/1000));
                this.x+=this.vx*moved_act;
                this.y+=this.vy*moved_act;
                this.move_len-=moved_act;
            }
        }
    }
    render(){
        let scale=this.playground.scale;
        if(this.character!=='robot'){
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(this.x*scale, this.y*scale, this.radius*scale, 1, Math.PI * 3, false);
            this.ctx.stroke();
            this.ctx.clip();
            this.ctx.drawImage(this.img, (this.x - this.radius)*scale, (this.y - this.radius)*scale, this.radius * 2*scale, this.radius * 2*scale);
            this.ctx.restore();
        }
        else{
            this.ctx.beginPath();
            this.ctx.arc(this.x*scale,this.y*scale,this.radius*scale,0,Math.PI*2,false);
            this.ctx.fillStyle=this.color;
            this.ctx.fill();
        }
        if(this.character==='me'&&this.playground.state==='fighting'){
            this.render_skill_coldtime();
        }
    }
    render_skill_coldtime(){
        let x=1.5,y=0.9,r=0.04,scale=this.playground.scale;
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(x*scale, y*scale, r*scale, 1, Math.PI * 3, false);
        this.ctx.stroke();
        this.ctx.clip();
        this.ctx.drawImage(this.fireball_img, (x - r)*scale, (y -r)*scale, r * 2*scale, r * 2*scale);
        this.ctx.restore();

        if(this.fireball_coldtime!=0){
            this.ctx.beginPath();
            this.ctx.moveTo(x*scale,y*scale);
            this.ctx.arc(x*scale,y*scale,r*scale,0-Math.PI/2,Math.PI*2*(1-this.fireball_coldtime/0.5-0.25),true);
            this.ctx.lineTo(x*scale,y*scale);
            this.ctx.fillStyle="rgba(40,0,0,0.3)";
            this.ctx.fill();
        }
    }
    on_destroy(){
        if(this.character==='me'){
            this.playground.state='over';
        }
        for(let i=0;i<this.playground.players.length;i++){
            if(this.playground.players[i]===this){
                this.playground.players.splice(i,1);
                break;
            }
        }
    }
}
