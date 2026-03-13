// ===============================
// 日本の祝日判定
// ===============================

function isJapaneseHoliday(date){

const y = date.getFullYear();
const m = date.getMonth()+1;
const d = date.getDate();
const w = date.getDay();

// 固定祝日
const fixed = [
[1,1],[2,11],[2,23],[4,29],
[5,3],[5,4],[5,5],[8,11],
[11,3],[11,23]
];

for(const f of fixed){
if(m===f[0] && d===f[1]) return true;
}

// 成人の日
if(m===1 && w===1 && d>=8 && d<=14) return true;

// 海の日
if(m===7 && w===1 && d>=15 && d<=21) return true;

// 敬老の日
if(m===9 && w===1 && d>=15 && d<=21) return true;

// スポーツの日
if(m===10 && w===1 && d>=8 && d<=14) return true;

// 春分
if(m===3){
const shunbun =
Math.floor(20.8431 + 0.242194*(y-1980) - Math.floor((y-1980)/4));
if(d===shunbun) return true;
}

// 秋分
if(m===9){
const shuubun =
Math.floor(23.2488 + 0.242194*(y-1980) - Math.floor((y-1980)/4));
if(d===shuubun) return true;
}

return false;
}


// ===============================
// 平日 / 土休日 判定
// ===============================

const today = new Date();

const isWeekend =
today.getDay() === 0 || today.getDay() === 6;

const isHoliday =
isJapaneseHoliday(today);

let trains;

if(isWeekend || isHoliday){
trains = trains_holiday;
}else{
trains = trains_weekday;
}


// ===============================
// 列車検索
// ===============================

function searchTrain(){

const station =
document.getElementById("station").value;

const now = new Date();
const nowMinutes =
now.getHours()*60 + now.getMinutes();

let next1 = null;
let next2 = null;

for(const train of trains){

const time = train[station];

if(!time) continue;

const parts = time.split(":");

const minutes =
parseInt(parts[0])*60 +
parseInt(parts[1]);

if(minutes >= nowMinutes){

if(!next1){
next1 = train;
}

else if(!next2){
next2 = train;
break;
}

}

}

const result =
document.getElementById("result");


// ===============================
// 本日終了表示
// ===============================

if(!next1){

result.innerHTML =
"<div class='train'>" +
stationName(station) +
"から出る本日の逗子駅１番線到着列車は終了しました。" +
"</div>";

return;

}


// ===============================
// 表示作成
// ===============================

let html = "<h3>次の逗子駅１番線到着列車</h3>";

// 1本目
html += createTrainCard(next1,station);


// 2本目あり
if(next2){

html += createTrainCard(next2,station);

}
// 1本のみ
else{

html +=
"<div class='train last'>" +
"本日最後の逗子駅１番線到着列車です" +
"</div>";

}

result.innerHTML = html;

}


// ===============================
// 列車カード作成
// ===============================

function createTrainCard(train,station){

let lineClass="";
let lineName="";

if(train.train.endsWith("S")){
lineClass="yokosuka";
lineName="横須賀線";
}

if(train.train.endsWith("Y")){
lineClass="shonan";
lineName="湘南新宿ライン";
}

let html =

"<div class='train'>" +

"<div class='linebar "+lineClass+"'></div>" +

"<div class='train-top'>" +

"<div class='depart'>" +
stationName(station) +
" " +
train[station] +
"発</div>" +

"<div class='dest'>" +
train.dest +
"行</div>" +

"</div>" +

"<div class='arrive'>" +
"逗子 " +
train.zushi +
"着</div>" +

"<div class='linename'>" +
lineName +
"</div>" +

"</div>";

return html;

}


// ===============================
// 駅名表示
// ===============================

function stationName(key){

const names = {

tokyo:"東京",
shimbashi:"新橋",
shinagawa:"品川",
nishioi:"西大井",
musashi:"武蔵小杉",
shinkawasaki:"新川崎",
yokohama:"横浜",
hodogaya:"保土ケ谷",
higashitotsuka:"東戸塚",
totsuka:"戸塚",
ofuna:"大船",
kitakamakura:"北鎌倉",
kamakura:"鎌倉"

};

return names[key];

}


