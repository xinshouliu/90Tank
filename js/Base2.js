var Base = Class.extend({
	init: function(){
		this.x = game.basex;
		this.y = game.basey;
	},
	check:function(){
		//碰撞检测
		for(var i = 0 ; i < game.actorsarr.length;i++){
            
            if(this.x-8 <= game.actorsarr[i].x && this.x +32 >=  game.actorsarr[i].x && this.y-16 <= game.actorsarr[i].y && this.y+32 >=  game.actorsarr[i].y){
            	tankcrashAudio.play();
            	game.gameover();
            }
        }
        
	}
})