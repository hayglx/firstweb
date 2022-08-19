export class F_Game{
    constructor(id,acwos){
        this.acwos=acwos;
        this.id=id;
        this.$game=$('#'+id);
        this.menu=new F_GameMenu(this);
        this.playground= new GamePlayground(this);
    }
}
