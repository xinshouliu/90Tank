var Player = Class.extend({
	init: function(num,lives){
		this.num = num;
		this.score = 0;
		//3条命
		this.lives  = 3;
		this.speed = 3;
		this.addtank();
	},
	addtank: function(){
		if(this.num == 1){
			game.player1 = new Player1tank(1,this);
			newtankAudio.play();
		}else if(this.num ==2){
			game.player2 = new Player1tank(2,this);
			newtankAudio.play();
		}
	}
})
//增加一个玩家类.控制坦克