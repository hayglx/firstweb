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
        this.damage_vx=0;
        this.damage_vy=0;
        this.damage_speed=0;
        this.friction=0.1;
        this.move_len=0;
        this.spent_time=0;

        this.cur_skill=null;
        
        if(this.is_me){
            this.img=new Image();
            this.img.src=this.playground.root.settings.photo;
        }
    }
    start(){
        if(this.is_me){
            this.add_listening_events();
        }
        else{
            let tx=Math.random()*this.playground.width;
            let ty=Math.random()*this.playground.height;
            this.move_to(tx,ty);
        }
    }
    add_listening_events(){
        let outer=this;
        this.playground.game_map.$canvas.on("contextmenu",function(){return false;});
        this.playground.game_map.$canvas.mousedown(function(e){
            const rect=outer.ctx.canvas.getBoundingClientRect();
            if(e.which===3){
                outer.move_to(e.clientX-rect.left,e.clientY-rect.top);
            }
            else if(e.which===1){
                if(outer.cur_skill==="fireball"){
                    outer.shoot_fireball(e.clientX-rect.left,e.clientY-rect.top);
                    outer.cur_skill=null;
                }
            }
        });
        $(window).keydown(function(e){
            if(e.which===81){
                outer.cur_skill="fireball";
            }
            
        });
    }
    shoot_fireball(tx,ty){
        let x=this.x,y=this.y;
        let radius=this.playground.height*0.01;
        let angle=Math.atan2(ty-y,tx-x);
        let color="orange";
        let vx=Math.cos(angle),vy=Math.sin(angle);
        let speed=this.playground.height*0.6;
        let move_len=this.playground.height*0.8;

        new Game_Fireball(this.playground,this,x,y,radius,color,speed,move_len,vx,vy,this.playground.height*0.01);
    }
    move_to(tx,ty){
        this.move_len=this.get_dist(this.x,this.y,tx,ty);
        let angle=Math.atan2(ty-this.y,tx-this.x);
        this.vx=Math.cos(angle);
        this.vy=Math.sin(angle);

    }
    get_dist(x1,y1,x2,y2){
        let dx=x2-x1;
        let dy=y2-y1;
        return Math.sqrt(dx*dx+dy*dy);
    }
    is_attacked(angle,damage){
        let num=10+Math.random()*5;
        console.log(this.x,this.y,this.radius);
        for(let i=0;i<num;++i){
            let x=this.x,y=this.y;
            let radius=Math.max(this.radius,1)*(Math.random()+0.5)*0.1;
            let angle=Math.PI*2*Math.random();
            let vx=Math.cos(angle);
            let vy=Math.sin(angle);
            let color=this.color;
            let speed=damage*100;
            new Game_Particle(this.playground,x,y,radius,color,vx,vy,speed);
        }
        this.radius-=damage;
        if(this.radius<10){
            for(let i=0;i<this.playground.players.length;++i){
                if(this==this.playground.players[i]){
                    this.playground.players.splice(i,1);
                    break;
                }
            }
            this.destroy();
            return false;
        }
        this.damage_vx=Math.cos(angle);
        this.damage_vy=Math.sin(angle);
        this.damage_speed=this.speed*5;
        this.speed*=1.1;
    }
    update(){
        this.spent_time+=this.timedelta/1000;
        if(this.damage_speed>20){
            this.vx=this.vy=0;
            this.move_len=0;
            this.x+=this.damage_vx*this.damage_speed*this.timedelta/1000;
            this.y+=this.damage_vy*this.damage_speed*this.timedelta/1000;
            this.damage_speed*=(1-this.friction);
        }else{
            if(this.spent_time>5&&Math.random()<this.timedelta/1000/3&&!this.is_me){
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
                if(!this.is_me)
                {
                    let tx=Math.random()*this.playground.width;
                    let ty=Math.random()*this.playground.height;
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
        this.render();
    }
    render(){
        if(this.is_me){
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            this.ctx.stroke();
            this.ctx.clip();
            this.ctx.drawImage(this.img, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2); 
            this.ctx.restore();
        }
        else{
            this.ctx.beginPath();
            this.ctx.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
            this.ctx.fillStyle=this.color;
            this.ctx.fill();
        }
    }
}
