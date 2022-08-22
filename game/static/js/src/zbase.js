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
