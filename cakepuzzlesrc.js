var mousex,mousey,mouseclick,mousedowns;
var scene,ctx,timer,isSyorityuu,clickguard,clickguard2,scale=1.0,smartphone;

var initwidth = 640;
var initheight = 480;

function init() {
	/* canvas要素のノードオブジェクト */
	var canvas = document.getElementById("canvassample");
	/* canvas要素の存在チェックとCanvas未対応ブラウザの対処 */
	if ( ! canvas || !canvas.getContext ) {
		alert("Canvasに対応していません。最新のブラウザをダウンロードしてください。");
		return false;
	}
	/* 2Dコンテキスト */
	ctx = canvas.getContext('2d');
	
	//スマホチェックおよびリサイズ
	var ua = navigator.userAgent;
	if(ua.indexOf('iPhone') > 0 || ua.indexOf('iPod') > 0 || ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0){
		smartphone = true;
	}else if(ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0){
		smartphone = true;
	}else{
		smartphone = false;
	}
	if(smartphone){
		canvas.width = document.documentElement.clientWidth;
		canvas.height = Math.floor(canvas.width * 480 / 640);
	}
	scale = canvas.width / 640;
	ctx.scale(scale,scale);
	
	var loop=function(){
			if(isSyorityuu){
				timer = setTimeout(loop,1);
				return;
			}else{
				//fps: 100　結構気を使う
				var i = Date.now();
				timer = setTimeout(loop,20);
			}
			isSyorityuu = true;
			//背景を塗りつぶし、透明度をリセットする
			ctx.clearRect(0,0,640,480);
			ctx.globalAlpha = 1.0;
			ctx.fillStyle = "#000000";
			ctx.fillRect(0,0,640,480);
			
			
			//中心物体の描画
			scene.draw();
			
			//クリック関連
			mouseclick = clickguard || clickguard2;
			clickguard = false;
			clickguard2 = false;
			
			isSyorityuu = false;
		
	};
	canvas.addEventListener("mousedown",function(e){
		var rect = e.target.getBoundingClientRect();
		mousex = (e.clientX - rect.left) / scale;
		mousey = (e.clientY - rect.top) / scale;
		mousedowns = true;
	},false);
	
	canvas.addEventListener("mouseup",function(e){
		var rect = e.target.getBoundingClientRect();
		mousex = (e.clientX - rect.left) / scale;
		mousey = (e.clientY - rect.top) / scale;
		mousedowns = false;
		clickguard = true;
		clickguard2 = true;
	},false);
	
	canvas.addEventListener("mouseout",function(e){
		mousedowns = false;
		clickguard = false;
		clickguard2 = false;
		mouseclick = false;
	},false);
	if(smartphone){
		canvas.addEventListener("touchmove",function(e){
			var rect = e.target.getBoundingClientRect();
			mousex = (event.touches[0].clientX - rect.left) / scale;
			mousey = (event.touches[0].clientY - rect.top) / scale;
			e.preventDefault();
		},false);
		
	}else{
		canvas.addEventListener("mousemove",function(e){
			var rect = e.target.getBoundingClientRect();
			mousex = (e.clientX - rect.left) / scale;
			mousey = (e.clientY - rect.top) / scale;
		},false);
	}
	
	
	var imgarray=puzzle.concat(logo);
	var strarray=puzzlestr.concat(logostr);
	
	scene = new Loader(imgarray,strarray,new MusicLoader(sound,new Title()));
	loop();
}

//
//読み込みパート(画像オンリー)
//
var loadednum = 0;
var errorappeared = false;
var loading = false;
var loaded = false;

function Loader(loadimgarray,loadimgstr,aa){
	//画像ファイルの情報
	this.imgarray = loadimgarray;
	this.imgstr = loadimgstr;
	this.loadsubekikazu = this.imgarray.length;
	if(loadimgarray.length != loadimgstr.length)alert("warning.loading file length differ");
	this.after = aa;
}
Loader.prototype.draw = function(){
	//読み込みバーの描画
	ctx.textAlign = "center";
	ctx.textBaseline = "bottom";
	ctx.fillStyle = "#FFFFFF";
	ctx.font = "25px 'HG丸ｺﾞｼｯｸM-PRO '";
	ctx.fillText("読み込んでいます。",640*0.5,480*0.4);
	ctx.fillRect(640*0.22,480*0.42,640*0.56,480*0.16);
	ctx.fillStyle = "#4400FF";
	ctx.fillRect(640*0.25,480*0.45,640*0.50*(loadednum/this.loadsubekikazu),480*0.10);
	for(var i=0;i<=this.imgarray.length-1;i++){
		this.imgload(i);
	}
	//読み込み中です・・・
	if(this.loadsubekikazu <= loadednum){
		scene = this.after;
		loaded = true;
	}
};
Loader.prototype.imgload = function(i){
	this.imgarray[i].onload = function(){
		loadednum += 1;
		loading = false;
		
	};
	this.imgarray[i].onerror = function(){
		if(!errorappeared){
			alert("ファイルの読み込みに失敗しました。更新などを押して、リロードしてください。");
			scene = new Error("#00001 FILE_NOT_FOUND",false);
			errorappeared = true;
		}
	};
	
	try{
		this.imgarray[i].src = "cakepuzzle/"+this.imgstr[i];
	}catch(e){
		alert("ファイル"+this.imgstr[i]+"の読み込みに失敗しました。更新などを押して、リロードしてください。");
		scene = new Error(e,false);
	}
};

function Error(e){
	this.text = e;
}
Error.prototype.draw = function(){
	ctx.textAlign = "center";
	ctx.textBaseline = "bottom";
	ctx.fillStyle = "#FFFFFF";
	ctx.font = "25px 'ＭＳ Ｐ明朝 '";
	ctx.fillText("AN ERROR OCUURED!",640*0.50,480*0.30);
	ctx.fillText("ERROR:"+this.text,640*0.50,480*0.40);
	ctx.fillText("If you see this first time,restart,",640*0.50,480*0.50);
	ctx.fillText("or you see it second, send the screen to log.",640*0.50,480*0.70);
};



function Title(){
	this.count = 0;
	this.time = 0;
	
	this.array = new Array(16);
	//ランダム各農家-5-15
	for(var i=0;i<=15;i++){
		this.array[i] = new Array(12);
		for(var j=0;j<=11;j++){
			this.array[i][j] = Math.floor(Math.random() * 6);
		}
	}
}
Title.prototype.draw = function(){
	ctx.globalAlpha = 0.35;
	for(var i=0;i<=15;i++){
		for(var j=0;j<=11;j++){
			ctx.drawImage(puzzle[this.array[i][j]],-18+45*i-puzzle[this.array[i][j]].width/2,-8+45*j-puzzle[this.array[i][j]].height/2);
		}
	}
	ctx.globalAlpha = 1.0;
	ctx.drawImage(logo[0],320-logo[0].width/2,110-logo[0].height/2);
	if(this.count == 0)this.mode = 2;
	if(this.count == 0 && mousex >= 320-logo[2].width/2 && mousex <= 320+logo[2].width/2 && mousey >= 270-logo[2].height/2 && mousey <= 270+logo[2].height/2){
		ctx.drawImage(logo[2],320-logo[2].width*0.55,270-logo[2].height*0.55,logo[2].width*1.1,logo[2].height*1.1);
		this.mode = 0;
	}else{
		ctx.drawImage(logo[2],320-logo[2].width/2,270-logo[2].height/2);
	}
	if(this.count == 0 && mousex >= 320-logo[3].width/2 && mousex <= 320+logo[3].width/2 && mousey >= 360-logo[3].height/2 && mousey <= 360+logo[3].height/2){
		ctx.drawImage(logo[3],320-logo[3].width*0.55,360-logo[3].height*0.55,logo[3].width*1.1,logo[3].height*1.1);
		this.mode = 1;
	}else{
		ctx.drawImage(logo[3],320-logo[3].width/2,360-logo[3].height/2);
	}
	
	if(this.count == 3){
		ctx.globalAlpha = (this.time)/40;
		ctx.fillStyle = "#000000";
		ctx.fillRect(0,0,640,480);
		this.time++;
		if(this.time == 40){
			if(this.mode == 0){
				scene = new Puzzle(true,0);
			}else if(this.mode == 1){
				scene = new Puzzle(false,0);
			}else if(this.mode == 2){
				scene = new Puzzle(false,4);
			}else if(this.mode == 3){
				scene = new Puzzle(false,18);
			}
			
		}
	}else if(this.count == 0){
		if(mouseclick && this.mode != 2){
			if(this.mode == 0){
				this.count = 3;
			}else{
				this.count = 1;
			}
			sound[2].play();
		}
	}else if(this.count == 1){
		ctx.globalAlpha = 0.8;
		ctx.fillStyle = "#000000";
		ctx.fillRect(0,0,640,480);
		ctx.globalAlpha = 1.0;
		
		for(var i=0;i<=3;i++){
			if(mousex >= 320 - logo[i+4].width/2 && mousex <= 320 + logo[i+4].width/2 && mousey >= 120+80*i-logo[i+4].height/2 && mousey <= 120+80*i + logo[i+4].height/2){
				if(mouseclick){
					ctx.drawImage(logo[i+4],320 - logo[i+4].width/2,120+80*i-logo[i+4].height/2,logo[i+4].width,logo[i+4].height);
					sound[2].play();
					this.mode = i+1;
					if(this.mode == 4){
						this.count = 0;
					}else{
						this.count = 3;
					}
				}else{
					ctx.drawImage(logo[i+4],320 - logo[i+4].width*0.55,120+80*i-logo[i+4].height*0.55,logo[i+4].width*1.1,logo[i+4].height*1.1);
				}
			}else{
				ctx.drawImage(logo[i+4],320 - logo[i+4].width/2,120+80*i-logo[i+4].height/2,logo[i+4].width,logo[i+4].height);
			}
		}
	}
};


var puzzle = new Array(9);
var puzzlestr = new Array(9);
for(var i=0;i<=8;i++){
	puzzle[i] = new Image();
	puzzlestr[i] = "f"+(i+1)+".png";
}

var logo = new Array(8);
var logostr = new Array(8);
for(var i=0;i<=7;i++){
	logo[i] = new Image();
	logostr[i] = "logo"+(i+1)+".png";
}

function Puzzle(isDeadable,level){
	//難易度・ステージ判定
	if(isDeadable){
		this.isDeadable = true;
		this.stagenumber = 0;
	}else{
		this.isDeadable = false;
		this.stagenumber = level;
	}
	
	this.sweetsnum = 5;
	if(this.stagenumber >= 5){
		this.sweetsnum = 6;
	}
	this.xsize = 9;
	this.ysize = 9;
	this.puzzlef = new Array(this.xsize);
	
	this.mode = 0;
	this.count = 0;
	this.getcount = 0;
	
	this.startx = 10;
	this.starty = 53;
	
	this.tmpobj = null;
	this.tmpvalue = 0;
	this.wf = new Whiteflash();
	
	this.brakematerial = 0;
	this.needbreakmaterial = 150;
	
	this.score = 0;
	this.limittime = 2000;
	this.chain = 0;
	
	//パズル生成
	for(var i=0;i<=this.xsize - 1;i++){
		this.puzzlef[i] = new Array(this.ysize);
		for(var j=0;j<=this.ysize - 1;j++){
			this.puzzlef[i][j]=this.create();
		}
	}
	
}
Puzzle.prototype.draw = function(){
	//draw anything
	ctx.globalAlpha = 0.6;
	ctx.fillStyle = "#880000";
	ctx.fillRect(450,20,190,450);
	ctx.fillStyle = "#000088";
	ctx.fillRect(440,10,190,450);
	
	ctx.globalAlpha = 1.0;
	ctx.fillStyle = "#FFFFFF";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.font = "25px 'HG丸ｺﾞｼｯｸM-PRO '";
	ctx.fillText("SCORE",460,100);
	if(this.isDeadable){
		ctx.fillText("MISSION",460,180);
		ctx.fillText("LEVEL",460,260);
	}
	ctx.textAlign = "right";
	ctx.fillText(String(this.score),620,130);
	if(this.isDeadable){
		if(this.needbreakmaterial < this.brakematerial){
			ctx.fillText(String(this.needbreakmaterial)+"+/"+String(this.needbreakmaterial),620,210);
		}else{
			ctx.fillText(String(this.brakematerial)+"/"+String(this.needbreakmaterial),620,210);
		}
		ctx.fillText(String(this.stagenumber+1),620,290);
	}
	
	
	ctx.textAlign = "left";
	ctx.fillText("TIME",20,20);
	if(this.limittime >= 0){
		ctx.fillRect(85,20,340*this.limittime/2000,25);
	}
	
	
	for(var i=0;i<=this.xsize-1;i++){
		for(var j=0;j<=this.ysize-1;j++){
			if(this.puzzlef[i][j] != null){
				ctx.globalAlpha = this.puzzlef[i][j].transparency;
				ctx.drawImage(puzzle[this.puzzlef[i][j].color],this.startx+45*i-puzzle[this.puzzlef[i][j].color].width/2+45/2,this.puzzlef[i][j].addy+this.starty+45*j-puzzle[this.puzzlef[i][j].color].height/2+45/2);
			}
		}
	}
	
	
	//isTouch?
	if(this.mode == 0){
		//制限時間が０の場合はゲームオーバー
		if(this.limittime <= 0){
			this.mode = 5;
			this.tmpvalue = 0;
			return;
		}
		
		//消失処理
		ctx.strokeStyle = "#FF0000";
		ctx.lineWidth = 1;
		var px = Math.floor((mousex - this.startx) / 45);
		var py = Math.floor((mousey - this.starty) / 45);
		if(px >= 0 && px <= 8 && py >= 0 && py <= 8){
			//部分崩壊
			ctx.strokeRect(this.startx + 45 * px,this.starty + 45 * py,45,45);
			
			if(mouseclick){
				sound[4].play();
				var touchnumber = this.puzzlef[px][py].color;
				if(touchnumber <= 5){
					this.mode = 1;
					this.puzzlef[px][py] = null;
					//時間減少
					this.limittime -= Math.min(50,this.stagenumber * 5 + 20);
					
				}else if(touchnumber == 7){
					this.mode = 3;
					this.puzzlef[px][py] = null;
				}else if(touchnumber == 8){
					this.mode = 4;
					this.puzzlef[px][py] = null;
				}
				
			}
		}
		this.limittime -= Math.min(this.stagenumber * 0.5 + 1.5,9);
		if(this.limittime < 0){
			this.limittime = 0;
		}
	}else if(this.mode == 1){
		if(this.liftdown()){
			this.chain++;
			
			this.mode = 2;
		}
	}else if(this.mode == 2){
		var tt = this.collapse();
		if(tt == 1){
			this.mode = 1;
		}else if(tt == 0){
			this.chain = 0;
			this.mode = 0;
			
			//noruma kakuninn
			if(this.needbreakmaterial <= this.brakematerial){
				if(this.stagenumber == 5){
					this.sweetsnum = 6;
				}
				this.brakematerial = 0;
				this.needbreakmaterial += 20;
				this.stagenumber++;
				this.limittime = 2000;
				this.wf.add();
			}
		}
	}else if(this.mode == 3){
		if(this.refresh()){
			this.mode = 2;
		}
	}else if(this.mode == 4){
		if(this.change()){
			this.mode = 1;
		}
	}else if(this.mode >= 5){
		ctx.fillStyle = "#FFFFFF";
		ctx.strokeStyle = "#000055";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.lineWidth = 3;
		ctx.font = "bold 70px 'HG丸ｺﾞｼｯｸM-PRO '";
		ctx.fillText("GAME OVER",220,240);
		ctx.strokeText("GAME OVER",220,240);
		this.mode++;
		if(this.mode >= 30){
			if(mouseclick){
				scene = new Title();
			}
		}
	}
	
	this.wf.draw();
	
	if(!this.isDeadable)this.limittime = 2000;
};
//崩壊有:1 崩壊無:0 それ以外(待機中):-1
Puzzle.prototype.collapse = function(){
	if(this.count == 0){
		
		var unusedpuzzle = [];
		var erasepuzzle = [];
		for(var i=0;i<=this.xsize - 1;i++){
			unusedpuzzle[i] = [];
			for(var j=0;j<=this.ysize - 1;j++){
				unusedpuzzle[i][j] = true;
			}
		}
		
		for(var i=0;i<=this.xsize - 1;i++){
			for(var j=0;j<=this.ysize - 1;j++){
				//一転消去処理
				if(!unusedpuzzle[i][j])continue;
				
				var collapsearray = [];
				collapsearray[collapsearray.length] = {px : i , py : j,caution: this.puzzlef[i][j].color};
				unusedpuzzle[i][j] = false;
				this.collapseget(unusedpuzzle,collapsearray,i,j);
				
				//消失処理
				var addnum = 0;
				for(var k=0;k<=collapsearray.length-1;k++){
					if(collapsearray[k].caution != 6){
						addnum++;
					}else{
						unusedpuzzle[collapsearray[k].px][collapsearray[k].py] = true;
					}
				}
				
				
				if(addnum < 4)continue;
				erasepuzzle[erasepuzzle.length] = collapsearray;
				
				this.score += Math.floor(Math.pow(addnum + 10,2.5) / 20 * Math.pow(1.2,this.chain+this.stagenumber));
				this.limittime = Math.min(2000,this.limittime+20*(1+collapsearray.length));
				if(this.isDeadable)this.brakematerial += collapsearray.length;
				
				//消失不可ポイントを元に戻す
			}
		}
		this.tmpobj = erasepuzzle;
		if(erasepuzzle.length == 0){
			return 0;
		}else{
			sound[1].play();
		}
		
	}
	
	
	//崩壊処理
	for(var i=0;i<=this.tmpobj.length-1;i++){
		for(var j=0;j<=this.tmpobj[i].length-1;j++){
			this.puzzlef[this.tmpobj[i][j].px][this.tmpobj[i][j].py].transparency = 1 - 0.05*this.count;
		}
	}
	
	//リターン処理
	if(this.count == 20){
		for(var i=0;i<=this.tmpobj.length-1;i++){
			for(var j=0;j<=this.tmpobj[i].length-1;j++){
				this.puzzlef[this.tmpobj[i][j].px][this.tmpobj[i][j].py] = null;
			}
		}
		this.count = 0;
		return 1;
	}
	this.count++;
	return -1;
};
var stacknum = 0;
Puzzle.prototype.collapseget = function(unusedpuzzle,collapsearray,x,y){
	stacknum++;
	if(stacknum == 100){
		throw "StackFullException";
	}
	if(x != 0 &&  this.isbetween(x-1,y,x,y,unusedpuzzle)){
		collapsearray[collapsearray.length] = {px : x-1 , py : y, caution: this.puzzlef[x-1][y].color};
		unusedpuzzle[x-1][y] = false;
		if(collapsearray[collapsearray.length-1].caution != 6)this.collapseget(unusedpuzzle,collapsearray,x-1,y);
	}
	if(x != this.xsize - 1 && this.isbetween(x+1,y,x,y,unusedpuzzle)){
		collapsearray[collapsearray.length] = {px : x+1 , py : y, caution: this.puzzlef[x+1][y].color};
		unusedpuzzle[x+1][y] = false;
		if(collapsearray[collapsearray.length-1].caution != 6)this.collapseget(unusedpuzzle,collapsearray,x+1,y);
	}
	if(y != 0 && this.isbetween(x,y-1,x,y,unusedpuzzle)){
		collapsearray[collapsearray.length] = {px : x , py : y-1, caution: this.puzzlef[x][y-1].color};
		unusedpuzzle[x][y-1] = false;
		if(collapsearray[collapsearray.length-1].caution != 6)this.collapseget(unusedpuzzle,collapsearray,x,y-1);
	}
	if(y != this.ysize - 1 && this.isbetween(x,y+1,x,y,unusedpuzzle)){
		collapsearray[collapsearray.length] = {px : x , py : y+1, caution: this.puzzlef[x][y+1].color};
		unusedpuzzle[x][y+1] = false;
		if(collapsearray[collapsearray.length-1].caution != 6)this.collapseget(unusedpuzzle,collapsearray,x,y+1);
	}
	stacknum--;
};
Puzzle.prototype.isbetween = function(x,y,z,w,unusedpuzzle){
	return (this.puzzlef[x][y].color == this.puzzlef[z][w].color || this.puzzlef[x][y].color == 6) && unusedpuzzle[x][y] && this.puzzlef[x][y].color <= 6;
};
Puzzle.prototype.liftdown = function(){
	if(this.count == 0){
		for(var i=0;i<=this.xsize-1;i++){//
			//平行移動を反映させる
			var counttable = 0;
			for(var j=this.ysize-1;j>=0;j--){
				if(this.puzzlef[i][j] == null){
					counttable++;
				}else{
					this.puzzlef[i][j].addy = -45 * counttable;
				}
			}
			
			this.getcount = Math.max(this.getcount,counttable * 3);
			//空きを詰めてから埋める
			if(counttable == 0)continue;
			var tmpv = 0;
			for(var j=this.ysize-1;tmpv != counttable;j--){
				if(this.puzzlef[i][j] == null){
					//詰める
					tmpv++;
					for(var k=j;k>=0;k--){
						if(k!=0){
							this.puzzlef[i][k] = this.puzzlef[i][k-1];
						}else{
							this.puzzlef[i][0] = this.createorder(counttable);
						}
					}
				}
				if(this.puzzlef[i][j] == null){
					j++;
					continue;
				}
			}
		}
	}
	
	var use = false;
	for(var i=0;i<=this.xsize-1;i++){
		for(var j=0;j<=this.ysize-1;j++){
			if(this.puzzlef[i][j].addy < 0){
				this.puzzlef[i][j].addy += 15;
			}
		}
	}
	if(this.getcount == this.count){
		
		this.count = 0;
		this.getcount = 0;
		return true;
	}else{
		this.count++;
		return false;
	}
};
Puzzle.prototype.refresh = function(){
	this.count++;
	if(this.count % 3 == 0 && this.count <= this.ysize * 6){
		if(this.count <= 27){
			for(var i=0;i<=this.xsize-1;i++){
				this.puzzlef[i][Math.floor(this.count/3-1)] = null;
			}
		}else{
			for(var i=0;i<=this.xsize-1;i++){
				this.puzzlef[i][Math.floor(this.count/3-this.ysize-1)] = this.create();
			}
		}
	}
	if(this.count == 1)sound[3].play();
	if(this.count == this.ysize * 6 + 14){
		this.count = 0;
		return true;
	}
	return false;
};
Puzzle.prototype.create = function(){
	return {addy:0,color:this.getNumberofFruit(),transparency:1.0};
};
Puzzle.prototype.createorder = function(counttable){
	return {addy:-45 * counttable,color:this.getNumberofFruit(),transparency:1.0};
};
Puzzle.prototype.getNumberofFruit = function(){
	if(this.stagenumber <= 2){
		return Math.floor(Math.random() * this.sweetsnum);
	}else if(this.stagenumber <= 8){
		var ii = Math.random();
		if(ii <= 0.08){//
			return 6;
		}else if(ii <= 0.088){
			return Math.floor(Math.random() * 2) + 7;
		}else{
			return Math.floor(Math.random() * this.sweetsnum);
		}
	}else if(this.stagenumber <= 13){
		var ii = Math.random();
		if(ii <= 0.10){
			return 6;
		}else if(ii <= 0.1075){
			return Math.floor(Math.random() * 2) + 7;
		}else{
			return Math.floor(Math.random() * this.sweetsnum);
		}
	}else if(this.stagenumber <= 19){
		var ii = Math.random();
		if(ii <= 0.11){
			return 6;
		}else if(ii <= 0.1165){
			return Math.floor(Math.random() * 2) + 7;
		}else{
			return Math.floor(Math.random() * this.sweetsnum);
		}
	}else if(this.stagenumber <= 25){
		var ii = Math.random();
		if(ii <= 0.12){
			return 6;
		}else if(ii <= 0.1255){
			return Math.floor(Math.random() * 2) + 7;
		}else{
			return Math.floor(Math.random() * this.sweetsnum);
		}
	}else{
		var ii = Math.random();
		if(ii <= 0.15){
			return 6;
		}else if(ii <= 0.154){
			return Math.floor(Math.random() * 2) + 7;
		}else{
			return Math.floor(Math.random() * this.sweetsnum);
		}
	}
};
Puzzle.prototype.shoot = function(disappearblock){
	for(var i=0;i<=this.xsize-1;i++){
		for(var j=0;j<=this.ysize-1;j++){
			if(disappearblock == this.puzzlef[i][j].color){
				this.puzzlef[i][j] = null;
			}
		}
	}
};
Puzzle.prototype.change = function(){
	if(this.count == 0){
		this.tmpobj = [];
		var tmparray = [];
		//変更色の決定
		for(var x=0;x<=this.sweetsnum-1;x++){
			valloop:for(var i=0;i<=this.xsize-1;i++){
				for(var j=0;j<=this.ysize-1;j++){
					if(this.puzzlef[i][j] != null && x == this.puzzlef[i][j].color){
						tmparray[tmparray.length] = x;
						break valloop;
					}
				}
			}
		}
		//存在する色の指定
		if(tmparray.length == 0){
			this.tmpvalue = -1;
			return;
		}else{
			this.tmpvalue = tmparray[Math.floor(Math.random() * tmparray.length)];
		}
		
		for(var i=0;i<=this.xsize-1;i++){
			for(var j=0;j<=this.ysize-1;j++){
				if(this.puzzlef[i][j] == null)continue;
				if(this.tmpvalue == this.puzzlef[i][j].color){
					this.tmpobj[this.tmpobj.length] = {x:i,y:j};
				}
			}
		}
	}else if(this.count == 20){
		//変更先の色の指定
		console.log(this.tmpvalue);
		var to = (this.tmpvalue + Math.floor(Math.random() * (this.sweetsnum - 2) + 1)) % this.sweetsnum;
		console.log(this.sweetsnum+","+to);
		for(var i=0;i<=this.tmpobj.length-1;i++){
			this.puzzlef[this.tmpobj[i].x][this.tmpobj[i].y].color = to;
		}
	}
	
	for(var i=0;i<=this.tmpobj.length-1;i++){
		ctx.fillStyle = "#FFFFFF";
		
		ctx.beginPath();
		if(this.count <= 10){
			ctx.globalAlpha = 0.9;
			ctx.arc(this.startx + 45 * this.tmpobj[i].x+23,this.starty + 45 * this.tmpobj[i].y+23,this.count*2.5,0,Math.PI*2,false);
		}else if(this.count <= 25){
			ctx.globalAlpha = 0.9 - (this.count - 15) * 0.05;
			ctx.arc(this.startx + 45 * this.tmpobj[i].x+23,this.starty + 45 * this.tmpobj[i].y+23,25,0,Math.PI*2,false);
		}else if(this.count <= 40){
			ctx.globalAlpha = (40 - this.count) / 15 * 0.4;
			ctx.arc(this.startx + 45 * this.tmpobj[i].x+23,this.starty + 45 * this.tmpobj[i].y+23,25+(this.count-25),0,Math.PI*2,false);
		}
		ctx.fill();
	}
	
	this.count++;
	if(this.count == 21)sound[0].play();
	if(this.count == 40){
		this.count = 0;
		return true;
	}
	return false;
};

function Whiteflash(){
	this.flashtime = 0;
}
Whiteflash.prototype.draw = function(){
	if(this.flashtime != 0){
		ctx.globalAlpha = this.flashtime / 20;
		this.flashtime--;
		ctx.fillStyle = "#FFFFFF";
		ctx.fillRect(0,0,640,480);
	}
};
Whiteflash.prototype.add = function(){
	this.flashtime = 20;
	sound[3].play();
};
function MusicArray(s0,isNoneSound,isloop0){
	this.str = s0;
	this.isMusic = isNoneSound;
	try{
		this.musicobj = new Audio("");
	}catch(e){
		this.musicobj.errors = true;
	}
	
	this.musicobj.loaded = false;
	this.musicobj.errors = false;
	this.musicobj.errornum = 0;
	this.isjingle = (isloop0 === 1 ? true : false);
}
MusicArray.prototype.play = function(){
	if(!this.musicobj.loaded)return;
	this.musicobj.pause();
	this.musicobj.currentTime = 0;
	this.musicobj.play();
};
MusicArray.prototype.pause = function(){
	if(!this.musicobj.loaded)return;
	this.musicobj.pause();
};
MusicArray.prototype.stop = function(){
	if(!this.musicobj.loaded)return;
	this.musicobj.pause();
	this.musicobj.currentTime = 0;
};


var globalk_m = new Music();
function Music(){
	this.music = [];
}
Music.prototype.stopall = function(){
	for(var i=0;i<=this.music.length-1;i++){
		this.music[i].pause();
		this.music.currentTime = 0;
	}
};
Music.prototype.append = function(ft){
	this.music[this.music.length] = ft;
};
var musicloadnum = 0;
function MusicLoader(a0,nextgo){
	//ロードする配列組み
	this.next = nextgo;
	this.loadarray = a0;
	
	//スマホであれば読み込まない
	this.sp = false;
	
	//ロードセット
	for(var i=0;i<=this.loadarray.length-1;i++){
		this.set(this.loadarray[i]);
	}
}
MusicLoader.prototype.draw = function(){
	if(this.loadarray.length != 0 && !this.sp){
		//読み込みバーの描画
		ctx.textAlign = "center";
		ctx.textBaseline = "bottom";
		ctx.fillStyle = "#FFFFFF";
		ctx.font = "25px 'ＭＳ Ｐ明朝 '";
		ctx.fillText("読み込んでいます。",640*0.5,480*0.4);
		ctx.fillRect(640*0.22,480*0.42,640*0.56,480*0.16);
		ctx.fillStyle = "#FF0044";
		ctx.fillRect(640*0.25,480*0.45,640*0.50*(this.loadnum/this.loadarray.length),480*0.10);
		
		//エラー修正用
		for(var i=0;i<=this.loadarray.length-1;i++){
			if(this.loadarray[i].musicobj.errors && this.loadarray[i].musicobj.errornum <= 3){
				console.log(i);
				this.loadarray[i].musicobj.errors = false;
				this.srcReset(this.loadarray[i]);
			}
		}
		
		//読み込み判定
		for(var i=0;i<=this.loadarray.length-1;i++){
			if(!this.loadarray[i].musicobj.loaded && !this.loadarray[i].musicobj.errors){
				return;
			}
		}
		//GO TO next!
		scene = this.next;
	}else{
		scene = this.next;
	}
};

MusicLoader.prototype.set = function(ma){
	try{
		ma.musicobj.addEventListener("canplaythrough" , function(){
			globalk_m.append(this);
			this.loaded = true;
		},false);
		ma.musicobj.addEventListener("abort" , function(){
			console.log("abort to load file.");
			this.errors = true;
			this.errornum += 1;
		},false);
		ma.musicobj.addEventListener("stalled" , function(){
			console.log("stalled to load file.");
			this.errors = true;
			this.errornum += 1;
		},false);
		ma.musicobj.addEventListener("error" , function(){
			console.log("failed to load file."+this.src);
			this.errors = true;
			this.errornum += 1;
		},false);
		if(ma.isMusic && !ma.isjingle){
			ma.musicobj.addEventListener("ended",function(){
				this.pause();
				this.currentTime = 0;
				this.play();//for loop
			},false);
		}
		
		//ロードする音楽のタイプを指定する
		var canPlayOgg = ("" !== ma.musicobj.canPlayType("audio/ogg"));
		var canPlayMp3 = ("" !== ma.musicobj.canPlayType("audio/mpeg"));
		var canPlayWav = ("" !== ma.musicobj.canPlayType("audio/wav"));
		
		if(ma.isMusic || ma.isjingle){
			if(canPlayOgg){
				ma.musicobj.src = "cakepuzzle/" + ma.str + ".ogg";
			}else if(canPlayMp3){
				ma.musicobj.src = "cakepuzzle/" + ma.str + ".mp3";
			}else{
				ma.musicobj.errors = true;
				return;
			}
			ma.musicobj.volume = 0.7;
			ma.musicobj.loop = !ma.isjingle;
		}else{
			if(canPlayWav){
				ma.musicobj.src = "cakepuzzle/" + ma.str + ".wav";
			}else if(canPlayMp3){
				ma.musicobj.src = "cakepuzzle/" + ma.str + ".mp3";
			}else{
				ma.musicobj.error = true;
				return;
			}
			ma.musicobj.loop = false;
		}
	}catch(e){
		alert("IE8はAudioに非対応です。効果音なしとなります。\n効果音が必要ならGoogle Chromeなどを使用してください\n(※なくてもクリアは可能です)");
		scene = this.next;
	}
	
};
MusicLoader.prototype.srcReset = function(ma){
	try{
		//ロードする音楽のタイプを指定する
		var canPlayOgg = ("" !== ma.musicobj.canPlayType("audio/ogg"));
		var canPlayMp3 = ("" !== ma.musicobj.canPlayType("audio/mpeg"));
		var canPlayWav = ("" !== ma.musicobj.canPlayType("audio/wav"));
		var canPlayMIDI = ("" !== ma.musicobj.canPlayType("audio/mid"));
		
		if(ma.isMusic || ma.isjingle){
			if(canPlayOgg){
				ma.musicobj.src = "cakepuzzle/" + ma.str + ".ogg";
			}else if(canPlayMp3){
				ma.musicobj.src = "cakepuzzle/" + ma.str + ".mp3";
			}else{
				ma.musicobj.errors = true;
				return;
			}
			ma.musicobj.volume = 0.7;
			ma.musicobj.loop = !ma.isjingle;
		}else{
			if(canPlayWav){
				ma.musicobj.src = "cakepuzzle/" + ma.str + ".wav";
			}else if(canPlayMp3){
				ma.musicobj.src = "cakepuzzle/" + ma.str + ".mp3";
			}else{
				ma.musicobj.errors = true;
				return;
			}
			ma.musicobj.loop = false;
		}
	}catch(e){
		alert("IE8はAudioに非対応です。効果音なしとなります。\n効果音が必要ならGoogle Chromeなどを使用してください\n(※なくてもクリアは可能です)");
		scene = this.next;
	}
};

var sound = [
	new MusicArray("buble03",false),
	new MusicArray("power17",false),
	new MusicArray("cursor38",false),
	new MusicArray("power33",false),
	new MusicArray("cursor37",false)
];

init();