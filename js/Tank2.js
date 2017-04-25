//玩家
var Player1tank = Class.extend({
	init:function(num,owner){
		//玩家标示.传入1和2
		//生命值写在另外一个函数.
		this.lives = 1;
		this.speed = 3;
		//0表示玩家
		this.type = 0;
		this.dir = 0;
		this.owner = owner;
		//玩家标示 1是1玩家,2是2玩家
		this.num = num; 
		if(this.num ==1){
			this.x = 0;
			this.y = 480;
			this.locator = 0;
		}else{
			this.x = 480;
			this.y = 480;
			this.locator = 128;
		}
		this.live = true;
		this.bullets = [];
		game.actorsarr.push(this);
		//每new都push
		game.playersarr+=1;
	},
	fire:function(){
		if(this.bullets.length != 0) return;
		this.bullet = new Bullet(this.x,this.y,this.dir,this);
		attackAudio.play();
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
					}
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
					}
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
					}
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
					}
   				}
			break;
		}
	},
	moves: function(){
		this.ismove = true;
	},
	stops: function(){
		this.ismove = false;
	},
	render: function(){
		if(this.ismove){
			this.update();
		}	
		this.checktanks();
		//有耦合
		if(this.num == 1){
			game.$lives1.html("Player1 lives:"+this.owner.lives);
       		game.$player1score.html("Player1 scores:"+this.owner.score);
		}else if(this.num == 2){
			game.$lives2.html("Player2 lives:"+this.owner.lives);
       		game.$player2score.html("Player2 scores:"+this.owner.score);
		}
		
      
		game.ctx.drawImage(game.mainpic,this.dir*32+this.locator,0,32,32,this.x,this.y,32,32);
	},
	//撞车
	checktanks :function(){
		for(var i = 0 ; i < game.enemy.length;i++){
            if(this.x <= game.enemy[i].x && this.x +32 >=  game.enemy[i].x && this.y <= game.enemy[i].y && this.y+32 >=  game.enemy[i].y){
            	tankcrashAudio.play();
            	this.owner.lives--;
            	game.actorsarr = _.without(game.actorsarr,this);
            	//爆炸动画
            	this.checkdie();
            	game.ctx.drawImage(game.mainpic,0,160,65,65,this.x,this.y,65,65);
            	game.enemy[i].lives--;
            	game.enemy[i].checkdie();
            	return;
            }
        }
	},
	checkdie: function(){
		//检查还能不能new
		if(this.owner.lives >0){
    		if(this.num == 1){
    			game.player1 = new Player1tank(this.num,this.owner);
    			newtankAudio.play();
    		}else if(this.num == 2){
    			game.player2 = new Player1tank(this.num,this.owner);
    			newtankAudio.play();
    		}
    	}else{
        	this.owner.lives = 0;
        	if(game.player){
        		if(game.player1father.lives+game.player2father.lives == 0){
        			game.gameover();
        		}
        	}else if(!game.player){
        		game.gameover();
        	}
        	if(this.num == 1){
			game.$lives1.html("Player1 lives:"+0);
			}else if(this.num == 2){
				game.$lives2.html("Player2 lives:"+0);
			}
		}
	}
});
