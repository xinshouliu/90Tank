var Map = Class.extend({
    init: function(level){
        this.mapcode = game.R["level"+level];
        // this.wall = 1;
        // this.hardwall =2;
        // this.green =3;
        // this.river =4;
        // this.base =5;
        this.level = level;
        this.i = 0;
        this.f = 0;
        this.enemys = [
            //
            [0,0,0,1,_.sample([1, 0,2, 3]),1,1],
            [480,0,0,2,_.sample([1, 0,2, 3]),1,2.5],
            [0,0,1,1,_.sample([1, 0,2, 3]),1,3],
            [480,0,1,2,_.sample([1, 0,2, 3]),2,2]
        ];
        //特效
        //生命值+2
        //子弹破墙
        //所有坦克停止
        //基地升级
        //所有坦克炸掉
        this.skill = [
        ];


        if(game.player){
            this.amount = 12+ game.level*2; 
        }else{
            this.amount = 6+ game.level; 
        }
        for(var i = 0; i < this.mapcode.length ; i++){
            for(var j = 0; j<this.mapcode[i].length;j++ ){
                var type = this.mapcode[i].charAt(j);
                if(type == 3){
                    game.staticctx.drawImage(game.mainpic, (type-1)*16, 96,16,16,j*16,i*16,16,16);
                }else if(type == 5){
                    if(i%2==0&&j%2==0){
                        game.basex = j*16;
                        game.basey = i*16;
                        //地图new出基地............
                        game.base = new Base();
                    }
                }
            }
        }
        //生命值,玩家标示.
        //传入生命值,
        game.player1father = new Player(1,3);
        if(game.player){
            game.player2father = new Player(2,3);
        };
        this.addtanks();

    },
    render: function(){
        //地图需要每帧都渲染
        //
        for(var i = 0; i < this.mapcode.length ; i++){
        	for(var j = 0; j<this.mapcode[i].length;j++ ){
        		var type = this.mapcode[i].charAt(j);
        		if(type < 5&&type!=3){
        			game.ctx.drawImage(game.mainpic, (type-1)*16, 96,16,16,j*16,i*16,16,16);
        		}else if(type == 5){
        			if(i%2==0&&j%2==0){
                        game.ctx.drawImage(game.mainpic, 256, 0,32,32,j*16,i*16,32,32);	
                        this.baserow = i;
                        this.basecol = j;
                    }
        		}
        	}
        }
        //
        for(var i = 0 ; i < game.actorsarr.length;i++){
            if(game.scene.scenenumber != 1){return};
            game.actorsarr[i].render();   
        }
        if(this.i < this.amount){
            this.f++;
            if(this.f>=5){this.f=0};
            if(this.f%8==0){
            game.ctx.drawImage(game.mainpic, 256+32*this.f, 32,32,32,0,0,32,32);   
            game.ctx.drawImage(game.mainpic, 256+32*this.f, 32,32,32,480,0,32,32);   
            }
        }
        //地图检查了基地
        game.base.check();
        if(game.enemy.length <=0&&game.scene.scenenumber == 1&&this.i>=this.amount){
           //胜利
           setTimeout(function(){
            game.scene.changescene(3);
           }, 1)
        }
    },
    update:function(row,col){
        //改变地图.
        this.mapcode[row] =  this.mapcode[row].slice(0,col) + "0" + this.mapcode[row].slice(col+ 1);
    },
    update2:function(row,col,type){
        this.mapcode[row] =  this.mapcode[row].slice(0,col) + type + this.mapcode[row].slice(col+ 1);
    },
    strong:function(tpye){
        
        var row = this.baserow-1; var col = this.basecol-1;
        for(var i = row; i<row+3; i++){
            for(var j = col;j<col+4;j++){
                this.update2(i,j,tpye);
            }
        };
        
        this.update2(row+1,col+1,5);
        this.update2(row+2,col+2,5);
        this.update2(row+1,col+2,5);
        this.update2(row+2,col+1,5);
    },
    //输入时间.固定时间后墙加厚.
    addwall:function(time){
        var self = this;
        this.strong(2);
        setTimeout(function(){
            self.strong(1);
        }, 1000*time)
    },
    addtanks :function(){
        var gap = 2000-game.level*130;

        var self = this;
        var timer = setInterval(function(){

            self.i++;
            var j = self.i%4;
            var a = new enemytank(self.enemys[j][0],self.enemys[j][1],self.enemys[j][2],self.enemys[j][3],self.enemys[j][4],self.enemys[j][5],self.enemys[j][6]);
            if( self.i >= self.amount||game.scene.scenenumber!=1){
                clearInterval(timer);
            }
        }, gap)
    },
    die:function(){
        if(game.enemy.length <=0){return};
        for(var i = 0 ; i < game.enemy.length;i++){
            game.enemy[i].lives = 0;
            game.enemy[i].checkdie();
        }
    }
})