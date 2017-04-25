var enemytank = Class.extend({
	init:function(x,y,locatorx,locatory,dir,lives,speed){
		//locationx 0/1.
		//locationy 1/2.
		//四种坦克
		this.lives = lives;
		this.speed = speed;
		//1表示敌人.0表示玩家
		this.type = 1;
		this.dir = dir;
		this.x = x;
		this.y = y;
		this.bullets = [];
		//设置坦克渲染切片的位置
		this.locatorx = locatorx;
		this.locatory = locatory;
		this.live = true;
		game.actorsarr.push(this);
		game.enemy.push(this);
		var self = this;
		//可以改攻速
		setInterval(function(){
			self.fire();
		}, 2000)
	},
	fire:function(){
		if(this.bullets.length != 0 ) return;
		if(this.live){
			this.bullet = new Bullet(this.x,this.y,this.dir,this);
		}
	},
	//按键用来改方向.
	changedir: function(dir){
		this.dir = dir;
		switch(this.dir){
			case 0:
			case 1:
				//转向的时候坐标都是16的整数倍,\
				if(this.x%16!=0){
					if(this.x%16 < 8){
					this.x = this.x - this.x%16;
					}else{
						this.x = this.x - this.x%16 +16;
					}
				}
				break;
			case 2:
			case 3:
				if(this.y%16!=0){
					if(this.y%16 < 8){
						this.y = this.y - this.y%16;
					}else{
						this.y = this.y - this.y%16 +16;
					}
				}
				break;
		}
	},
	update:function(){
		switch(this.dir){
			case 0:
				//往上
   				var row1 = parseInt(this.y/16);
   				var row2 = row1;
   				var col1 = parseInt(this.x/16);
   				var col2 = col1+1;
   				if(row1 < 0){
   					row1 = 0;
   					row2 = 0;

   				}
   				if((game.map.mapcode[row1].charAt(col1)==5||game.map.mapcode[row1].charAt(col1)==0||game.map.mapcode[row1].charAt(col1)==3)&&(game.map.mapcode[row2].charAt(col2)==0||game.map.mapcode[row2].charAt(col2)==3||game.map.mapcode[row2].charAt(col2)==5)){
   					this.y-=this.speed;
					if(this.y < 0){
						this.y =0;
						this.dir = _.sample([1, 0,2, 3]);
					}
   				}else if(game.map.mapcode[row2].charAt(col2)==4||game.map.mapcode[row1].charAt(col1)==4||game.map.mapcode[row1].charAt(col1)==1||game.map.mapcode[row1].charAt(col1)==2||game.map.mapcode[row2].charAt(col2)==1||game.map.mapcode[row2].charAt(col2)==2){
   					this.dir = _.sample([1, 2, 3]);
   				}
			break;
			case 1:
				//往下
   				var row1 = parseInt((this.y+16)/16)+1;
   				var row2 = row1;
   				var col1 = parseInt((this.x)/16);
   				var col2 = col1+1;
   				if(row1>31){
   					row1 =31;
   					row2 = 31;
   					
   				}	
				if((game.map.mapcode[row1].charAt(col1)==5||game.map.mapcode[row1].charAt(col1)==0||game.map.mapcode[row1].charAt(col1)==3)&&(game.map.mapcode[row2].charAt(col2)==0||game.map.mapcode[row2].charAt(col2)==3||game.map.mapcode[row2].charAt(col2)==5)){
   					this.y+=this.speed;
					if(this.y > game.canvas.height-32){
						this.y =game.canvas.height-32;
						this.dir = _.sample([1, 0,2, 3]);
					}
   				}else if(game.map.mapcode[row2].charAt(col2)==4||game.map.mapcode[row1].charAt(col1)==4||game.map.mapcode[row1].charAt(col1)==1||game.map.mapcode[row1].charAt(col1)==2||game.map.mapcode[row2].charAt(col2)==1||game.map.mapcode[row2].charAt(col2)==2){
   					this.dir = _.sample([0, 2, 3]);
   				}
			break;
			case 2:
				//往左
				var row1 = parseInt(this.y/16);
   				var row2 = row1+1;
   				var col1 = parseInt(this.x/16);
   				var col2 = col1;
   				if(col1<0){
   					col1 =0;
   					col2=0;
   				}	
   				if((game.map.mapcode[row1].charAt(col1)==5||game.map.mapcode[row1].charAt(col1)==0||game.map.mapcode[row1].charAt(col1)==3)&&(game.map.mapcode[row2].charAt(col2)==0||game.map.mapcode[row2].charAt(col2)==3||game.map.mapcode[row2].charAt(col2)==5)){
   					this.x-=this.speed;
					if(this.x < 0){
						this.x =0;
						this.dir = _.sample([1, 0,2, 3]);
					}
   				}else if(game.map.mapcode[row2].charAt(col2)==4||game.map.mapcode[row1].charAt(col1)==4||game.map.mapcode[row1].charAt(col1)==1||game.map.mapcode[row1].charAt(col1)==2||game.map.mapcode[row2].charAt(col2)==1||game.map.mapcode[row2].charAt(col2)==2){
   					this.dir = _.sample([1, 0, 3]);
   				}
			break;
			case 3:
				var row1 = parseInt(this.y/16);
				var row2 = row1+1;
				var col1 = parseInt((this.x+16)/16)+1;
				var col2 =col1;
   				if(col1>31){
   					col1 =31;
   					col2=31;
   				}	
   				if((game.map.mapcode[row1].charAt(col1)==5||game.map.mapcode[row1].charAt(col1)==0||game.map.mapcode[row1].charAt(col1)==3)&&(game.map.mapcode[row2].charAt(col2)==0||game.map.mapcode[row2].charAt(col2)==3||game.map.mapcode[row2].charAt(col2)==5)){
   					this.x+=this.speed;
					if(this.x > game.canvas.width - 32){
						this.x =game.canvas.width - 32;
						this.dir = _.sample([1, 0,2, 3]);
					}
   				}else if(game.map.mapcode[row2].charAt(col2)==4||game.map.mapcode[row1].charAt(col1)==4||game.map.mapcode[row1].charAt(col1)==1||game.map.mapcode[row1].charAt(col1)==2||game.map.mapcode[row2].charAt(col2)==1||game.map.mapcode[row2].charAt(col2)==2){
   					this.dir = _.sample([1, 2, 0]);
   				}
			break;
		}
	},
	render: function(){
		if(game.scene.scenenumber ==1){
			this.update();
		}
		game.ctx.drawImage(game.mainpic,this.dir*32+this.locatorx*128,this.locatory*32,32,32,this.x,this.y,32,32);

	},
	checkdie: function(){
		if(this.lives <=0){
			tankdestoryAudio.play();
			this.live = false;
			this.bullets = [];
			game.enemy = _.without(game.enemy,this);
			game.actorsarr = _.without(game.actorsarr,this);
			game.actorsarr = _.without(game.actorsarr,this.bullet);
		}
	}
});
