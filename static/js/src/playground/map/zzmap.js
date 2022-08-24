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
    resize(){
        this.ctx.canvas.width=this.playground.width;
        this.ctx.canvas.height=this.playground.height;
        console.log('color');
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
