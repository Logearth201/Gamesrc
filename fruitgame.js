//
//Musicarrays.
//
var musicloadnum = 0;
function isSmartPhone(){
    var ua = navigator.userAgent;
    if(ua.indexOf('iPhone') > 0 || ua.indexOf('iPod') > 0 || ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0){
        return true;
    }else if(ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0){
        return true;
    }else{
        return false;
    }
}
var soundplayable = true;
var bgm1 = new MusicArray("tamco05",true);
var bgm2 = new MusicArray("tamspace",true);
var snd1 = new MusicArray("bom01",false);
var snd2 = new MusicArray("bom14",false);
var snd3 = new MusicArray("cursor28",false);
var snd4 = new MusicArray("shoot02",false);
var marray = [bgm1,bgm2,snd1,snd2,snd3,snd4];

function MusicArray(s0,isNoneSound,isloop0){
	this.str = s0;
	this.isMusic = isNoneSound;
	try{
		this.musicobj = new Audio("");
	}catch(e){
		this.musicobj = new Nise();
		this.musicobj.error = true;
	}
	
	this.musicobj.loaded = false;
	this.musicobj.error = false;
	this.isjingle = (isloop0 === 1 ? true : false);
}
MusicArray.prototype.play = function(){
	if(!this.musicobj.loaded || !soundplayable)return;
	//BGM
	if(this.isMusic){
		globalk_m.stopall();
		this.musicobj.currentTime = 0;
		this.musicobj.play();
	}else if(!this.musicobj.paused){
		this.musicobj.pause();
		this.musicobj.currentTime = 0;
		this.musicobj.play();
	}else{
		this.musicobj.currentTime = 0;
		this.musicobj.play();
	}
};
MusicArray.prototype.pause = function(){
	if(!this.musicobj.loaded || !soundplayable)return;
	this.musicobj.pause();
};
MusicArray.prototype.stop = function(){
	if(!this.musicobj.loaded || !soundplayable)return;
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
	fps = 5;
	//ロードする配列組み
	this.loadarray = a0;
	this.loadnum = 0;
	this.next = nextgo;
	
	//ロード時間の管理
	this.loadtime = 0;
	
	//スマホであれば読み込まない
	this.sp = isSmartPhone();
	
	//タイムアウト回数
	this.timeout = 0;
}
MusicLoader.prototype.draw = function(){
	if(this.loadarray.length !== 0 && !this.sp && soundplayable){
		//ロードセット
		if(this.loadtime === 0){
			this.set(this.loadarray[this.loadnum]);
			this.loadtime = 1;
		}
		//ロード確認
		//読み込みバーの描画
		ctx.textAlign = "center";
		ctx.textBaseline = "bottom";
		ctx.fillStyle = "#FFFFFF";
		ctx.font = "25px 'ＭＳ Ｐ明朝 '";
		ctx.fillText("BGMを読み込んでいます。",initwidth*0.5,initheight*0.4);
		ctx.fillRect(initwidth*0.22,initheight*0.42,initwidth*0.56,initheight*0.16);
		ctx.fillStyle = "#FF0044";
		ctx.fillRect(initwidth*0.25,initheight*0.45,initwidth*0.50*(this.loadnum/this.loadarray.length),initheight*0.10);
		
		//読み込みバー
		if(this.loadarray[this.loadnum].musicobj.loaded){
			this.loadnum++;
			this.loadtime = 0;
			this.timeout = 0;
			if(this.loadnum === this.loadarray.length){
				fps = 25;
				scene = this.next;
			}
		}else if(this.loadarray[this.loadnum].musicobj.error){
			this.loadnum++;
			this.loadtime = 0;
			this.timeout = 0;
			if(this.loadnum === this.loadarray.length){
				fps = 25;
				scene = this.next;
			}
		}
		
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
			this.error = true;
		},false);
		ma.musicobj.addEventListener("stalled" , function(){
			console.log("stalled to load file.");
			this.error = true;
		},false);
		ma.musicobj.addEventListener("error" , function(){
			console.log("failed to load file."+this.src);
			this.error = true;
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
				ma.musicobj.src = "material/bgm/" + ma.str + ".ogg";
			}else if(canPlayMp3){
				ma.musicobj.src = "material/bgm/" + ma.str + ".mp3";
			}else{
				ma.musicobj.error = true;
				return;
			}
			ma.musicobj.volume = 0.7;
			ma.musicobj.loop = !ma.isjingle;
		}else{
			if(canPlayWav){
				ma.musicobj.src = "material/se/" + ma.str + ".wav";
			}else if(canPlayMp3){
				ma.musicobj.src = "material/se/" + ma.str + ".mp3";
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

//すくいゲーム
//落ちてくる果物をキャッチせよ！
//果物以外のものはキャッチしないでください。
//弾を撃つことで落ちてくる物体を破壊します。
//
var mousex,mousey,mouseclick,mousedowns;
var scene,ctx,timer,isSyorityuu,clickguard,clickguard2,scale=1.0,smartphone;


var first = false;
var initwidth = 640;
var initheight = 600;

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
		console.log(document.documentElement.clientWidth);
		canvas.width = document.documentElement.clientWidth;
		canvas.height = Math.floor(canvas.width * initheight / initwidth);
	}
	scale = canvas.width / initwidth;
	ctx.scale(scale,scale);
	
	var loop=function(){
		try{
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
			ctx.clearRect(0,0,initwidth,initheight);
			ctx.globalAlpha = 1.0;
			ctx.fillStyle = "#000000";
			ctx.fillRect(0,0,initwidth,initheight);
			
			
			//中心物体の描画
			scene.draw();
			
			//クリック関連
			mouseclick = clickguard || clickguard2;
			clickguard = false;
			clickguard2 = false;
			isSyorityuu = false;
		}catch(e){
			if(e.stack){
				console.log(e.stack);
			}else{
				console.log(e.message);
			}
		}
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
	
	var strarray = objsetstr.concat([backviewstr]).concat([citystr,playerimgstr]);
	var imgarray = objsetimg.concat([backview]).concat([city,playerimg]);
	
	scene = new Loader(imgarray,strarray,new MusicLoader(marray,new Title(0)));
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
	//読み込み中です・・・
	if(this.loadsubekikazu != loadednum && !loading){
		loading = true;
		this.imgload(loadednum);
	}
	if(this.loadsubekikazu == loadednum){
		scene = this.after;
		loaded = true;
	}
	//読み込みバーの描画
	ctx.textAlign = "center";
	ctx.textBaseline = "bottom";
	ctx.fillStyle = "#FFFFFF";
	ctx.font = "25px 'HG丸ｺﾞｼｯｸM-PRO '";
	ctx.fillText("読み込んでいます。",initwidth*0.5,initheight*0.4);
	ctx.fillRect(initwidth*0.22,initheight*0.42,initwidth*0.56,initheight*0.16);
	ctx.fillStyle = "#4400FF";
	ctx.fillRect(initwidth*0.25,initheight*0.45,initwidth*0.50*(loadednum/this.loadsubekikazu),initheight*0.10);
	
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
		this.imgarray[i].src = "fallfruit/"+this.imgstr[i];
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
	ctx.fillText("A ERROR OCUURED!",initwidth*0.50,initheight*0.30);
	ctx.fillText("ERROR:"+this.text,initwidth*0.50,initheight*0.40);
	ctx.fillText("If you see this first time,restart,",initwidth*0.50,initheight*0.50);
	ctx.fillText("or you see it second, send the screen to log.",initwidth*0.50,initheight*0.70);
};

//
//Main Part
//
var backview = new Image();
var backviewstr = "bv.png";
function Play(t){
	this.level = 0;
	this.obj = [];
	this.anime = [];
	this.bullet = [];
	this.ebullet = [];
	this.city = [new City(120),new City(220),new City(320),new City(420),new City(520)];
	this.x = 320;
	this.y = 430;
	this.p = new Player();
	this.score = 0;
	this.time = t%600;
	this.stime = 0;
	this.leftbullettime = 0;
	this.bulletleft = 10;//max:10
	this.scene = 0;
	this.combo = 0;
	
	this.interval = [
		[[1,0,0,0,0,0],50,0,20],
		[[2,1,0,0,0,0],47,0,25],
		[[3,2,1,0,0,0],44,0,30],
		[[3,2,2,0,0,0],42,0,35],
		[[3,2,2,1,0,0],39,0,40],
		[[3,2,2,2,1,0],36,0,45],
		[[4,3,2,2,2,0],33,0,50],
		[[2,2,2,2,2,1],30,0,55],
		[[2,1,3,3,3,2],27,0,60],
		[[1,1,1,1,1,1],25,0,65],
		[[1,1,1,1,1,2],23,0,70],
		[[1,2,1,1,2,3],20,0,9999999]
	];
	this.nextgo = 0;
	
	//do not modify
	for(var i=0;i<=this.interval.length-1;i++){
		this.interval[i][2] = 0;
		for(var j=0;j<=this.interval[i][0].length-1;j++){
			this.interval[i][2] += this.interval[i][0][j];
			if(j!=0)this.interval[i][0][j] += this.interval[i][0][j-1];
		}
	}
	this.plife = 3;
}
Play.prototype.draw = function(){
	//背景の描画
	this.drawcosmo();
	if(this.scene == 1){
		this.drawbattle();
	}else if(this.scene == 0){
		this.initdraw();
	}else if(this.scene == 2){
		this.drawdead();
	}
	//フラグ時間加算
	this.time++;
	this.stime++;
};
Play.prototype.initdraw = function(){
	//座標の決定
	var x;
	if(Math.abs(this.stime - 100) >= 55){
		if(this.stime > 70){
			x = 320 + (Math.abs(this.stime - 100) - 55) * 30;
		}else{
			x = 320 - (Math.abs(this.stime - 100) - 55) * 30;
		}
	}else{
		x = 320;
	}
	//描画
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillStyle = "#FFFFFF";
	ctx.font = "40px 'ＭＳ Ｐ明朝 '";
	ctx.fillText("MISSION START!",x,300);
	//制御
	if(this.stime >= 200){
		this.progress();
	}
};
Play.prototype.drawdead = function(){
	//中心点を爆破させるぜ！
	if(this.stime <= 150){
		ctx.fillStyle = "#FF0000";
		var t = 120 + 20*Math.sin(this.stime/3);
		ctx.globalAlpha = 0.6;
		ctx.beginPath();
		ctx.arc(320,300,this.stime%50*10,0,Math.PI*2,false);
		ctx.fill();
		ctx.beginPath();
		ctx.arc(320,300,t*1.2,0,Math.PI*2,false);
		ctx.fill();
	}else if(this.stime == 200){
		this.progress();
	}
};
Play.prototype.progress = function(){
	this.stime = -1;
	this.scene ++;
	if(this.scene == 3){
		scene = new Gameover(this.score,this.time%600);
	}
};
Play.prototype.drawbattle = function(){
	this.p.drawlifepoint();
	//街の描画
	for(var i=0;i<=this.city.length-1;i++){
		if(this.city[i] != null){
			this.city[i].draw();
		}
	}
	//果物の描画
	for(var i=0;i<=this.obj.length-1;i++){
		if(this.obj[i] != null){
			this.obj[i].draw();
		}
	}
	//プレイヤーの描画
	this.p.drawPlayer();
	
	//画面の表示
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillStyle = "#FFFFFF";
	ctx.font = "bold 25px 'ＭＳ Ｐ明朝 '";
	ctx.fillText("すこあ："+Math.floor(this.score),20,10);
	ctx.fillText(Math.floor(this.combo)+"連鎖",250,10);
	
	//弾丸スケールの表示
	ctx.fillStyle = "#000000";
	ctx.fillRect(400,10,200,30);
	ctx.fillStyle = "#00EE00";
	ctx.fillRect(403,13,194*Math.max(0,this.bulletleft)/10,24);
	
	
	
	//アニメの描画
	for(var i=0;i<=this.anime.length-1;i++){
		if(this.anime[i] != null){
			this.anime[i].draw();
		}
	}
	
	for(var i=0;i<=this.bullet.length-1;i++){
		if(this.bullet[i] != null){
			this.bullet[i].draw();
		}
	}
	
	//座標セット
	this.x = mousex;
	this.y = mousey;
	this.p.setposition(this.x,this.y);
	
	//果物の動作,命中判定,消滅判定
	for(var i=0;i<=this.obj.length-1;i++){
		if(this.obj[i] != null){
			this.obj[i].move();
			this.obj[i].effect(this);
			if(this.obj[i].vanish()){
				this.addanime(new Animation(this.obj[i].x,this.obj[i].y));
				if(this.obj[i].y >= 560)this.lifedown(1);
				snd1.play();//TODO
				this.obj[i] = null;
			}
		}
	}
	
	//街命中判定
	for(var i=0;i<=this.city.length-1;i++){
		if(this.city[i] != null){
			if(this.city[i].hit(this.obj)){
				this.addanime(new Animation(this.city[i].x,this.city[i].y));
				snd1.play();
				this.city[i] = null;
			}
		}
	}
	
	//プレイヤー命中判定
	var decre = false;
	for(var i=0;i<=this.obj.length-1;i++){
		if(this.obj[i] != null && this.obj[i].playerhit(this.p.x,this.p.y)){
			decre = true;
		}
	}
	if(decre){
		this.progress();
		snd2.play();
		return;
	}
	
	//街修復判定(各番号ごとに)
	for(var i=0;i<=this.city.length-1;i++){
		if(this.city[i] == null && Math.random() <= 0.0005){
			this.city[i] = new City(120+100*i);
		}
	}
	
	
	//果物の加算処理
	this.randomadd();
	
	//アニメの消失処理
	for(var i=0;i<=this.anime.length-1;i++){
		if(this.anime[i] != null){
			if(this.anime[i].vanish()){
				this.anime[i] = null;
			}
		}
	}
	
	//弾丸発射処理
	if(mouseclick){
		if(this.bulletleft >= 1){
			this.bulletleft = this.bulletleft-1;
			this.addbullet(this.p.x,this.p.y);
			snd4.play();
		}
	}
	
	//弾丸の命中
	for(var i=0;i<=this.bullet.length-1;i++){
		if(this.bullet[i] != null){
			if(this.bullet[i].hit(this,this.obj) && this.bullet[i].vanish()){
				snd1.play();
				this.addscore(10);
				this.bullet[i] = null;
			}else if(this.bullet[i].vanish()){
				this.bullet[i] = null;
				this.combo = 0;
			}
		}
	}
	
	//弾丸の動作
	for(var i=0;i<=this.bullet.length-1;i++){
		if(this.bullet[i] != null){
			this.bullet[i].move();
		}
	}
	
	//弾丸補充
	this.bulletleft = Math.min(this.bulletleft+0.05,10);
	
	if(this.leftbullettime != 0)this.leftbullettime --;
	
	this.score += 0.02;
	
	//効果音
	
};

Play.prototype.lifedown = function(val){
	this.p.life = Math.max(0,this.p.life-val);
	this.combo = 0;
	if(this.p.life <= 0){
		if(this.stime != -1){
			this.progress();
			snd2.play();
		}
	}
};

Play.prototype.addscore = function(val){
	this.score += (50 + this.combo * Math.sqrt(this.combo)) * 50 / this.interval[this.level][1];
	this.combo = Math.min(this.combo+1,50);
};
Play.prototype.addchild = function(val){
	for(var i=0;i<=this.obj.length;i++){
		if(i == this.obj.length || this.obj[i] == null){
			this.obj[i] = val;
			break;
		}
	}
};
Play.prototype.drawcosmo = function(){
	var sp = (this.time * 1.5 )% 600;
	ctx.drawImage(backview,10,sp);
	ctx.drawImage(backview,10,sp-600);
};

Play.prototype.randomadd = function(){
	if(this.time % this.interval[this.level][1] == 0){
		var rand = Math.floor(Math.random() * this.interval[this.level][2]);
		
		for(var i=0;i<=this.interval[this.level][0].length-1;i++){
			if(rand <= this.interval[this.level][0][i]){
				this.addchild(new Fruit(i,15));
				break;
			}
		}
		//補充
		this.nextgo++;
		if(this.nextgo == this.interval[this.level][3] && this.level != this.interval.length){
			this.level++;
			this.nextgo = 0;
		}
	}
};
Play.prototype.addanime = function(val){
	for(var i=0;i<=this.anime.length;i++){
		if(i == this.anime.length || this.anime[i] == null){
			this.anime[i] = val;
			break;
		}
	}
};
Play.prototype.addbullet = function(x,y){
	for(var i=0;i<=this.bullet.length;i++){
		if(i == this.bullet.length || this.bullet[i] == null){
			this.bullet[i] = new Bullet2(x,y);
			break;
		}
	}
};
Play.prototype.addebullet = function(x,y,arg,v){
	for(var i=0;i<=this.obj.length;i++){
		if(i == this.obj.length || this.obj[i] == null){
			this.obj[i] = new EBullet(x,y,arg,v);
			break;
		}
	}
};



function Gameover(score0,t){
	this.score = score0;
	this.startime = t % 600;
	this.time = 0;
	
}
Gameover.prototype.draw = function(){
	//bv
	var sp = (this.startime * 1.5 )% 600;
	ctx.drawImage(backview,10,sp);
	ctx.drawImage(backview,10,sp-600);
	
	//線描画
	
	
	//画面の表示
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillStyle = "#FFFFFF";
	ctx.font = "bold 25px 'ＭＳ Ｐ明朝 '";
	ctx.fillText("すこあ："+Math.floor(this.score),20,10);
	
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	if(this.time >= 70){
		ctx.font = "25px 'ＭＳ Ｐ明朝 '";
		
		ctx.fillText("PRESS TO GO TO TITLE",320,350);
	}
	
	ctx.font = "45px 'ＭＳ Ｐ明朝 '";
	ctx.fillText("GAME OVER",320,250);
	
	this.startime++;
	this.time++;
	
	if(this.time >= 70 && mouseclick){
		scene = new Title(this.startime);
		snd3.play();
		bgm1.stop();
	}
};
function Title(t){
	this.startime = t;
	
}
Title.prototype.draw = function(){
	var sp = (this.startime * 1.5 )% 600;
	ctx.drawImage(backview,10,sp);
	ctx.drawImage(backview,10,sp-600);
	
	//タイトル描画
	ctx.fillStyle = "#FFFFFF";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.font = "40px 'ＭＳ Ｐ明朝 '";
	ctx.fillText("果物から地球を守るゲーム",320,250);
	ctx.font = "20px 'ＭＳ Ｐ明朝 '";
	ctx.fillText("TAP OR CLICK TO START",320,400);
	this.startime++;
	if(mouseclick){
		scene = new Explain(this.startime);
		bgm2.play();
		snd3.play();
	}
};

function Explain(t){
	this.startime = t;
	this.strex = [
		"ミッションコードARG-80、隕石迎撃発動！",
		"市街地に果物が大量に降ってくる。",
		"大気圏をすり抜け、猛スピードで突っ込んでくる。",
		"そのなかで超巨大隕石に対処できる最新兵器を開発した",
		"その強大なる兵器で、隕石をどれだけ迎撃できるか。",
		"兵器の名前は、「AT-72」。",
		"殲滅の72とまで言われてきた最強の兵器が、頼りなく",
		"地球を守るために活躍していく。",
		"そんなストーリーかな？多分☆"
	];
	this.sn = 0;
}
Explain.prototype.draw = function(){
	if(this.sn == 0){
		this.drawgraph();
	}else{
		this.drawhowto();
	}
};
Explain.prototype.drawhowto = function(){
	//背景描画
	var sp = (this.startime * 1.5 )% 600;
	ctx.drawImage(backview,10,sp);
	ctx.drawImage(backview,10,sp-600);
	
	ctx.font = "italic 45px 'ＭＳ Ｐ明朝 '";
	ctx.fillStyle = "#FFFFFF";
	ctx.textAlign = "left";
	ctx.textBaseline = "middle";
	ctx.fillText("HOWTOPLAY",30,65);
	ctx.font = "22px 'ＭＳ Ｐ明朝 '";
	ctx.fillText("落ちてくる果物を打ち落としてください。",30,140);
	ctx.fillText("地面とか街にフルーツが落ちたら大変ね！",30,170);
	
	//弾丸スケールの表示
	ctx.fillStyle = "#000000";
	ctx.fillRect(400,10,200,30);
	ctx.fillStyle = "#00EE00";
	ctx.fillRect(403,13,194,24);
	
	
	
	//地面の描画
	var red = 0;
	var green = 128;
	ctx.fillStyle = "rgb("+red+","+green+",0)";
	ctx.fillRect(0,570,640,30);
	
	//ステージの描画 160 530
	ctx.drawImage(playerimg,100-playerimg.width/2,530-playerimg.height);
	
	ctx.drawImage(objimg[0][0],120,210);
	ctx.drawImage(objimg[0][1],100,250);
	ctx.drawImage(objimg[0][3],140,240);
	
	
	//街の描画
	for(var i=3;i<=4;i++){
		ctx.drawImage(city,(120+100*i)-city.width/2,580-city.height);
	}
	ctx.beginPath();
	ctx.strokeStyle = "#FF0000";
	ctx.lineWidth = 4;
	ctx.arc(420,560,50,0,Math.PI*2,false);
	ctx.stroke();
	
	
	ctx.beginPath();
	ctx.arc(150,260,65,0,Math.PI*2,false);
	ctx.stroke();
	
	ctx.beginPath();
	ctx.moveTo(150+65,260);
	ctx.lineTo(260,260);
	ctx.stroke();
	
	ctx.beginPath();
	ctx.moveTo(300,570);
	ctx.lineTo(290,540);
	ctx.stroke();
	
	ctx.beginPath();
	ctx.strokeStyle = "#FF0000";
	ctx.lineWidth = 4;
	ctx.arc(100,530-playerimg.height/2,40,0,Math.PI*2,false);
	ctx.stroke();
	
	ctx.beginPath();
	ctx.moveTo(100,490-playerimg.height/2);
	ctx.lineTo(80,440-playerimg.height/2);
	ctx.stroke();
	
	//説明
	
	ctx.fillStyle = "#FFFFFF";
	ctx.textAlign = "left";
	ctx.fillText("果物です。",280,230);
	ctx.fillText("こいつらを破壊してください。",280,260);
	ctx.fillText("街や地面にあたらないよう！",280,290);
	
	ctx.textAlign = "center";
	
	ctx.textBaseline = "bottom";
	ctx.fillText("街です。",450,500);
	
	ctx.fillText("地面です。果物が約",270,500);
	ctx.fillText("15回当たると死ぬよ",270,530);
	//ctx.fillRect(403,13,194,24);
	ctx.textAlign = "left";
	ctx.fillText("自機です。クリックで弾発射。右上のバーがエネルギー。",30,380-playerimg.height/2);//
	ctx.fillText("なくなると発射不能。[注意]弾やフルーツが",30,410-playerimg.height/2);
	ctx.fillText("当たると爆発するので、回避してください！",30,440-playerimg.height/2);
	if(mouseclick){
		scene = new Play(this.startime);
		snd3.play();
		bgm2.stop();
		bgm1.play();
	}
	this.startime++;
};
Explain.prototype.drawgraph = function(){
	//背景描画
	var sp = (this.startime * 1.5 )% 600;
	ctx.drawImage(backview,10,sp);
	ctx.drawImage(backview,10,sp-600);
	
	//ロゴ部分
	ctx.fillStyle = "#111111";
	ctx.fillRect(20,90,150,50);
	ctx.font = "italic 45px 'ＭＳ Ｐ明朝 '";
	ctx.fillStyle = "#FFFFFF";
	ctx.textAlign = "left";
	ctx.textBaseline = "middle";
	ctx.fillText("MISSION",30,115);
	
	//クリック部分
	
	
	
	//■枠の描画
	ctx.fillStyle = "#111111";
	ctx.fillRect(20,150,550,400);
	ctx.fillStyle = "#FFFFFF";
	ctx.textAlign = "left";
	ctx.textBaseline = "middle";
	ctx.font = "20px 'ＭＳ Ｐ明朝 '";
	for(var i=0;i<=this.strex.length-1;i++){
		ctx.fillText(this.strex[i],30,190+40*i);
	}
	
	//クリックボックスの描画
	
	if(mouseclick){
		this.sn++;
		snd3.play();
	}
	
	this.startime++;
};


/*

	物体module
	
	落ちてくる物体の管理をする

*/
var objimg = [[]];
var objimgstr = [
	["f1.png","f2.png","f3.png","f4.png","f5.png","f6.png"]
];
for(var i=0;i<=0;i++){
	for(var j=0;j<=objimgstr[i].length-1;j++){
		objimg[i][j] = new Image();
	}
}

var objsetstr = [];
var objsetimg = [];
for(var i=0;i<=objimg.length-1;i++){
	objsetstr = objsetstr.concat(objimgstr[i]);
	objsetimg = objsetimg.concat(objimg[i]);
}
function ObjBase(x0,y0,vy0,type0,num){
	this.x = x0;
	this.y = y0;
	this.vy = vy0;
	this.type = type0;
	this.number = num;
	this.vanishable = false;
	this.mode = 0;
	this.lockon = 0;
	this.drawable = true;
	this.time = 0;
}
ObjBase.prototype.draw = function(){
	if(this.drawable){
		ctx.drawImage(objimg[this.type][this.number],this.x-objimg[this.type][this.number].width/2,this.y-objimg[this.type][this.number].height/2);
	}
};
ObjBase.prototype.move = function(){
	this.y += this.vy;
};
ObjBase.prototype.hitbullet = function(x,y){
	if(this.x - objimg[this.type][this.number].width*0.55 <= x && x <= objimg[this.type][this.number].width *0.55 + this.x){
		if(this.y - objimg[this.type][this.number].height*0.55 <= y && y <= this.y + objimg[this.type][this.number].height*0.55){
			return true;
		}
	}
	this.lockon = 0;
	return false;
};
ObjBase.prototype.vanish = function(){
	return this.y >= 560 || this.x < -50 || this.x > 690 || this.vanishable;
};
ObjBase.prototype.effect = function(){};
ObjBase.prototype.hiteffect = function(gb){};
ObjBase.prototype.hitcity = function(x0,y0){
	return Math.abs(this.x-x0) <= (objimg[this.type][this.number].width + city.width) / 2 && 
		Math.abs(this.y-y0) <= (objimg[this.type][this.number].height + city.height) / 2;
};



function Fruit(num,sc){
	ObjBase.call(this,Math.random() * 600 + 20,-50,2,0,num);
	if(this.number == 1){
		//座標情報の保存
		this.arg = Math.random() * Math.PI * 2;
		//ランダム旋回
		this.move = function(){
			this.x = 240 + 240 * Math.cos(this.arg);
			this.arg += 0.02;
			this.y += this.vy;
		};
	}else if(this.number == 2){
		this.arg = Math.random() * Math.PI * 2;
		this.move = function(){
			this.vy = Math.max(0,1 + 4 * Math.sin(this.arg));
			this.y += this.vy;
			this.arg += 0.06;
		};
	}else if(this.number == 3){
		this.tmpx = this.x;
		this.vanishtime = 0;
		this.move = function(){
			if(this.drawable){
				//動作処理
				this.y += this.vy;
				//判定
				if(this.vanishtime == 50){
					this.drawable = false;
					this.vanishtime = 0;
				}
			}else{
				if(this.vanishtime == 50){
					this.drawable = true;
					this.vanishtime = 0;
				}
			}
			this.vanishtime++;
		};
	}
	this.score = sc;
}
Fruit.prototype = new ObjBase();
Fruit.prototype.constructor = new Fruit();
Fruit.prototype.hiteffect = function(p){
	p.addscore(Math.floor(this.score * Math.sqrt(this.number + 1)));
	p.addanime(new Animation(this.x,this.y));
};
Fruit.prototype.effect = function(p){
	//各種効果(4:分散弾　5:ランダム座標変換)
	if(this.number == 4 && this.y >= 300){
		p.addebullet(this.x,this.y,Math.PI/2 + 0.3,6);
		p.addebullet(this.x,this.y,Math.PI/2 - 0.3,6);
		p.addebullet(this.x,this.y,Math.PI/2,6);
		this.vanishable = true;
	}else if(this.number == 5 && this.time % 50 == 0){
		this.x = objimg[this.type][this.number].width/2 + Math.random() * (640 - objimg[this.type][this.number].width/2);
	}
	this.time++;
};
Fruit.prototype.playerhit = function(x,y){
	if(Math.abs(x-this.x) <= objimg[this.type][this.number].width / 2){
		if(Math.abs(y-this.y) <= objimg[this.type][this.number].height / 2){
			this.vanishable = true;
			return true;
		}
	}
	this.lockon = 0;
	return false;
};

//敵弾
function EBullet(x0,y0,arg,v0){
	ObjBase.call(this,x0,y0,0,0,0);
	this.vx = v0 * Math.cos(arg);
	this.vy = v0 * Math.sin(arg);
	this.r = 10;
}
EBullet.prototype = new ObjBase();
EBullet.prototype.constructor = new EBullet();
EBullet.prototype.draw = function(){
	ctx.beginPath();
	ctx.arc(this.x,this.y,this.r,0,Math.PI*2,false);
	ctx.fill();
};
EBullet.prototype.move = function(){
	this.y += this.vy;
	this.x += this.vx;
};
EBullet.prototype.hitbullet = function(x,y){
	if(this.x - this.r*0.55 <= x && x <= this.r *0.55 + this.x){
		if(this.y - this.r <= y && y <= this.y + this.r*0.55){
			return true;
		}
	}
	this.lockon = 0;
	return false;
};
EBullet.prototype.playerhit = function(x,y){
	if(Math.abs(x-this.x) <= this.r){
		if(Math.abs(y-this.y) <= this.r){
			this.vanishable = true;
			return true;
		}
	}
	this.lockon = 0;
	return false;
};




/*
	プレイヤーモジュール
	プレイヤー情報を管理する
*/
var playerimg = new Image();
var playerimgstr = "own.png";
function Player(){
	this.x = -1;
	this.y = -1;
	this.life = 11;
	this.r = 25;
}
Player.prototype.drawlifepoint = function(){
	//RGB:LPに応じて変動
	var red = Math.floor(128 * (11-this.life) / 11);
	var green = Math.floor(128 * this.life / 11);
	ctx.fillStyle = "rgb("+red+","+green+",0)";
	ctx.fillRect(0,570,640,30);
	
	//自動回復
	this.life = Math.min(11,0.0015+this.life);
};
Player.prototype.setposition = function(x0,y0){
	this.x = Math.max(this.r/2,Math.min(640-this.r/2,x0));
	this.y = 530;
};
Player.prototype.drawPlayer = function(){
	if(this.x == -1)return;
	ctx.drawImage(playerimg,this.x-playerimg.width/2,this.y-playerimg.height);
};
Player.prototype.drawPlayer2 = function(){
	if(this.x == -1)return;
	//ctx.drawImage(player[2],this.x-player[0].width/2,this.y-player[0].height/2);
};

function Bullet(x0,y0){
	this.x = x0;
	this.y = y0;
	this.vanishable = false;
}
Bullet.prototype.draw = function(){
	ctx.lineWidth = 5;
	ctx.strokeStyle = "#FFFFFF";
	ctx.beginPath();
	ctx.moveTo(this.x,this.y);
	ctx.lineTo(this.x,this.y+30);
	ctx.stroke();
};
Bullet.prototype.move = function(){
	this.y -= 5;
};
Bullet.prototype.vanish = function(){
	return Math.abs(320-this.x) > 350 || Math.abs(300-this.y) > 330 || this.vanishable;
};

Bullet.prototype.hit = function(p,fruit){
	for(var i=0;i<=fruit.length-1;i++){
		if(fruit[i] != null){
			if(fruit[i].hitbullet(this.x,this.y)){
				p.addanime(new Animation(fruit[i].x,fruit[i].y));
				fruit[i] = null;
				this.vanishable = true;
				return true;
			}
		}
	}
};
function Bullet2(x0,y0){
	this.x = x0;
	this.y = y0;
	this.vanishable = false;
}
Bullet2.prototype.draw = function(){
	ctx.lineWidth = 8;
	ctx.strokeStyle = "#44FF44";
	ctx.beginPath();
	ctx.moveTo(this.x,this.y);
	ctx.lineTo(this.x,this.y+30);
	ctx.stroke();
	ctx.lineWidth = 5;
	ctx.strokeStyle = "#FFFF44";
	ctx.beginPath();
	ctx.moveTo(this.x,this.y);
	ctx.lineTo(this.x,this.y+30);
	ctx.stroke();
};
Bullet2.prototype.move = function(){
	this.y -= 20;
};
Bullet2.prototype.vanish = function(){
	return Math.abs(320-this.x) > 350 || Math.abs(300-this.y) > 330 || this.vanishable;
};

Bullet2.prototype.hit = function(p,fruit){
	for(var i=0;i<=fruit.length-1;i++){
		if(fruit[i] != null){
			if(fruit[i].hitbullet(this.x,this.y)){
				p.addanime(new Animation(fruit[i].x,fruit[i].y));
				fruit[i] = null;
				this.vanishable = true;
				return true;
			}
		}
	}
};

function Bullet3(x0,y0,number){
	this.x = x0;
	this.y = y0;
	this.num = number;
	this.vanishable = false;
}
Bullet3.prototype.draw = function(){
	ctx.fillStyle = "#770000";
	ctx.beginPath();
	ctx.arc(this.x,this.y,30,0,Math.PI*2,false);
	ctx.fill();
};
Bullet3.prototype.move = function(){
	this.y -= 20;
};
Bullet3.prototype.vanish = function(){
	return Math.abs(320-this.x) > 350 || Math.abs(300-this.y) > 330 || this.vanishable;
};
Bullet3.prototype.hit = function(p,fruit){
	for(var i=0;i<=fruit.length-1;i++){
		if(fruit[i] != null){
			if(fruit[i].hitbullet(this.x,this.y)){
				p.addanime(new Animation(fruit[i].x,fruit[i].y));
				fruit[i] = null;
				this.vanishable = true;
				//弾丸生成
				
				return true;
			}
		}
	}
};



function Animation(x0,y0){
	this.x = x0;
	this.y = y0;
	this.time = 0;
}
Animation.prototype.draw = function(){
	//透明度の管理
	this.time++;
	if(this.time >= 16){
		ctx.globalAlpha = (45 - this.time)/ 30;
	}
	//円の描画
	ctx.beginPath();
	ctx.fillStyle = "#FF0000";
	if(this.time <= 15){
		ctx.arc(this.x,this.y,this.time*2,Math.PI * 2,false);
	}else{
		ctx.arc(this.x,this.y,30,Math.PI * 2,false);
	}
	
	ctx.fill();
	ctx.globalAlpha = 1.0;
	
};
Animation.prototype.vanish = function(){
	return this.time == 45;
};

var city = new Image();
var citystr = "city.png";
function City(x0){
	this.x = x0;
	this.y = 580;
}
City.prototype.draw = function(){
	ctx.drawImage(city,this.x-city.width/2,this.y-city.height);
};
City.prototype.hit = function(fruit){
	for(var i=0;i<=fruit.length-1;i++){
		if(fruit[i] != null){
			if(fruit[i].hitcity(this.x,this.y)){
				fruit[i] = null;
				return true;
			}
		}
	}
};


init();
