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
