var Game = Class.extend({
	init : function(canvasid,staticid){
		//画布
		this.canvas = document.getElementById(canvasid);
		this.ctx = this.canvas.getContext("2d");
		//静态canva 渲染草地
		this.staticcanvas = document.getElementById(staticid);
		this.staticctx = this.staticcanvas.getContext("2d");
		//大精灵图片对象，v是图片对象
		this.mainpic = new Image();
		this.mainpic.src = "images/tankAll.gif";
		//dom元素
		this.$f = $(".slide li.f");
		this.$fps = $(".slide li.fps");
		this.$level = $(".slide li.level");
		this.$lives1 = $(".slide li.lives1");
		this.$lives2 = $(".slide li.lives2");
		this.$player1score = $(".slide li.player1score");
		this.$player2score = $(".slide li.player2score");
		this.$enemy = $(".slide li.enemy");
		this.$selects = $(".page .selectplayers");
        this.$overimg = $(".over");
		//帧编号
		this.f = 0;
		this.gameend = false;
		//默认游戏级别
		this.level = 1;
		//玩家人数,tue表示2,false表示1;
		this.player = false;
		this.fps = 60;
		this.R = {};
		//渲染所有的需要渲染的演员.
		this.actorsarr = [];
		this.enemy = [];
		this.bullets = [];
		//玩家坦克数组
		this.base = null;
        this.load();
        //加载地图文件
		this.start();
	},
	//地图
	load: function(){
		var self = this;
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function(){
			if(xhr.readyState == 4){
				//response
				self.R = JSON.parse(xhr.responseText);
			}
		};
		xhr.open("get","R.txt",true);
		xhr.send(null);
	},
	reload: function(){
		this.gameend = false;
		this.R = {};
		//渲染所以的需要渲染的演员.
		this.actorsarr = [];
		//todo 是否需要清空玩家数组
		this.load();
		this.mainloop();
	},
	start : function(){
		this.T0 = Date.parse(new Date());
		//记录T0的帧号
		this.T0f = this.f;
		//场景管理器，这是Game类唯一new出的东西
		this.scene = new Scene();
        //调用自己的默认场景
		var self = this;
		setTimeout(function(){
			self.mainloop()
		},1)
		
	},
	//主循环函数
	mainloop : function(){
		if(this.gameend){return};
        var self = this;
        //帧编号改变
		this.f++;
		this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
		//.......................这里渲染的
		this.scene.render();
       	this.$f.html("Frames:"+this.f);
       	this.$fps.html("FPS:"+this.fps);
		if(Date.parse(new Date()) - this.T0 >= 1000){
			this.fps = this.f - this.T0f;
			this.T0f = this.f;
			this.T0 = Date.parse(new Date());
		}
		var self = this;
		window.requestAnimationFrame(function(){
			self.mainloop.call(self);
		});
	},
	 gameover:function(){
        //游戏结束后调用的动画.
        //坦克碰到基地,子弹碰到基地
       	this.scene.changescene(2);
    }
});
