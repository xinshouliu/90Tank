var Bullet = Class.extend({
	init: function(x,y,dir,owner){
		this.speed = 4;
		//0表示玩家
		this.type = 0;
		//子弹大小是6*6;
		this.dir = dir;
		this.crash = 0;
		game.actorsarr.push(this);
		game.bullets.push(this);
		owner.bullets.push(this);

		switch(this.dir){
			case 0:
			case 1:
				this.x = x+13;
				this.y = y;	
			break;	
			case 2:
			case 3:
				this.x = x;
				this.y = y+13;	
			break;	
		}
		//能否穿墙.0表示不能,1表示能
		this.level = 0;
		this.owner = owner;
	},
	update:function(){
		switch(this.dir){
			case 0:
				//往上
				var row1 = parseInt(this.y/16);
   				var col1 = parseInt(this.x/16);
   				var col2 = col1+1;
   				var row2=row1;
   				if(row1 < 0){
   					row1 = 0;
   					row2=0;
   				}
   				this.checkcrashwall(row1,col1,row2,col2);
				this.y-=this.speed;
				if(this.y < 0){
					this.crash1();
				}
				break;
			case 1:
				var row1 = parseInt((this.y+16)/16)+1;
   				var row2 = row1;
   				var col1 = parseInt((this.x)/16);
   				var col2 = col1+1;
   				if(row1>31){
   					row1 =31;
   					row2 = 31;
   				}	
   				this.checkcrashwall(row1,col1,row2,col2);
				this.y+=this.speed;
				if(this.y > game.canvas.height-6){
					this.crash1();
				}
			break;
			case 2:
				var row1 = parseInt(this.y/16);
   				var row2 = row1+1;
   				var col1 = parseInt(this.x/16);
   				var col2 = col1;
   				if(col1<0){
   					col1 =0;
   					col2=0;
   				}	
   				this.checkcrashwall(row1,col1,row2,col2);
				this.x-=this.speed;
				if(this.x < 0){
					this.crash1();
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
   				this.checkcrashwall(row1,col1,row2,col2);
				this.x+=this.speed;
				if(this.x > game.canvas.width - 6){
					this.crash1();
				}
			break;
		}
	},
	render: function(){
		if(!this.owner.live){return};
		this.update();
		//切片
		game.ctx.drawImage(game.mainpic,80+this.dir*6,96,6,6,this.x,this.y,6,6);
		switch(this.crash){
			//1撞边界
			case 1:
				switch(this.dir){
					case 0:
						game.ctx.drawImage(game.mainpic,320,0,32,32,this.x-16,this.y,32,32);
						break;
					case 1:
						game.ctx.drawImage(game.mainpic,320,0,32,32,this.x-16,this.y-20,32,32);
						break;
					case 2:
						game.ctx.drawImage(game.mainpic,320,0,32,32,this.x,this.y-16,32,32);
						break;
					case 3:
						game.ctx.drawImage(game.mainpic,320,0,32,32,this.x-20,this.y-16,32,32);
						break;	
				}
			break;
			case 2:
			//撞墙
				
				switch(this.dir){
					case 0:
					game.ctx.drawImage(game.mainpic,320,0,32,32,this.x-16,this.y-16,32,32);
					break;
					case 1:
					game.ctx.drawImage(game.mainpic,320,0,32,32,this.x-16,this.y+16,32,32);
					break;
					case 2:
					game.ctx.drawImage(game.mainpic,320,0,32,32,this.x-16,this.y-16,32,32);
					break;
					case 3:
					game.ctx.drawImage(game.mainpic,320,0,32,32,this.x+16,this.y-16,32,32);
					break;
				}
			break;

			break;
		}
	},
	crash1:function(){
		//撞边界
		//撞墙(小爆炸)//撞坦克(大爆炸)//撞转块(小爆炸)//撞子弹(删掉)
		game.actorsarr=_.without(game.actorsarr,this);
		this.owner.bullets=[];
		this.crash =1;

	},
	crash2:function(){
		//撞墙
		//撞墙(小爆炸)//撞坦克(大爆炸)//撞转块(小爆炸)//撞子弹(删掉)
		game.actorsarr=_.without(game.actorsarr,this);
		this.owner.bullets=[];
		this.crash =2;
	},
	checkcrashwall:function(row1,col1,row2,col2){
		if(this.level == 0){
			if(game.map.mapcode[row1].charAt(col1)==1||game.map.mapcode[row1].charAt(col1)==2||game.map.mapcode[row2].charAt(col2)==1||game.map.mapcode[row2].charAt(col2)==2){
				this.crash2();
			}
			if(game.map.mapcode[row1].charAt(col1)==1){
				game.map.update(row1,col1);
			}
			if(game.map.mapcode[row2].charAt(col2)==1){
				game.map.update(row2,col2);
			}
		}else if(this.level ==1){
			if(game.map.mapcode[row1].charAt(col1)==1||game.map.mapcode[row1].charAt(col1)==2||game.map.mapcode[row2].charAt(col2)==1||game.map.mapcode[row2].charAt(col2)==2){
				this.crash2();
			}
			if(game.map.mapcode[row1].charAt(col1)==1||game.map.mapcode[row1].charAt(col1)==2){
				game.map.update(row1,col1);
			}
			if(game.map.mapcode[row2].charAt(col2)==1||game.map.mapcode[row2].charAt(col2)==2){
				game.map.update(row2,col2);
			}
		}
		//玩家的子弹
		if(this.owner.type ==0){
			for(var i = 0 ; i < game.enemy.length;i++){
	           	 if(this.x >= game.enemy[i].x && this.x <=  game.enemy[i].x+32 && this.y >= game.enemy[i].y && this.y<=  game.enemy[i].y+32){
		           	
		           	game.enemy[i].lives--;
	            	game.enemy[i].checkdie();
	            	this.crash2();
	            	this.owner.owner.score+=100;
	           	} 
           	}
		}else if(this.owner.type ==1){
			//ai的子弹
			if(game.player2){
				var arr = [game.player1,game.player2];
			}else{
				var arr = [game.player1];
			}
			for(var i = 0;i<arr.length;i++){
				if(this.x >= arr[i].x && this.x <=  arr[i].x+32 && this.y >= arr[i].y && this.y<=  arr[i].y+32){
		           	//子弹碰到了玩家.
		           	tankdestoryAudio.play();
		           	arr[i].owner.lives--;
		           	if(	arr[i].owner.lives<=0){
		           		arr[i].checkdie();
		           		game.actorsarr = _.without(game.actorsarr,this);
	            		game.actorsarr = _.without(game.actorsarr,arr[i]);
	            		this.crash2();
		           		arr[i] = null;
		           		return;
		           	}
	            	arr[i].checkdie();
	            	game.actorsarr = _.without(game.actorsarr,this);
	            	game.actorsarr = _.without(game.actorsarr,arr[i]);
	            	this.crash2();
	           	} 
			}
		}
		
	}
})