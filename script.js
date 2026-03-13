// ダイヤ改正バージョン

document.getElementById("timetableVersion").innerText =
"2026.3.14改正";

// ===============================
// 日本の祝日判定
// ===============================

function isJapaneseHoliday(date){

const y = date.getFullYear();
const m = date.getMonth()+1;
const d = date.getDate();
const w = date.getDay();

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

// ダイヤ表示

const diagram =
document.getElementById("diagramType");

if(isWeekend || isHoliday){

diagram.innerHTML =
"本日は <span class='holiday'>土休日ダイヤ</span>";

}else{

diagram.innerHTML =
"本日は <span class='weekday'>平日ダイヤ</span>";

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

let next = [];

trains.forEach(train=>{

const time = train[station];

if(!time) return;

const parts = time.split(":");

const minutes =
parseInt(parts[0])*60 +
parseInt(parts[1]);

if(minutes >= nowMinutes){
next.push(train);
}

});

let html =
"<h3>次の逗子1番線到着列車</h3>";

if(next.length === 0){

html +=
"<div class='train'>本日の1番線到着列車は終了しました</div>";

document.getElementById("result").innerHTML = html;

return;

}

const list = next.slice(0,2);

list.forEach((train,index)=>{

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

html +=

"<div class='train'>" +

"<div class='linebar "+lineClass+"'></div>" +

"<div class='train-top'>" +

"<div class='depart'>" +
stationName(station) + " " +
train[station] + "発</div>" +

"<div class='dest'>" +
train.dest + "行</div>" +

"</div>" +

"<div class='arrive'>" +
"逗子 " + train.zushi + "着</div>" +

"<div class='linename'>" +
lineName +
"</div>";

if(index===0 && next.length===1){

html +=
"<div class='last'>" +
"本日最後の1番線到着列車です" +
"</div>";

}

html += "</div>";

});

document.getElementById("result").innerHTML = html;

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