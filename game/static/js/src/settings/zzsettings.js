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

        this.$acwing_login=this.$settings.find(".game-settings-acwing img");
        this.root.$game.append(this.$settings);
        this.start();
    }
    start(){
        if(this.platform==='acw'){
            this.getinfo_acapp();
        }
        else{
            this.getinfo_web();
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
            url:"https://app3157.acapp.acwing.com.cn/settings/acwing/web/apply_code/",
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
            this.root.acwos.api.window.close();
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
    getinfo_web(){
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
            url:'https://app3157.acapp.acwing.com.cn/settings/acwing/acapp/apply_code/',
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
