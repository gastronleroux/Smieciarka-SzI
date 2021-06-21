function shuffleArray(array) {
    for(let i = array.length - 1; i>0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

class Foreground {
	constructor() {
		this.width = GAME_WIDTH;
		this.height = GAME_HEIGHT;
		this.blurScreen = 1;
		this.currentHeight = 0;
		frgCtx.fillStyle = "#D5DED6";
	}
	
	clear(){
		frgCtx.clearRect(0,0,this.width,this.height);
		this.blurScreen = 8;
		this.currentHeight = 0;
	}
	
	cover(deltaT) {
		if(!deltaT) return;
		this.blurScreen += 0.2;
		this.currentHeight = Math.pow(2,this.blurScreen)/deltaT;
		if(this.currentHeight >= this.height){
			frgCtx.fillRect(0,this.height,this.width,-this.height);
			this.currentHeight = this.height;
		}else{
			frgCtx.fillRect(0,this.height,this.width,-this.currentHeight);
		}	
	}
	
	uncover(deltaT) {
		if(!deltaT) return;
		frgCtx.clearRect(0,0,this.width,this.height);
		this.blurScreen -= 0.2;
		this.currentHeight = Math.pow(2,this.blurScreen)/deltaT;
		if(this.blurScreen > 1){
			frgCtx.fillRect(0,0,this.width,this.currentHeight);
		}else{
			this.blurScreen = 1;
			this.currentHeight = 0;
		}
	}
	
}

class Background {
  constructor() {
    this.width = GAME_WIDTH;
    this.height = GAME_HEIGHT;
	this.imgMap = new Image();
	this.imgMap.src = "./img/houseMap.png";
	this.imgNotEmpty = new Image();
	this.imgNotEmpty.src = "./img/notEmpty.png";
	
	this.cap = {
		mixed: 0,
		glass: 0,
		paper: 0,
		plastic: 0
	};
	
	this.destinedCap = {
		mixed: 0,
		glass: 0,
		paper: 0,
		plastic: 0
	};
	
  }
  
  clear() {
	bckCtx.clearRect(0, 0, 1000, GAME_HEIGHT);
	pCtx.clearRect(0, 0, 100, GAME_HEIGHT);
	this.imgMap.src = "./img/houseMap.png";
	this.cap = {
		mixed: 0,
		glass: 0,
		paper: 0,
		plastic: 0
	};
	
	this.destinedCap = {
		mixed: 0,
		glass: 0,
		paper: 0,
		plastic: 0
	};
  }
  
  clearHouseStats(){
	pCtx.fillStyle = "#D5DED6";
	pCtx.fillRect(0,200,100,250);
  }
  
  drawMap() {
	bckCtx.clearRect(0, 0, 1000, GAME_HEIGHT);
	pCtx.clearRect(0, 0, 100, GAME_HEIGHT);
	this.updateMap();
	pCtx.fillStyle = "#D5DED6";
	pCtx.fillRect(0,0,100,600);
	pCtx.font = "18px Calibri";
	pCtx.fillStyle = "#5F6760";
	pCtx.fillText("Path Length", 5, 480);
	this.updatePathLength()
  }
  
  updateMap(){
	  bckCtx.drawImage(this.imgMap, 0, 0);
	  if(this.imgMap.src.includes("houseMap")){
		  for(let i = 0; i<currentTrashMap.length; i++){
			  if(!(currentTrashMap[i][1]==0&&currentTrashMap[i][2]==0&&
			  currentTrashMap[i][3]==0&&currentTrashMap[i][4]==0)){
				  bckCtx.drawImage(this.imgNotEmpty, currentTrashMap[i][5], currentTrashMap[i][6]);
			  }
		  }
	  }
  }
  
  updatePathLength(){
	pCtx.fillStyle = "#D5DED6";
	pCtx.font = "20px Calibri";
	pCtx.fillRect(0,510,100,-25);
	pCtx.fillStyle = "#5F6760";
	pCtx.fillText(truck.pathLength, 7, 510);
  }
  
  drawEstimatedClosest(statNum, nodeNum){
	document.getElementById("stats1").innerHTML += "<div id='statNum'>"+statNum+": "+nodeNum+"</div>";
  }
  drawEstimatedClosestChild(statNum, nodeNum){
	document.getElementById("stats2").innerHTML += "<div id='statNumChild'>"+statNum+": "+nodeNum+"</div>";
  }
  
  drawEstimatedClosestPath(pathLength){
	document.getElementById("pathlength").innerHTML = "Path length: "+pathLength;
  }
  
  assertTrash(trash){
	this.cap.mixed = trash[1];
	this.cap.glass = trash[2];
	this.cap.paper = trash[3];
	this.cap.plastic = trash[4];
	this.drawTrash();
	pCtx.font = "19px Calibri";
	pCtx.fillStyle = "#5F6760";
	pCtx.fillText("Node: "+truck.currentPoint, 4, 240);
  }
  
  assertDestinedTrash(trash){
	this.destinedCap.mixed = trash[1];
	this.destinedCap.glass = trash[2];
	this.destinedCap.paper = trash[3];
	this.destinedCap.plastic = trash[4];
	this.drawTrash();
  }
  
  lessenTrash(deltaT){
	if(!deltaT) return;
	if(this.cap.mixed > this.destinedCap.mixed) this.cap.mixed -= 5/deltaT;
	if(this.cap.glass > this.destinedCap.glass) this.cap.glass -= 5/deltaT;
	if(this.cap.paper > this.destinedCap.paper) this.cap.paper -= 5/deltaT;
	if(this.cap.plastic > this.destinedCap.plastic) this.cap.plastic -= 5/deltaT;
	if(this.cap.mixed < this.destinedCap.mixed) this.cap.mixed = this.destinedCap.mixed;
	if(this.cap.glass < this.destinedCap.glass) this.cap.glass = this.destinedCap.glass;
	if(this.cap.paper < this.destinedCap.paper) this.cap.paper = this.destinedCap.paper;
	if(this.cap.plastic < this.destinedCap.plastic) this.cap.plastic = this.destinedCap.plastic;
  }
  
  drawTrash(){
	pCtx.fillStyle = "#D5DED6";
	pCtx.fillRect(0,250,100,200);
	
	pCtx.fillStyle = "#6D5A41";
	pCtx.fillRect(0,300,100,-50*(this.cap.mixed/20));
	pCtx.fillStyle = "#5391A3";
	pCtx.fillRect(0,350,100,-50*(this.cap.glass/20));
	pCtx.fillStyle = "#EFA05E";
	pCtx.fillRect(0,400,100,-50*(this.cap.paper/20));
	pCtx.fillStyle ="#8F7F9E";
	pCtx.fillRect(0,450,100,-50*(this.cap.plastic/20));
  }
  
}

class Truck {
  constructor() {
	this.pathLength = 0;
	this.currentPoint = 0;
    this.width = 50;
    this.height = 50;
	this.speed = 50;
	this.imgSrc = new Image();
	this.imgSrc.src = "./img/truck/down.png";
	
	this.cap = {
		mixed: 0,
		glass: 0,
		paper: 0,
		plastic: 0
	};
	
	this.prevCap = {
		mixed: 0,
		glass: 0,
		paper: 0,
		plastic: 0
	};
	
	this.maxCap = {
		mixed: 50,
		glass: 50,
		paper: 50,
		plastic: 50
	};

    this.position = {
      x: 25,
      y: 0
    };
	
	this.desiredPosition = {
      x: 25,
      y: 0
    };
	
  }

  emptyBins(trash){
	  let full = 0;
	  
	  if(this.cap.mixed + trash[1] >= this.maxCap.mixed || this.cap.glass + trash[2] >= this.maxCap.glass || 
		  this.cap.paper + trash[3] >= this.maxCap.paper || this.cap.plastic + trash[4] >= this.maxCap.plastic){
		  full = 1;
	  }
	  if(this.cap.mixed + trash[1] >= this.maxCap.mixed ){
		  trash[1] = trash[1] - (this.maxCap.mixed - this.cap.mixed);
		  this.cap.mixed = this.maxCap.mixed;
	  }else{
		  this.cap.mixed += trash[1];
		  trash[1] = 0;
	  }
	  if(this.cap.glass + trash[2] >= this.maxCap.glass ){
		  trash[2] = trash[2] - (this.maxCap.glass - this.cap.glass);
		  this.cap.glass = this.maxCap.glass;
	  }else{
		  this.cap.glass += trash[2];
		  trash[2] = 0;
	  }
	  if(this.cap.paper + trash[3] >= this.maxCap.paper ){
		  trash[3] = trash[3] - (this.maxCap.paper - this.cap.paper);
		  this.cap.paper = this.maxCap.paper;
	  }else{
		  this.cap.paper += trash[3];
		  trash[3] = 0;
	  }
	  if(this.cap.plastic + trash[4] >= this.maxCap.plastic ){
		  trash[4] = trash[4] - (this.maxCap.plastic - this.cap.plastic);
		  this.cap.plastic = this.maxCap.plastic;
	  }else{
		  this.cap.plastic += trash[4];
		  trash[4] = 0;
	  }
	  return full;
  }
  
  drive(deltaT) {
	  if(!deltaT) return;
	  if(this.desiredPosition.y != this.position.y ){
		  if(this.desiredPosition.y > this.position.y){
			  this.position.y += this.speed/deltaT;
		  }else{
			  this.position.y -= this.speed/deltaT;
		  }
	  }else if(this.desiredPosition.x != this.position.x ){
		  if(this.desiredPosition.x > this.position.x){
			  this.position.x += this.speed/deltaT;
		  }else{
			  this.position.x -= this.speed/deltaT;
		  }
	  }
  }
  
  clear() {
	ctx.clearRect(0,0,GAME_WIDTH,GAME_HEIGHT);
	this.cap = {
		mixed: 0,
		glass: 0,
		paper: 0,
		plastic: 0
	};
	this.prevCap = {
		mixed: 0,
		glass: 0,
		paper: 0,
		plastic: 0
	};
	this.position = {
      x: 25,
      y: 0
    };
	
	this.desiredPosition = {
      x: 25,
      y: 0
    };
	this.currentPoint = 0;
	this.pathLength = 0;
  }
  
  highenTrash(deltaT){
	if(!deltaT) return;
	if(this.prevCap.mixed < this.cap.mixed) this.prevCap.mixed += 5/deltaT;
	if(this.prevCap.glass < this.cap.glass) this.prevCap.glass += 5/deltaT;
	if(this.prevCap.paper < this.cap.paper) this.prevCap.paper += 5/deltaT;
	if(this.prevCap.plastic < this.cap.plastic) this.prevCap.plastic += 5/deltaT;
	if(this.prevCap.mixed > this.cap.mixed) this.prevCap.mixed = this.cap.mixed;
	if(this.prevCap.glass > this.cap.glass) this.prevCap.glass = this.cap.glass;
	if(this.prevCap.paper > this.cap.paper) this.prevCap.paper = this.cap.paper;
	if(this.prevCap.plastic > this.cap.plastic) this.prevCap.plastic = this.cap.plastic;
  }
  
  lessenTrash(deltaT){
	if(!deltaT) return;
	if(this.prevCap.mixed > this.cap.mixed) this.prevCap.mixed -= 10/deltaT;
	if(this.prevCap.glass > this.cap.glass) this.prevCap.glass -= 10/deltaT;
	if(this.prevCap.paper > this.cap.paper) this.prevCap.paper -= 10/deltaT;
	if(this.prevCap.plastic > this.cap.plastic) this.prevCap.plastic -= 10/deltaT;
	if(this.prevCap.mixed < this.cap.mixed) this.prevCap.mixed = 0;
	if(this.prevCap.glass < this.cap.glass) this.prevCap.glass = 0;
	if(this.prevCap.paper < this.cap.paper) this.prevCap.paper = 0;
	if(this.prevCap.plastic < this.cap.plastic) this.prevCap.plastic = 0;
  }
  
  drawTrash(){
	pCtx.fillStyle = "#D5DED6";
	pCtx.fillRect(0,0,100,200);
	
	pCtx.fillStyle = "#6D5A41";
	pCtx.fillRect(0,50,100,-50*(this.prevCap.mixed/this.maxCap.mixed));
	pCtx.fillStyle = "#5391A3";
	pCtx.fillRect(0,100,100,-50*(this.prevCap.glass/this.maxCap.glass));
	pCtx.fillStyle = "#EFA05E";
	pCtx.fillRect(0,150,100,-50*(this.prevCap.paper/this.maxCap.paper));
	pCtx.fillStyle ="#8F7F9E";
	pCtx.fillRect(0,200,100,-50*(this.prevCap.plastic/this.maxCap.plastic));
  }
  
  draw() {
	ctx.clearRect(0,0,GAME_WIDTH,GAME_HEIGHT);
	ctx.drawImage(this.imgSrc, this.position.x, this.position.y);
  }
}

function clearScreen(){
	if(document.getElementById("stopGenetic")) document.getElementById("stopGenetic").remove();
	document.getElementById("stats1").innerHTML = "";
	document.getElementById("stats2").innerHTML = "";
	document.getElementById("pathlength").innerHTML = "";
	document.getElementById("countlength").innerHTML = "";
	let id = window.requestAnimationFrame(function(){});
	while(id--){
		window.cancelAnimationFrame(id);
	}
	background.clear();
	truck.clear();
	foreground.clear();
	currDestNodes.length = 0;
	currentTrashMap.length = 0;
	geneticCount = 0;
	stopGeneticVar = 0;
	clearInterval(intervalID);
}

function dijkstra(map,s, v){
	let d = [];
	let prev = [];
	let Q = [];
	for(let i = 0; i<map.length; i++){
		Q[i] = 'n';
	}
	Q[s] = 0;
	for(let i = 0; i<map.length; i++){
		d[i] = 'n';
		prev[i] = 'n';
	}
	d[s] = 0;
	while(Q.filter(x => x == 'c').length < Q.length){
		let u = 'n';
		for(let i = 0; i<Q.length; i++){
			if(Q[i]!='n'&&Q[i]!='c'&&(u=='n'||Q[i]<u)){
				u = i;
			}
		}
		Q[u] = 'c';
		for(let i = 0; i<map[u].length; i++){
			if(d[map[u][i][0]] == 'n' || d[map[u][i][0]] > d[u] + map[u][i][1]){
				d[map[u][i][0]] = d[u] + map[u][i][1];
				Q[map[u][i][0]] = d[u] + map[u][i][1];
				prev[map[u][i][0]] = u;
			}
		}
		
	}
	
	if(v=='n'){
		return d.slice();
	}else{
		while(v!=s){
			currDestNodes.push(v);
			v = prev[v];
		}
		return;
	}
}

function targetDD(map,home){
	if(home) nodesOrder.push(0);
	dijkstra(map,truck.currentPoint,nodesOrder.pop());
	drive(currDestNodes.pop());
}

function startDrive(){
	if(nodesOrder.length>0 && document.getElementById("allCanvas").style.display == "none"){
		clearScreen();
		for(let i = 0; i<trashMap.length; i++){
			currentTrashMap.push(trashMap[i].slice());
		}
		document.getElementById("stats").style.display = "none";
		document.getElementById("allCanvas").style.display = "block";
		background.drawMap();
		targetDD(cityMap,0);
	}else{
		alert("Choose an algorithm first.");
	}
}


function drive(dst){
	let u = 'n';
	let map = cityMap;
	if(background.imgMap.src.includes("trashMap")) map = dumpMap;
	for(let i = 0; i<map[truck.currentPoint].length; i++){
		if(map[truck.currentPoint][i][0] == dst){
			u = i;
			break;
		}
	}
	truck.pathLength += map[truck.currentPoint][u][1];
	background.updatePathLength();
	
	if(map[truck.currentPoint][u][2]=='l'){
		truck.imgSrc.src = "./img/truck/left.png";
		truck.desiredPosition.x = truck.position.x - map[truck.currentPoint][u][1]*50;
	}else if(map[truck.currentPoint][u][2]=='p'){
		truck.imgSrc.src = "./img/truck/right.png";
		truck.desiredPosition.x = truck.position.x + map[truck.currentPoint][u][1]*50;
	}else if(map[truck.currentPoint][u][2]=='g'){
		truck.imgSrc.src = "./img/truck/up.png";
		truck.desiredPosition.y = truck.position.y - map[truck.currentPoint][u][1]*50;
	}else if(map[truck.currentPoint][u][2]=='d'){
		truck.imgSrc.src = "./img/truck/down.png";
		truck.desiredPosition.y = truck.position.y + map[truck.currentPoint][u][1]*50;
	}
	truck.currentPoint = dst;
	driveLoop();
}

function recyclePlan(truck, dst = 0){
	let recycleOrder = recycleMap.slice();
	let tempPoint = 0;
	let tempNodes = [];
	let tempDst = 0;
	while(recycleOrder.length>0){
		let recycleDistance = dijkstra(dumpMap,tempPoint,'n');
		let min = 'n';
		for(let i = 0; i<recycleOrder.length; i++){
			if(min=='n'||recycleDistance[recycleOrder[i]]<recycleDistance[recycleOrder[min]]){
				min = i;
			}
		}
		if( recycleOrder[min]==3&&truck.cap.mixed>0 ||
			recycleOrder[min]==5&&truck.cap.glass>0 ||
			recycleOrder[min]==7&&truck.cap.paper>0 ||
			recycleOrder[min]==9&&truck.cap.plastic>0){
				tempPoint = recycleOrder[min];
				tempNodes.unshift(recycleOrder[min]);
				tempDst += recycleDistance[recycleOrder[min]];
		}
		recycleOrder.splice(min,1);
	}
	let backDistance = dijkstra(dumpMap,tempPoint,'n');
	if(dst == 1) return tempDst + backDistance[0];
	if(dst == 2) return tempDst;
	return tempNodes.slice();
}

function coverLoop(timestamp){
	let deltaT = timestamp - lastT;
	lastT = timestamp;
	
	foreground.cover(deltaT);
	if(foreground.height == foreground.currentHeight){
		truck.draw();
		background.updateMap();
		uncoverLoop();
	}else{
		requestAnimationFrame(coverLoop);
	}
}

function uncoverLoop(timestamp){
	let deltaT = timestamp - lastT;
	lastT = timestamp;
	
	foreground.uncover(deltaT);
	if(foreground.currentHeight == 0){
		if(background.imgMap.src.includes("trashMap")){
			let tempNodes = recyclePlan(truck);
			nodesOrder.push(...tempNodes.slice());
			targetDD(dumpMap,0);
		}else if(background.imgMap.src.includes("houseMap")){
			targetDD(cityMap,0);
		}
	}else{
		requestAnimationFrame(uncoverLoop);
	}
}

function trashLoop(timestamp){
	let deltaT = timestamp - lastT;
	lastT = timestamp;
	
	background.lessenTrash(deltaT);
	background.drawTrash();
	truck.highenTrash(deltaT);
	truck.drawTrash();
	
	if( truck.prevCap.mixed == truck.cap.mixed && truck.prevCap.glass == truck.cap.glass &&
		truck.prevCap.paper == truck.cap.paper && truck.prevCap.plastic == truck.cap.plastic &&
		background.cap.mixed == background.destinedCap.mixed && background.cap.glass == background.destinedCap.glass &&
		background.cap.paper == background.destinedCap.paper && background.cap.plastic == background.destinedCap.plastic){
			background.updateMap();
			if( truck.maxCap.mixed == truck.cap.mixed || truck.maxCap.glass == truck.cap.glass ||
				truck.maxCap.paper == truck.cap.paper || truck.maxCap.plastic == truck.cap.plastic || 
				nodesOrder.length == 0){
					if(driveType=='genetic'){
						for(let i=0;i<currentTrashMap.length;i++){
							if(currentTrashMap[i][0]==truck.currentPoint){
								if(currentTrashMap[i][1]>0||currentTrashMap[i][2]>0||currentTrashMap[i][3]>0||currentTrashMap[i][4]>0){
									nodesOrder.push(truck.currentPoint);
								}
								break;
							}
						}
					}
					targetDD(cityMap,1);
				}else{
					targetDD(cityMap,0);
			}
			background.clearHouseStats();
		}else{
			requestAnimationFrame(trashLoop);
	}
}

function untrashLoop(timestamp){
	let deltaT = timestamp - lastT;
	lastT = timestamp;
	
	truck.lessenTrash(deltaT);
	truck.drawTrash();
	
	if( truck.prevCap.mixed == truck.cap.mixed && truck.prevCap.glass == truck.cap.glass &&
		truck.prevCap.paper == truck.cap.paper && truck.prevCap.plastic == truck.cap.plastic){
			if(nodesOrder.length>0){
				if(truck.cap.mixed == 0 && truck.cap.glass == 0 && truck.cap.paper == 0 && truck.cap.plastic == 0){
					targetDD(dumpMap,1);
				}else{
					targetDD(dumpMap,0);
				}
			}else{
				//////////////// KONIEC SYMULACJI ////////////////////
			}
		}else{
			requestAnimationFrame(untrashLoop);
	}
}

function driveLoop(timestamp){
	let deltaT = timestamp - lastT;
	lastT = timestamp;
	
	truck.drive(deltaT);
	truck.draw()
	
	if( (truck.imgSrc.src.includes("down") && truck.position.y < truck.desiredPosition.y ) ||
		(truck.imgSrc.src.includes("up") && truck.position.y > truck.desiredPosition.y ) ||
		(truck.imgSrc.src.includes("left") && truck.position.x > truck.desiredPosition.x ) ||
		(truck.imgSrc.src.includes("right") && truck.position.x < truck.desiredPosition.x ) 
	){
		requestAnimationFrame(driveLoop);
	}else{
		truck.position.y = truck.desiredPosition.y;
		truck.position.x = truck.desiredPosition.x;
		if(currDestNodes.length>0){
			drive(currDestNodes.pop());
		}else{
			if(truck.currentPoint == 0){
				if(background.imgMap.src.includes("houseMap")){
					background.imgMap.src = "./img/trashMap.png";
					truck.position.y = GAME_HEIGHT - truck.height;
				}else if(background.imgMap.src.includes("trashMap")){
					background.imgMap.src = "./img/houseMap.png";
					truck.position.y = 0;
				}
				truck.desiredPosition.y = truck.position.y;
				coverLoop();
			}else if(background.imgMap.src.includes("houseMap")){
				for(let i = 0; i<currentTrashMap.length; i++){
					if(truck.currentPoint==currentTrashMap[i][0]){
						background.assertTrash(currentTrashMap[i].slice());
						truck.emptyBins(currentTrashMap[i]);
						background.assertDestinedTrash(currentTrashMap[i].slice());
						trashLoop();
						break;
					}
				}
			}else if(background.imgMap.src.includes("trashMap")){
				if(truck.currentPoint==3) truck.cap.mixed = 0;
				if(truck.currentPoint==5) truck.cap.glass = 0;
				if(truck.currentPoint==7) truck.cap.paper = 0;
				if(truck.currentPoint==9) truck.cap.plastic = 0;
				untrashLoop();
			}
		}
	}
}

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const GENETIC_COUNT = 500;
let lastT = 0;
let driveType = '';
let nodesOrder = [];
let currDestNodes = [];
let cityMap = [
	[[1,1,'d']],
	[[0,1,'g'], [2,2,'p']],
	[[1,2,'l'], [3,3,'p']],
	[[2,3,'l'], [4,1,'p'], [31,3,'d']],
	[[3,1,'l'], [5,4,'p']],
	[[4,4,'l'], [6,2,'p']],
	[[5,2,'l'], [7,1,'d']],
	[[6,1,'g'], [8,2,'p'], [9,2,'d']],
	[[7,2,'l']],
	[[7,2,'g'], [10,2,'l']],
	[[9,2,'p'], [11,3,'d']],
	[[10,3,'g'], [12,2,'p'], [17,3,'d']],
	[[11,2,'l'], [13,2,'p']],
	[[12,2,'l'], [14,1,'g'], [15,3,'d']],
	[[13,1,'d']],
	[[13,3,'g'], [16,2,'l']],
	[[15,2,'p']],
	[[11,3,'g'], [18,3,'l']],
	[[17,3,'p'], [19,3,'l']],
	[[18,3,'p'], [20,2,'l']],
	[[19,2,'p'], [21,2,'l'], [22,3,'g']],
	[[20,2,'p']],
	[[20,3,'d'], [23,2,'l'], [24,1,'g']],
	[[22,2,'p']],
	[[22,1,'d'], [25,2,'g'], [28,3,'p']],
	[[24,2,'d'], [26,1,'p'], [27,2,'l']],
	[[25,1,'l']],
	[[25,2,'p']],
	[[24,3,'l'], [29,1,'d'], [31,2,'g']],
	[[28,1,'g'], [30,2,'p']],
	[[29,2,'l']],
	[[28,2,'d'], [3,3,'g'], [32,2,'p']],
	[[31,2,'l']]
];
let dumpMap = [
	[[1,2,'g']],
	[[0,2,'d'], [2,3,'g'], [8,7,'p']],
	[[1,3,'d'], [3,2,'g'], [4,3,'p']],
	[[2,2,'d']],
	[[2,3,'l'], [5,2,'g'], [6,4,'p']],
	[[4,2,'d']],
	[[4,4,'l'], [7,2,'p'], [8,3,'d']],
	[[6,2,'l']],
	[[6,3,'g'], [9,3,'p'], [1,7,'l']],
	[[8,3,'l']]
];
let trashMap =	[[2,8,12,3,10,125,50],[4,11,6,15,8,325,50],[5,5,13,6,18,525,50],[8,19,18,5,7,725,100],[10,10,9,6,12,525,200],
				[12,19,12,5,8,625,350],[14,5,9,0,2,725,300],[16,9,8,18,2,626,500],[18,15,12,9,7,375,500],[19,6,19,1,8,225,500],
				[21,7,4,2,9,25,500],[23,18,12,9,9,25,350],[26,12,8,6,18,175,200],[27,10,10,9,11,25,200],[30,12,7,0,10,375,350],[32,0,2,11,6,375,200]];
let recycleMap = [3,5,7,9];
let currentTrashMap = [];
let geneticCount = 0;
let stopGeneticVar = 0;

let canvas = document.getElementById("projectScreen");
let ctx = canvas.getContext("2d");
let backgroundCanvas = document.getElementById("backgroundScreen");
let bckCtx = backgroundCanvas.getContext("2d");
let foregroundCanvas = document.getElementById("foregroundScreen");
let frgCtx = foregroundCanvas.getContext("2d");
let panelCanvas = document.getElementById("panel");
let pCtx = panelCanvas.getContext("2d");

let background = new Background();
let foreground = new Foreground();
let truck = new Truck();

let currentBestGeneration = [];
let pathList = [];
let trashGeneration = [];
let intervalID;


/////// algorytmy wyznaczające ścieżkę

function estimateClosest(){
	if(geneticCount!=0){
		alert("Simulation is still ongoing. Click 'Stop' to end the simulation.");
		return;
	}
	clearScreen();
	nodesOrder = [];
	document.getElementById("allCanvas").style.display = "none";
	document.getElementById("stats").style.display = "block";
	
	let pathLength = 0;
	let tempTruck = new Truck();
	let trashNodes = [];
	let optimalTrashNodes = [];
	driveType = 'closest';
	
	for(let i = 0; i<trashMap.length; i++){
		trashNodes.push(trashMap[i].slice(0,5));
	}
	
	while(trashNodes.length>0){
		let shortestPaths = dijkstra(cityMap,tempTruck.currentPoint, 'n');
		let min = 0;
		for(let i = 1; i<trashNodes.length; i++){
			if(shortestPaths[trashNodes[i][0]] < shortestPaths[trashNodes[min][0]]){
				min = i;
			}
		}
		pathLength += shortestPaths[trashNodes[min][0]];
		tempTruck.currentPoint = trashNodes[min][0];
		optimalTrashNodes.unshift(trashNodes[min][0]);
		background.drawEstimatedClosest(optimalTrashNodes.length-1, optimalTrashNodes[0]);
		
		if(tempTruck.emptyBins(trashNodes[min]) == 1){
			shortestPaths = dijkstra(cityMap,tempTruck.currentPoint, 'n');
			tempTruck.currentPoint = 0;
			pathLength += shortestPaths[0];
			if(trashNodes.length>1){
				pathLength += recyclePlan(tempTruck,1);
			}else if(trashNodes[min][1]==0&&trashNodes[min][2]==0&&trashNodes[min][3]==0&&trashNodes[min][4]==0){
				pathLength += recyclePlan(tempTruck,2);
				trashNodes.splice(min, 1);
			}
			tempTruck.cap.mixed = 0; tempTruck.cap.glass = 0; 
			tempTruck.cap.paper = 0; tempTruck.cap.plastic = 0;
		}else if(trashNodes.length==1&&trashNodes[min][1]==0&&trashNodes[min][2]==0&&trashNodes[min][3]==0&&trashNodes[min][4]==0){
			shortestPaths = dijkstra(cityMap,tempTruck.currentPoint, 'n');
			tempTruck.currentPoint = 0;
			pathLength += shortestPaths[0] + recyclePlan(tempTruck,2);
			trashNodes.splice(min, 1);
		}else{
			trashNodes.splice(min, 1);
		}
	}
	background.drawEstimatedClosestPath(pathLength);
	nodesOrder = optimalTrashNodes.slice();
}

//algorytm genetyczny

function estimateGenetic(){
	if(geneticCount!=0){
		alert("Simulation is still ongoing. Click 'Stop' to end the simulation.");
		return;
	}
	clearScreen();
	nodesOrder = [];
	document.getElementById("allCanvas").style.display = "none";
	document.getElementById("stats").style.display = "block";
	
	let trashNodes = [];
	trashGeneration = [];
	let tempTrashGeneration = [];
	currentBestGeneration = [];
	pathList = []
	let bestSixty = [];
	driveType = 'genetic';
	
	for(let i = 0; i<trashMap.length; i++){
		trashNodes[i] = trashMap[i].slice(0,5);
	}
	
	for(let i = 0; i<100; i++){
		shuffleArray(trashNodes);
		let tempTrashNodes = [];
		trashGeneration[i] = [];
		for(let j = 0; j<trashNodes.length; j++){
			trashGeneration[i][j] = trashNodes[j].slice();
			tempTrashNodes[j] = trashNodes[j].slice();
		}
		
		pathList[i] = estimateGeneticChild(tempTrashNodes);
	}
	
	document.getElementById("stats").innerHTML += "<input id='stopGenetic' onclick='stopGenetic()' type='submit' value='Stop'>";
	
	intervalID = setTimeout(geneticLoop, 10);
}

function geneticLoop(){
	let bestSixty = [];
	let tempTrashGeneration = [];
	let bestPath = 'n';
	
	while(bestSixty.length<60){
		let min = 'n';
		for(let i = 0; i<pathList.length; i++){
			if( pathList[i] != 'n' && ( min == 'n' || pathList[i]<pathList[min] ) ){
				min = i;
			}
		}
		if(bestSixty.length == 0) bestPath = pathList[min]; 
		pathList[min] = 'n';
		bestSixty.push(min);
	}
	
	document.getElementById("stats2").innerHTML = '';
	for(let i = trashGeneration[bestSixty[0]].length-1; i>=0; i--){
		background.drawEstimatedClosestChild(trashGeneration[bestSixty[0]].length-i-1,trashGeneration[bestSixty[0]][i][0]);
	}

	if(currentBestGeneration.length==0||currentBestGeneration[0]>bestPath){
		currentBestGeneration[0] = bestPath;
		currentBestGeneration[1] = [];
		for(let i = 0; i<trashGeneration[bestSixty[0]].length; i++){
			currentBestGeneration[1][i] = trashGeneration[bestSixty[0]][i][0];
		}
		document.getElementById("stats1").innerHTML = '';
		background.drawEstimatedClosestPath(currentBestGeneration[0]);
		for(let i = currentBestGeneration[1].length-1; i>=0; i--){
			background.drawEstimatedClosest(currentBestGeneration[1].length-i-1,currentBestGeneration[1][i]);
		}
	}

	for(let i = 0; i<100; i++){
		tempTrashGeneration[i] = [];
		for(let j = 0; j<trashGeneration[bestSixty[i%60]].length; j++){
			tempTrashGeneration[i][j] = trashGeneration[bestSixty[i%60]][j].slice()
		}
		if(Math.random() > 0.3){
			let randomTrash = Math.floor(Math.random()*60);
			while(randomTrash == i%60){ randomTrash = Math.floor(Math.random()*60); }
			let randomIndex = Math.floor(Math.random()*trashGeneration[0].length);
			let crossChild = [];
			crossChild.push(	trashGeneration[bestSixty[i%60]][randomIndex].slice(),
								trashGeneration[bestSixty[i%60]][(randomIndex+1)%trashGeneration[0].length].slice(), 
								trashGeneration[bestSixty[i%60]][(randomIndex+2)%trashGeneration[0].length].slice() );
			for(let j = 0; j<trashGeneration[randomTrash].length; j++){
				if( crossChild[0][0] != trashGeneration[bestSixty[randomTrash]][(randomIndex+2+j)%trashGeneration[randomTrash].length][0] &&
					crossChild[1][0] != trashGeneration[bestSixty[randomTrash]][(randomIndex+2+j)%trashGeneration[randomTrash].length][0] &&
					crossChild[2][0] != trashGeneration[bestSixty[randomTrash]][(randomIndex+2+j)%trashGeneration[randomTrash].length][0] ){
						crossChild.push(trashGeneration[bestSixty[randomTrash]][(randomIndex+2+j)%trashGeneration[randomTrash].length].slice());
				}
			}
			tempTrashGeneration[i] = [];
			for(let j = 0; j<crossChild.length; j++){
				tempTrashGeneration[i][j] = crossChild[j].slice();
			}
		}
		if (Math.random() > 0.97){
			let randomIndex1 = Math.floor(Math.random()*trashGeneration[0].length);
			let randomIndex2 = Math.floor(Math.random()*trashGeneration[0].length);
			while(randomIndex1==randomIndex2){ randomIndex2 = Math.floor(Math.random()*trashGeneration[0].length); }
			[tempTrashGeneration[i][randomIndex1], tempTrashGeneration[i][randomIndex2]] = [tempTrashGeneration[i][randomIndex2], tempTrashGeneration[i][randomIndex1]] 
		}
	}
	
	for(let i = 0; i<100; i++){
		let tempTrashNodes = [];
		for(let j = 0; j<tempTrashGeneration[i].length; j++){
			trashGeneration[i][j] = tempTrashGeneration[i][j].slice();
			tempTrashNodes[j] = trashGeneration[i][j].slice();
		}
		pathList[i] = estimateGeneticChild(tempTrashNodes);
	}
	
	if(stopGeneticVar){
		stopGeneticVar = 0;
		geneticCount = 0;
		document.getElementById("countlength").innerHTML = '0 generations left';
		nodesOrder = currentBestGeneration[1].slice();
		return;
	}
	
	geneticCount++;
	document.getElementById("countlength").innerHTML = (GENETIC_COUNT-geneticCount) + ' generations left';
	
	if(geneticCount<GENETIC_COUNT){
		intervalID = setTimeout(geneticLoop, 10);
	}else{
		nodesOrder = currentBestGeneration[1].slice();
		geneticCount=0;
	}
	
}

function estimateGeneticChild(trashNodes){
	let pathLength = 0;
	let tempTruck = new Truck();
	
	for(let i = trashNodes.length-1; i>=0; i--){
		let shortestPaths = dijkstra(cityMap,tempTruck.currentPoint, 'n');
		pathLength += shortestPaths[trashNodes[i][0]];
		tempTruck.currentPoint = trashNodes[i][0];
		
		while(tempTruck.emptyBins(trashNodes[i]) == 1){
			shortestPaths = dijkstra(cityMap,tempTruck.currentPoint, 'n');
			if(trashNodes[i][1]>0||trashNodes[i][2]>0||trashNodes[i][3]>0||trashNodes[i][4]>0){
				pathLength += shortestPaths[0]*2;
			}else{
				pathLength += shortestPaths[0];
				tempTruck.currentPoint = 0;
			}
			pathLength += recyclePlan(tempTruck,1);
			tempTruck.cap.mixed = 0; tempTruck.cap.glass = 0; 
			tempTruck.cap.paper = 0; tempTruck.cap.plastic = 0;
		}
	}
	shortestPaths = dijkstra(cityMap,tempTruck.currentPoint, 'n');
	return (pathLength + shortestPaths[0] + recyclePlan(tempTruck,2));
}

function stopGenetic(){
	document.getElementById("stopGenetic").remove();
	stopGeneticVar = 1;
}