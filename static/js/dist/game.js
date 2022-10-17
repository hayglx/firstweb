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
	<div class='gongan-beian'>
		<a href="https://beian.miit.gov.cn/" target='_blank' class='test'>鄂ICP备2022015143号-1</a>
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
			outer.root.playground.show("single mode");
		});
		this.$multi.click(function(){
			outer.hide();
			outer.root.playground.show("multi mode");
		});
		this.$settings.click(function(){
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
        this.uuid=this.create_uuid();
    }
    create_uuid(){
        let res='';
        for(let i=0;i<8;i++){
            let x=parseInt(Math.floor(Math.random()*10));
            res+=x;
        }
        return res;
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






class ChatField{
    constructor(playground){
        this.playground=playground;
        this.$history=$(`<div class="game-chat-field-chat"></div>`);
        this.$input=$(`<input type='text' class='game-chat-field-input'>`);
        this.$history.hide();
        this.$input.hide();
        
        this.func_id=null;
        this.playground.$playground.append(this.$history);
        this.playground.$playground.append(this.$input);
        this.start();
    }
    start(){
        this.add_listening_events();
    }
    add_listening_events(){
        let outer=this;
        this.$input.keydown(function(e){
            if(e.which===27){
                outer.hide_input();
                return false;
            }
            else if(e.which===13){
                let username=outer.playground.root.settings.username;
                let text=outer.$input.val();
                if(text){
                    outer.$input.val('');
                    outer.add_message(username,text);
                    outer.show_history();
                    outer.playground.mps.send_message(text);
                }
                return false;
            }
        });
    }
    render_message(message){
        return $(`<div>${message}</div>`);
    }
    add_message(username,text){
        let message=`[${username}]${text}`;
        this.$history.append(this.render_message(message));
        this.$history.scrollTop(this.$history[0].scrollHeight);
    }
    show_history(){
        let outer=this;
        this.$history.fadeIn();
        if(this.func_id)clearTimeout(this.func_id);
        this.func_id=setTimeout(function(){
            outer.$history.fadeOut();
            outer.func_id=null;
        },5000);
    }
    show_input(){
        this.show_history();
        this.$input.show();
        this.$input.focus();
    }
    hide_input(){
        this.$input.hide();
        this.playground.game_map.$canvas.focus();
    }
}
class Game_Map extends Base_Object{
    constructor(playground){
        super();
        this.playground=playground;
        this.$canvas=$(`<canvas tabindex=0></canvas>`);
        this.ctx=this.$canvas[0].getContext('2d');
        this.ctx.canvas.width=this.playground.width;
        this.ctx.canvas.height=this.playground.height;
        this.playground.$playground.append(this.$canvas);
    
    }
    start(){
        this.$canvas.focus();
    }
    resize(){
        this.ctx.canvas.width=this.playground.width;
        this.ctx.canvas.height=this.playground.height;
        this.ctx.fillStyle="rgba(100,11,200,1)";
        this.ctx.fillRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height);
    }
    update(){
        this.render();
    }
    render(){
        this.ctx.fillStyle="rgba(100,11,200,0.5)";
        this.ctx.fillRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height);
    }
}
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
            if(outer.playground.state!=='fighting')return true;
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
        this.playground.game_map.$canvas.keydown(function(e){
            if(e.which===13){
                if(outer.playground.mode==='multi mode'){//回车键打开聊天框
                    outer.playground.chat_field.show_input();
                    return false;
                }
            }
            else if(e.which===27){
                if(outer.playground.mode==='multi mode'){
                    outer.playground.chat_field.hide_input();
                    return false;
                }
            }
            if(outer.playground.state!=='fighting')return true;
            if(e.which===81){//q键
                if(outer.fireball_coldtime!=0)return false;
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
        console.log(this.radius);
        if(this.radius<this.eps){
            console.log('destroy');
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
            console.log('renderthis',this.x,this.y);
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
        console.log('death');
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
class MultiPlayerSocket{
    constructor(playground){
        this.playground=playground;
        this.uuid=this.playground.players[0].uuid;
        this.ws=new WebSocket("wss://qwevzx.asia/wss/multiplayer/");
        this.start();
    }
    start(){
        this.receive();
    }
    receive(){
        let outer=this;
        this.ws.onmessage=function(e){
            
            let data=JSON.parse(e.data);
            let uuid=data.uuid;

            if(uuid==outer.uuid) return false;
            let event=data.event;
            if(event==="create_player"){
                outer.receive_create_player(uuid,data.username,data.photo);
            }else if(event==='move_to'){
                outer.receive_move_to(uuid,data.tx,data.ty);
            }
            else if(event==='shoot_fireball'){
                outer.receive_shoot_fireball(data.tx,data.ty,data.ball_uuid);
            }
            else if(event==='attack'){
                outer.receive_attack(uuid,data.attackee_uuid,data.x,data.y,data.angle,data.damage,data.ball_uuid);
            }
            else if(event==='message'){
                outer.receive_message(uuid,data.text);
            }
        };
    }
    send_create_player(username,photo){
        let outer=this;
        this.ws.send(JSON.stringify({
            'event':'create_player',
            'uuid':outer.uuid,
            'username':username,
            'photo':photo,
        }));
    }
    get_player(uuid){
        let players=this.playground.players;
        for(let i=0;i<players.length;i++){
            let player=players[i];
            if(player.uuid===uuid){
                return player;
            }
        }
        return null;
    }
    receive_create_player(uuid,username,photo){
        let player=new Game_Player(
            this.playground,
            this.playground.width/2/this.playground.scale,
            0.5,
            0.05,
            'white',
            0.15,
            'enemy',
            username,
            photo,
        );
        player.uuid=uuid;
        this.playground.players.push(player);
    }

    send_move_to(tx,ty){
        let outer=this;
        this.ws.send(JSON.stringify({
            'event':"move_to",
            'uuid':outer.uuid,
            'tx':tx,
            'ty':ty,
        }));
    }
    receive_move_to(uuid,tx,ty){
        let player=this.get_player(uuid);
        if(player){
            player.move_to(tx,ty);
        }
    }
    send_shoot_fireball(tx,ty,ball_uuid){
        let outer=this;
        this.ws.send(JSON.stringify({
            'event':'shoot_fireball',
            'uuid':outer.uuid,
            'tx':tx,
            'ty':ty,
            'ball_uuid':ball_uuid,
        }));
    }
    receive_shoot_fireball(tx,ty,ball_uuid){
        let player=this.get_player(ball_uuid);
        if(player){
            let fireball=player.shoot_fireball(tx,ty);
            fireball.uuid=ball_uuid;
        }
    }
    
    send_attack(attackee_uuid,x,y,angle,damage,ball_uuid){
        let outer=this;
        this.ws.send(JSON.stringify({
            'event':'attack',
            'uuid':outer.uuid,
            'attackee_uuid':attackee_uuid,
            'x':x,
            'y':y,
            'angle':angle,
            'damage':damage,
            'ball_uuid':ball_uuid,
        }));
    }
    receive_attack(uuid,attackee_uuid,x,y,angle,damage,ball_uuid){
        let attacker=this.get_player(uuid);
        let attackee=this.get_player(attackee_uuid);
        if(attacker&&attackee){
            attackee.receive_attack(x,y,angle,damage,ball_uuid,attacker);
        }
    }
    send_message(text){
        let outer=this;
        this.ws.send(JSON.stringify({
            'event':'message',
            'uuid':outer.uuid,
            'text':text,
        }));
    }
    receive_message(uuid,text){
        let player=this.get_player(uuid);
        if(player){
            player.playground.chat_field.add_message(player.username,text);
        }
    }
}
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
            this.chat_field=new ChatField(this);
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
            <!--img width='30' src='https://qwevzx.asia/static/image/settings/acwlogo.png'-->
            <br>
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
            <!--img width='30' src='https://qwevzx.asia/static/image/settings/acwlogo.png'-->
            <br>
        </div>
    </div>
    <div class='gongan-beian'>
        <a href="https://beian.miit.gov.cn/" target='_blank' class='test'>鄂ICP备2022015143号-1</a>
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

        this.$acwing_login=this.$settings.find(".game-settings-acwing img");
        this.root.$game.append(this.$settings);
        this.start();
    }
    start(){
        if(this.platform==='acw'){
            this.getinfo_acapp();
        }
        else{
            if(this.root.access){
                this.getinfo_web();
            }else{
                this.login();
            }
            this.add_listening_events_login();
            this.add_listening_events_register();
        }

    }
    add_listening_events_login(){
        let outer=this;
        this.$register_login.click(function(){
            outer.login();
        });
        this.$login_submit.click(function(){
            outer.login_server();
        });
        this.$acwing_login.click(function(){
            outer.acwing_login();
        });
    }
    acwing_login(){
        $.ajax({
            url:"https://qwevzx.asia/settings/acwing/web/apply_code/",
            type:"GET",
            success:function(resp){
                if(resp.result==="success")
                {
                    window.location.replace(resp.apply_code_url);
                }
            },
        })
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
        let username=this.$login_username.val();
        let password=this.$login_password.val();
        this.$login_error.empty();
        $.ajax({
            url:'https://qwevzx.asia/settings/token/',
            type:'POST',
            data:{
                username:username,
                password:password,
            },
            success:resp=>{
                this.root.access=resp.access;
                this.root.refresh=resp.refresh;
                this.getinfo_web();
                console.log("gettoken success");
            },
            error:err=>{
                console.log(err);
                this.$login_error.html("用户名或密码错误")
            }
        })
    }
    logout_server(){
        if(this.platform==='acw'){
            this.root.acwos.api.window.close();
        }
        else{
            this.root.access="";
            this.root.refresh="";
            location.href='/';
        }
    }
    register_server(){
        let outer=this;
        let username=this.$register_username.val();
        let password=this.$register_password.val();
        let password_confirm=this.$register_password_confirm.val();
        this.$register_error.empty()
        $.ajax({
            url:'https://qwevzx.asia/settings/register/',
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
    getinfo_web(){
        let outer=this;
        $.ajax({
            url:"https://qwevzx.asia/settings/getinfo/",
            type:"GET",
            data:{
                platform:outer.platform,
            },
            headers:{
                'Authorization':'Bearer '+this.root.access,
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
    acapp_login(appid,redirect_uri,scope,state){
        let outer=this;
        this.root.acwos.api.oauth2.authorize(appid, redirect_uri, scope, state,function(resp){
            if(resp.result==="success"){
                outer.username=resp.username;
                outer.photo=resp.photo;
                outer.hide();
                outer.root.menu.show();
            }
        });
    }
    getinfo_acapp(){
        let outer=this;
        $.ajax({
            url:'https://qwevzx.asia/settings/acwing/acapp/apply_code/',
            type:'GET',
            success:function(resp){
                outer.acapp_login(resp.appid,resp.redirect_uri,resp.scope,resp.state);
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
    constructor(id,acwos,access,refresh){
        console.log("this.F_game");
        this.acwos=acwos;
        this.id=id;
        this.access=access;
        this.refresh=refresh;
        this.$game=$('#'+id);
        this.menu=new F_GameMenu(this);
        this.settings=new Settings(this);
        this.playground= new GamePlayground(this);
       // this.settings.$login.hide();
       // this.settings.$register.hide();
    }
}
