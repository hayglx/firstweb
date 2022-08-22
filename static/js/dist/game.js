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
            退出
        </div>
    </div>
</div>
`);
        this.$menu.hide();
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
            outer.root.settings.logout_server();
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
            if(GAME_OBJECTS[i]===this){
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
class Game_Particle extends Base_Object{
    constructor(playground,x,y,radius,color,vx,vy,speed){
        super();
        this.playground=playground;
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
        if(10>this.speed){
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
        this.ctx.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
        this.ctx.fillStyle=this.color;
        this.ctx.fill();
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
class Game_Fireball extends Base_Object{
    constructor(playground,player,x,y,radius,color,speed,move_len,vx,vy,damage){
        super();
        this.playground=playground;
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
    }
    start(){}
    update(){
        if(this.move_len<this.eps){
            this.destroy();
            return false;
        }
        let moved=Math.min(this.move_len,this.speed*this.timedelta/1000);
        this.x+=this.vx*moved;
        this.y+=this.vy*moved;
        this.move_len-=moved;

        for(let i=0;i<this.playground.players.length;++i){
            let player=this.playground.players[i];
            if(player!=this.player&&this.is_collision(player)){
                this.attack(player);
            }
        }

        this.render();
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
        this.hide();
        
        
    }
    get_ramdom_color(){                                                 
        let colors=["blue","red","pink","yellow","green","orange"];
        return colors[Math.floor(Math.random()*6)];
    }

    show(){//显示游戏界面
        this.$playground.show();
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
    hide(){//隐藏游戏界面
        this.$playground.hide();
    }
    start(){

    }
}
class Settings{
    constructor(root){
        this.root=root;
        this.platform="web";
        if(this.root.acwos) this.platform='acw';
        this.username="";
        this.photo="";
        this.$settings=$(`
<div class='game-settings-menu'>
    <div class='game-settings-login'>
        <div class='game-settings-title'>
            登录
        </div>
        <div class='game-settings-username'>
            <div class='game-settings-item'>
                <input type="text" placeholder-"用户名">
            </div>
        </div>
        <div class="game-settings-password">
            <div class='game-settings-item'>
                <input type="password" placeholder="密码">
            </div>
        </div>
        <div class='game-settings-submit'>
            <div class='game-settings-item'>
                <button>登录</button>
            </div>
        </div>
        <div class='game-settings-error'>
        </div>
        <div class='game-settings-option'>
            注册
        </div>
        <br>
        <div class='game-settings-acwing'>
            <img width='30' src='https://app3157.acapp.acwing.com.cn/static/image/settings/acwlogo.png'>
            <br>
            <div>
                AcWing一键登录
            </div>
        </div>

    </div>
    <div class='game-settings-register'>
        <div class='game-settings-title'>
            注册
        </div>
        <div class='game-settings-username'>
            <div class='game-settings-item'>
                <input type="text" placeholder="用户名">
            </div>
        </div>
        <div class="game-settings-password game-settings-password-first">
            <div class='game-settings-item'>
                <input type="password" placeholder="密码">
            </div>
        </div>
        <div class="game-settings-password game-settings-password-second">
            <div class='game-settings-item'>
                <input type="password" placeholder="确认密码">
            </div>
        </div>
        <div class='game-settings-submit'>
            <div class='game-settings-item'>
                <button>注册</button>
            </div>
        </div>
        <div class='game-settings-error'>
        </div>
        <div class='game-settings-option'>
            登录
        </div>
        <br>
        <div class='game-settings-acwing'>
            <img width='30' src='https://app3157.acapp.acwing.com.cn/static/image/settings/acwlogo.png'>
            <br>
            <div>
                AcWing一键登录
            </div>
        </div>
    </div>
</div>
`);

        this.$login=this.$settings.find('.game-settings-login');
        this.$login.hide();
        
        this.$register=this.$settings.find('.game-settings-register');
        this.$register.hide();
        
        this.$login_username=this.$login.find(".game-settings-username input");
        this.$login_password=this.$login.find(".game-settings-password input");
        this.$login_submit=this.$login.find(".game-settings-submit button");
        this.$login_error=this.$login.find(".game-settings-error");
        this.$login_register=this.$login.find(".game-settings-option");

        this.$register_username=this.$register.find(".game-settings-username input");
        this.$register_password=this.$register.find(".game-settings-password-first input");
        this.$register_password_confirm=this.$register.find(".game-settings-password-second input");
        this.$register_submit=this.$register.find(".game-settings-submit button");
        this.$register_error=this.$register.find(".game-settings-error");
        this.$register_login=this.$register.find(".game-settings-option");


        this.root.$game.append(this.$settings);
        this.start();
    }
    start(){
        this.getinfo();
        this.add_listening_events_login();
        this.add_listening_events_register();

    }
    add_listening_events_login(){
        let outer=this;
        this.$register_login.click(function(){
            outer.login();
        });
        this.$login_submit.click(function(){
            outer.login_server();
        });
    }
    add_listening_events_register(){
        let outer=this;
        this.$login_register.click(function(){

            outer.register();
        });
        this.$register_submit.click(function(){
            outer.register_server();
        })

    }
    login_server(){
        let outer=this;
        let username=this.$login_username.val();
        let password=this.$login_password.val();
        this.$login_error.empty();
        $.ajax({
            url:'https://app3157.acapp.acwing.com.cn/settings/login/',
            type:'GET',
            data:{
                username:username,
                password:password,
            },
            success:function(resp){
                if(resp.result==='success'){
                    location.reload();
                }
                else{
                    outer.$login_error.html(resp.result);
                }
            }
        })
    }
    logout_server(){
        if(this.platform==='acw'){
            return fasle;
        }
        let outer=this;
        $.ajax({
            url:'https://app3157.acapp.acwing.com.cn/settings/logout/',
            type:'GET',
            success:function(resp){
                if(resp.result==='success')
                    location.reload();
            }
        });

    }
    register_server(){
        let outer=this;
        let username=this.$register_username.val();
        let password=this.$register_password.val();
        let password_confirm=this.$register_password_confirm.val();
        this.$register_error.empty()
        $.ajax({
            url:'https://app3157.acapp.acwing.com.cn/settings/register/',
            type:'GET',
            data:{
                username:username,
                password:password,
                password_confirm:password_confirm,
            },
            success:function(resp){
                if(resp.result==='success'){
                    location.reload();
                }
                else outer.$register_error.html(resp.result);
            }
        })
    }
        
    register(){
        this.$login.hide();
        this.$register.show();
    }
    login()
    {
        this.$login.show();
        this.$register.hide();
    }
    getinfo(){
        let outer=this;
        $.ajax({
            url:"https://app3157.acapp.acwing.com.cn/settings/getinfo/",
            type:"GET",
            data:{
                platform:outer.platform,
            },
            success:function(resp){
                if(resp.result==="success"){
                    outer.username=resp.username;
                    outer.photo=resp.photo;
                    outer.hide();
                    outer.root.menu.show();
                }
                else{
                    outer.login();
                }
            }
        });
    }
    hide(){
        this.$settings.hide();
    }
    show(){
        this.$settings.show();
    }
}
export class F_Game{
    constructor(id,acwos){
        this.acwos=acwos;
        this.id=id;
        this.$game=$('#'+id);
        this.settings=new Settings(this);
        this.menu=new F_GameMenu(this);
        this.playground= new GamePlayground(this);
        this.settings.$login.hide();
        let kk=this.settings.$settings.find('game-settings-menu');
        kk.hide();
        console.log(kk);
        console.log(this.settings.$login);
        this.settings.$register.hide();
    }
}
