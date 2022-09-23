export class F_Game{
    constructor(id,acwos){
        this.acwos=acwos;
        this.id=id;
        this.$game=$('#'+id);
        this.menu=new F_GameMenu(this);
        this.settings=new Settings(this);
        this.playground= new GamePlayground(this);
        this.settings.$login.hide();
        this.settings.$register.hide();
    }
}
