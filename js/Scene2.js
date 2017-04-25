//场景管理器
var Scene = Class.extend({
	init : function(){
		this.changescene(0);
	},
	changescene : function(number){
		this.scenenumber = number;
		var self = this;
		switch(this.scenenumber){
			case 0:
				//弹出选择界面.提示选择玩家数量和关卡
				if(game){
					// game.R = {};
					// //渲染所有的需要渲染的演员.
					game.actorsarr = [];
					game.enemy = [];
					game.bullets = [];
					game.$lives1.html("");
					game.$lives2.html("");
					game.$player1score.html("");
					game.$player2score.html("");
					game.player1 = null;
					game.player2 = null;
					game.player = false;
					if(game.map){
						game.map = null;
					}
					game.load();
					// game.init("maincanvas","staticcanvas");
				}
				if(first){
					interAudio.play();	
					first = false;
				}

				$(".page").show(400,function(){
					$(".selectplayers").show();
					$(".tips").html("up=> one  <br/>down=> both  <br/> left => stage+  <br/>right=> stage- <br/> enter=> start");
					document.onkeydown = function(event){
						switch(event.keyCode){
							case 38:
								game.$selects.css("top","250px");
								game.player = false;
								break;
							case 40:
								game.$selects.css("top","281px");
								game.player = true;
								
								break;
							case 37:
								game.level--;
								if(game.level < 1){
									game.level = 10;
								}
								game.$level.html("Stage:"+game.level);
								break;
							case 39:
								game.level++;
								//todo 最高关卡
								if(game.level > 10){
									game.level = 1;
								}
								game.$level.html("Stage:"+game.level);
								break;
							case 13:
								//enter进入场景1
								//todo 最高关卡
								//
								$(".page").css("background","black");
								$(".selectplayers").hide();
								$(".gamestart").fadeIn(600,function(){
									$(".page").css({"background":'url("images/menu.gif") no-repeat'});
									$(".gamestart").hide();
									$(".selectplayers").show();
									self.changescene(1);
								})
								break;
						}
					}
				});
				break;
			case 3:
					game.actorsarr = [];
					game.enemy = [];
					game.bullets = [];
					game.player1 = null;
					game.player2 = null;
					game.map = null;
					game.level++;
					if(game.level >10){
						game.level =10;

						// alert("Zhen -Niu- bi");
						self.changescene(4);
						// self.changescene(0);
						return;
					}

					game.staticctx.clearRect(0, 0, 512, 512);
					$(".tips").html("Congratulations!<br/>Welcome to next stage");
					$("p.next").show();
					$(".selectplayers").hide();
					$(".page").css("background","black").fadeIn(10,function(){
						
						setTimeout(function(){
							$(".page").hide();
							$("p.next").hide();
							$(".page").css({"background":'url("images/menu.gif") no-repeat'});
							self.changescene(1);
						}, 1500)
					});
				break;
			case 4:
				var self =this;
				$(".win").fadeIn(400,function(){
					$(".win .slogen").fadeIn(2400,function(){
						$(".win .slogen").hide();
						$(".win ").hide();
						self.changescene(0);
					})
				})
				break;
            case 1:
                //游戏核心场景，进入这个场景的时候就要实例化一个Map类
                if(game){
					// game.R = {};
					// //渲染所有的需要渲染的演员.
					game.actorsarr = [];
					game.enemy = [];
					game.bullets = [];
					game.player1 = null;
					game.player2 = null;
					if(game.map){
						game.map = null;
					}
					game.load();
					// game.init("maincanvas","staticcanvas");
				}
                $(".page").fadeOut(200);
                if(game.player){
                	$(".tips").html("Player1: W S A D Space<br/>Player2: Up Dow Left Right Enter");
                }else{
                	$(".tips").html("W=>up<br/> S=>down<br/> A=>left<br/> D=>right<br/> Space=>shoot");

                }
                //这里是game的level决定level
                //场景1new出来了map;
                game.map = new Map(game.level);
               	game.$level.html("Stage:"+game.level);
                document.onkeydown = function(event){
					switch(event.keyCode){
						//上
						case 38:
							game.player1.moves();
							game.player1.changedir(0);
							break;
						//下
						case 40:
							game.player1.moves();
							game.player1.changedir(1);
							break;
						//左
						case 37:
							game.player1.moves();
							game.player1.changedir(2);
							break;
						//右
						case 39:
							game.player1.moves();
							game.player1.changedir(3);
							break;
						//enter 
						case 13:
							game.player1.fire();
							break;
						//W	
						case 87:
							game.player2.moves();
							game.player2.changedir(0);
							break;
						//S
						case 83:
							game.player2.moves();
							game.player2.changedir(1);
							break;
						//A
						case 65:
							game.player2.moves();
							game.player2.changedir(2);
							break;
						//D
						case 68:
							game.player2.moves();
							game.player2.changedir(3);
							break;
						//空格 
						case 32:
							if(game.player2){
								game.player2.fire();
							}
							break;
						//1调用die	
						case 49:
							if(game.map){
								game.map.die();
							}
							break;
						case 50:
							if(game.map){
								game.map.addwall(2);
							}
							break;
					}
				}
				document.onkeyup = function(event){
					if(game.player1){
						game.player1.stops();
					}
					if(game.player2){game.player2.stops()};
				}
				break;
			case 2:
				var self =this;
				$(".tips").html("Press enter for restart");
				document.onkeydown = function(event){
					if(event.keyCode==13){
						game.$overimg.hide().css("top",0);
						game.staticctx.clearRect(0, 0, 512, 512);
						game.ctx.clearRect(0, 0, 512, 512);
						game.actorsarr = [];
						game.enemy = [];
						game.bullets = [];
						self.changescene(0);
					}
				}
				break;
		}
	},
	//渲染，这个函数被主循环每帧调用
	render : function(){
		switch(this.scenenumber){
			case 0:
				//选择界面
				$(".tips").html("up=> one  <br/>down=> both  <br/> left => stage+  <br/>right=> stage- <br/> enter=> start");
				if(game.f%8==0){
					game.$selects.css({"background-position":"-128px -96px"});
				}else if(game.f%4==0){
					game.$selects.css({"background-position":"-128px -123px"});
				}
				break;

            case 1:
            	//游戏界面
				if(game.map){
					game.map.render(); 
				}
				 if(game.player){
                	$(".tips").html("Player1: W S A D Space<br/>Player2: Up Dow Left Right Enter");
                }else{
                	$(".tips").html("W=>up<br/> S=>down<br/> A=>left<br/> D=>right<br/> Space=>shoot");

                }
				break;
			case 2:
				//结束界面
				 for(var i = 0; i <  game.map.mapcode.length ; i++){
			    	for(var j = 0; j< game.map.mapcode[i].length;j++ ){
			    		var type =  game.map.mapcode[i].charAt(j);
			    		if(type < 5&&type!=3){
			    			game.ctx.drawImage(game.mainpic, (type-1)*16, 96,16,16,j*16,i*16,16,16);
			    		}else if(type == 5){
			    			if(i%2==0&&j%2==0){
			                    game.ctx.drawImage(game.mainpic, 256, 0,32,32,j*16,i*16,32,32);	
			                }
			    		}
			    	}
			    }
				for(var i = 0; i < game.map.mapcode.length ; i++){
			        for(var j = 0; j<game.map.mapcode[i].length;j++ ){
			            var type = game.map.mapcode[i].charAt(j);
			            if(type == 5&&i%2==0&&j%2==0){
			                game.ctx.drawImage(game.mainpic, 288, 0,32,32,j*16,i*16,32,32);
			            }
			        }
			    }
			    for(var i = 0 ; i < game.enemy.length;i++){
		            game.enemy[i].render();   
		        }
		        game.player1.render();
		        if(game.player){
		        	game.player2.render();
		        }
				game.$overimg.show().animate({"top":"-70px"},800,function(){
	            	$(".tips").html("Press enter for restart");
	        	});
				break;
			case 3:
				$(".tips").html("Congratulations!<br/>Welcome to next stage");
				break;
			case 4:
				$(".tips").html("Zhen Niu Bi");
				if(game){
					game.staticctx.clearRect(0, 0, 512, 512);
				}
				break;
		}
	}
});