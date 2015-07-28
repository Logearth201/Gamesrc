var addstr,tryout;
if(typeof root === "undefined"){
	addstr = "";
}else{
	addstr = root;
}

//judge between sp or pc.

try{
	tryout = SPMODEINSTANCE.viewType == "sp";
}catch(e){
	tryout = false;
}



if(!tryout && document.getElementById){
	var strstrstr = 
          "<div class=\"section\">"
            +"<h2>ゲーム</h2>"
         +"<ul>"
         	+"<li><a href=\""+addstr+"game/key.html\">ばとるたいぴんぐ　初夏の物語</a></li>"
            +"<li><a href=\""+addstr+"game/petit.html\">MINILOG</a></li>"
            +"<li><a href=\""+addstr+"game/shuttlerun.html\">20mシャトルラン(キーボード)</a></li>"
            +"<li><a href=\""+addstr+"game/sweetspuzzle.html\">フルーツけしけし</a></li>"
            +"</ul>"
         +"</div><!-- section end -->"
         //
         +"<div class=\"section\">"
            +"<h2>ソフト/便利ツール</h2>"
         +"<ul>"
            +"<li><a href=\""+addstr+"tool/quizgene.html\">クイズツクール</a></li>"
            +"<li><a href=\""+addstr+"tool/escapesrc.html\">自動エスケープシーケンスツール</a></li>"
            +"</ul>"
         +"</div><!-- section end -->"
         //
         +"<div class=\"section\">"
            +"<h2>素材</h2>"
         +"<ul>"
            +"<li><a href=\""+addstr+"material/materialcity.html\">街中の背景素材</a></li>"
            +"<li><a href=\""+addstr+"material/llumi.html\">イルミネーション</a></li>"
            +"<li><a href=\""+addstr+"material/station.html\">駅の背景素材</a></li>"
            +"<li><a href=\""+addstr+"material/depart.html\">デパートの背景素材</a></li>"
            +"<li><a href=\""+addstr+"material/nightcity.html\">夜の街の背景素材</a></li>"
            +"</ul>"
         +"</div><!-- section end -->"
         //
         +"<div class=\"section\">"
            +"<h2>リンク</h2>"
         +"<ul>"
            +"<li><a href=\""+addstr+"link.html\">通常リンク</a></li>"
            +"<li><a href=\"http://logarithmmainblog.blog.fc2.com/\">ブログ</a></li>"
            +"</ul>"
         +"</div><!-- section end -->"
         //
      +"</div><!-- subL end -->";
	document.getElementById("subL").innerHTML = strstrstr;
}


