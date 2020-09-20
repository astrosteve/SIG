var cookies = 0;
var cursors = 0;
var Lama = 0;
var LamaPower = 0;
let result;
let log;					// Message log for dungeon raids.
// var messages = ["None", "None", "None", "None", "None"];   // An array that will contain error message to be displayed. Not yet used.
var mesPos = 1;					// Position to write next message to.
var timeCount = 0;
var TotalPower = 0;			// Total automatic cookie increase per cycle.
var housingAvail = 10; 		// Start off with enough housing for 10 monks/llamas
var totalHoused = 0;		// Total housing used.
var housingCost = 150;		// Base cost to increase housing.
var bakeryCost = 300;       // Cost of one bakery. Price is currently static but I may change that.
var bakeryOwned = 0;        // How many bakeries you own.
var breadLoaves = 25;		// How many loaves they have. Start at 25.
var starving = 0;			// Out of bread and everyone is starving.
var starvingCycles = 0;		// How many cycles they've been starving.
var costSoldier = 50;		// How much a soldier costs to recruit
var breadSoldier = 4;		// Bread quota per soldier
var totalSoldier = 0; 		// How many soldiers
var costMissionary = 15;	// How much a Missionary costs to recruit
var breadMissionary = 2;	// Bread quota per Missionary
var totalMissionary = 0; 	// How many Missionaries

// Currently not using acreage. Unsure how/if I want to do that.
var ownedLand = 2;			// Land at start of game. In acres.
var liveRatio = 20;			// How much housing (as shown in housingAvail) can fit on an acre.
var saveCycle = 90;							// Save every 90 cycles.
var saveCount = 0;								// Counter for saving
let dungeonName;

var unitsTotal = 0;
var privates = 0;
var majors = 0;
var captains = 0;
var colonels = 0;
var generals = 0;
var rooms = 0;
var battles = 0;

var npc = {					// NPC object, used for raiding.
  attack: 0,
  defense: 0,
  damage: 0,
  hp: 0,
  name: "null"
};



function cookieClick(number){
    cookies = cookies + number;
	document.getElementById("cookies").innerHTML = cookies;
};

function buyCursor(){											 // For Meditating Monks. Was originally called cursors.
    var cursorCost = Math.floor(10 * Math.pow(1.1,cursors));     //works out the cost of this cursor
    if (cookies >= cursorCost && totalHoused < housingAvail) {    //checks that the player can afford the cursor
        cursors = cursors + 1;                                   //increases number of cursors
    	cookies = cookies - cursorCost;                          //removes the cookies spent
		totalHoused++;											 // Increased housed.
        document.getElementById('cursors').innerHTML = cursors;  //updates the number of cursors for the user
        document.getElementById('cookies').innerHTML = cookies;  //updates the number of cookies for the user
    } else {
		if (cookies < cursorCost && housingAvail > totalHoused) {       // If they lack the power but have housing, display this error.
			genError(1);
		};
		if (totalHoused >= housingAvail && cookies >= cursorCost) {     // If they lack housing but have sufficient power.
			genError(2);
		};
		if (cookies < cursorCost && totalHoused >= housingAvail){		// If they lack both resources, print this error.
			genError(3);
		};
		
	};
    var nextCost = Math.floor(10 * Math.pow(1.1,cursors));          //works out the cost of the next cursor
    document.getElementById('cursorCost').innerHTML = nextCost;     //updates the cursor cost for the user
	document.getElementById('totalHoused').innerHTML = totalHoused; // Update display of total housed.
};

function buyLama(){
    var LamaCost = Math.floor(100 * Math.pow(1.3,Lama));     		//works out the cost of this cursor
    if (cookies >= LamaCost && totalHoused < housingAvail){         //checks that the player can afford the cursor
        Lama = Lama + 1;                                   			//increases number of Lamas
		LamaPower = LamaPower + 10;									//Need a second variable to track how much Cookies increases by.
    	cookies = cookies - LamaCost;                          		//removes the cookies spent
		totalHoused++;												// Increase housed.
        document.getElementById('Lama').innerHTML = Lama;  			//updates the number of praying Lamas for the user
        document.getElementById('cookies').innerHTML = cookies;  	//updates the number of cookies for the user
    } else {
		if (cookies < LamaCost && housingAvail > totalHoused) {    // If they lack the power but have housing, display this error.
			genError(1);
		};
		if (totalHoused >= housingAvail && cookies >= LamaCost) {    // If they lack housing but have sufficient power.
			genError(2);
		};
		if (cookies < LamaCost && totalHoused >= housingAvail){		// If they lack both resources, print this error.
			genError(3);
		};
		
	};
    var LamaNext = Math.floor(100 * Math.pow(1.3,Lama));     	  	//works out the cost of the next cursor
    document.getElementById('LamaCost').innerHTML = LamaNext;  		//updates the cursor cost for the user
	document.getElementById('totalHoused').innerHTML = totalHoused; // Update display of total housed.
};

function buyHousing() {
	if (cookies >= housingCost) {
		housingAvail = housingAvail+10;
		cookies = cookies - housingCost;
	} else {
		genError(1);												// Not enough cookies.
	};
	document.getElementById('housingAvail').innerHTML = housingAvail;
	document.getElementById('housingAvail2').innerHTML = housingAvail;    // I want to display same number twice, this is the only way I can think of to do so.
};

function buyBakery() {
	if (cookies >= bakeryCost) {
		bakeryOwned++;
		cookies -= bakeryCost;
	} else {
		genError(1);
	};
	document.getElementById('bakeryOwned').innerHTML = bakeryOwned;
};

function breadGen() {
	var breadProd = ((bakeryOwned * 25) + 0);                    // Total bread produced. 
	breadLoaves += breadProd;					                 // Each bakery produces 25 loaves per turn, you start with 5 per cycle.
	breadReq = ((Lama * 3) + (cursors * 1) + (totalSoldier * breadSoldier) + (totalMissionary * breadMissionary));					
	// ^^ Each variable represents how much bread that person needs.
	breadLoaves -= breadReq;									// Figure out new bread count.				
	
	if (breadLoaves < 0) {										// Negative bread is not a thing.
		breadLoaves = 0;
	};
	
    document.getElementById('breadProd').innerHTML = breadProd;
	document.getElementById('breadReq').innerHTML = breadReq;			// Required Bread
	document.getElementById('breadLoaves').innerHTML = breadLoaves;		// Update Loave count on page.	
};

function recruitSoldier() {
	if (cookies >= costSoldier && totalHoused < housingAvail) {		// Check power & housing
		totalSoldier++;
        totalHoused++;													// Take up an available housing unit.
		cookies -= costSoldier;
	} else {
		if (cookies < costSoldier && housingAvail > totalHoused) {    // If they lack the power but have housing, display this error.
			genError(1);
		};
		if (totalHoused >= housingAvail && cookies >= costSoldier) {    // If they lack housing but have sufficient power.
			genError(2);
		};
		if (cookies < costSoldier && totalHoused >= housingAvail){		// If they lack both resources, print this error.
			genError(3);
		};
	};
	
	document.getElementById('totalSoldier').innerHTML = totalSoldier;
	document.getElementById('totalHoused').innerHTML = totalHoused;
};

function viewMilitary() {
	toggleMilitary();												// I could probably just call ToggleMilitary directly.
	calcMilitary();													// Make sure info is up to date, despite it being part of a game cycle.
};

function calcMilitary() {											// Calculates the number of men in military.
	var maxGenerals = 7;												// Maximum number of generals allowed to exist at once.
	
	if (totalSoldier == 0) {
		unitsTotal = 0;									// Make sure everything is set to zero since we have no military at all.
		privates = 0;
		majors = 0;
		captains = 0;
		colonels = 0;
		generals = 0;
	} else {
		if (unitsTotal < totalSoldier) {
			privates += (totalSoldier - unitsTotal);  // A positive difference between the two indicates new soldiers, which are privates.
			unitsTotal = totalSoldier;
		};
		
	};
	document.getElementById('privates').innerHTML = privates;
	document.getElementById('majors').innerHTML = majors;
	document.getElementById('captains').innerHTML = captains;
	document.getElementById('colonels').innerHTML = colonels;
	document.getElementById('generals').innerHTML = generals;
};

function recruitMissionary() {
	if (cookies >= costMissionary && totalHoused < housingAvail) {		// Check power & housing
		totalMissionary++;
        totalHoused++;													// Take up an available housing unit.
		cookies -= costMissionary;
	} else {
		if (cookies < costMissionary && housingAvail > totalHoused) {    // If they lack the power but have housing, display this error.
			genError(1);
		};
		if (totalHoused >= housingAvail && cookies >= costMissionary) {    // If they lack housing but have sufficient power.
			genError(2);
		};
		if (cookies < costMissionary && totalHoused >= housingAvail){		// If they lack both resources, print this error.
			genError(3);
		};
	};
	
	document.getElementById('totalMissionary').innerHTML = totalMissionary;
	document.getElementById('totalHoused').innerHTML = totalHoused;
};

function raidDungeon() {
	var loop;
	var privates = 5;												// For now, 5 privates go on raid.
	generateDungeon();												// Generate a dungeon to raid.
	for (loop = 1; loop <= rooms; loop++) {                         // Start at room 1 and fight your way through!
		if (battles > 0) {											// Do all battles first.
			generateNPC();											// Generate an NPC for the room
			combat(privates, npc);									// Run combat between privates and npc.
	};
};

var adjective = ["null", "Ancient", "Windy", "Sacred", "Hollow", "Unexplored", "Deadly"];	// To make things easier, everything starts at 1. 0 is always null.
var placename = ["null", "Caverns", "Ruins", "Forest", "Jungle", "Desert", "Wasteland"];

function generateDungeon() {
	// Name Generation
	var adj = adjective[randNumber(1, 6)];										// Number to pull from name array
	var name = placename[randNumber(1, 6)];										// Name of/second word in dungeon name.
	dungeonName = adj + " " + name;												// Form full name. I could in theory do all this in one line, but eh.
	// I intend to flesh out name generation at some point in the future.
	document.getElementById("dungeonName").innerHTML = dungeonName;
	// Generates dungeon itself.
	rooms = randNumber(5, 12);												// Dungeons have between 5 and 12 rooms.
	battles = randNumber(1,5);												// Base number of battles per dungeon. Modifiers will be added.
	
};

var npcTypes = ["null", "Goblin", "Hobgoblin", "Slime", "Bearbug", "Kobold"];		// npc name
var npcDef   = ["null", 14      , 16         , 11     , 15       , 14];				// Defense/AC
var npcAtk   = [0     , 3       , 4          , 1      , 4        , 3];				// Attack bonus
var npcDam   = [0     , 6       , 8          , 4      , 8        , 6];				// Damage expressed as part of 1dX. Multiple dice (2d6) not supported yet. 
// NPC arrays. I could put this in an object, but I don't really like working with objects. (says the guy using objects for npc and save data)

function generateNPC() {
	var npcType = randNumber(1,5);									// Determine the sort of enemy we're facing. Correlate with npctypes array.
	npc.name = npcTypes[npcType];
	npc.defense = npcDef[npcType];
	npc.hp = randNumber(1,8) + 2;									// All monsters have same HP for testing purposes.
	npc.attack = npcAtk[npcType];
};

/* var npc = {					// NPC object, used for raiding.
  attack: 0,
  defense: 0,
  damage: 0,
  hp: 0,
  name: "null"
};

*/

function combat(military, enemy) {									// Can only support one on one duels right now. All five privates fight in succession until one wins.
	var privateDef = 15;
	var privateHP = randNumber(1,6) + 1;							// Privates are a little weaker HP-wise than enemies. Majors would be a little stronger.
	var privateAtk = 3;
	var privateDam = 6;												// Damage is expressed as the final part of 1dX. Does not support stuff like 2d6 yet.
	var name = 'Private';
	var initMilitary = randNumber(1,20);
	var initEnemy = randNumber(1,20);								// Just a straight d20 roll to determine who goes first.
	var roundDamage = 0;
	var turn = 0;
	
	if (initEnemy > initMilitary) {
		turn = 1;
	} else {
		turn = 2;
	}; // Turn 1 = enemy, turn 2 = player
	
	if (turn = 1) {
		if (randNumber(1,20)+npc.attack) => privateDef {
		roundDamage = randNumber(npc.damage);
		privateHP -= roundDamage;
		};
		if privateHP <= 0 {
			military--;
		};
		
	if (turn = 2) {
		if (randNumber(1,20)+privateAtk) => npc.defense {
		roundDamage = randNumber(privateDam);
		npc.hp -= roundDamage;
		if npc.hp <= 0 {
			// Put something here to do when npc dies
		};
		
	};
		
	
};


function randNumber(min, max) {
  return Math.random() * (max - min) + min;
}

function CalcPower() {
	TotalPower = LamaPower + cursors; 								// Calculate the total power.
	if (starving == 1) {
		TotalPower = (TotalPower * .5);								// Starving reduces prayer power. Eventually, they'll start dying.
		TotalPower = Math.round(TotalPower);						// Get rid of any possible decimals.
		if (TotalPower < 0) {										// It shouldn't be possible for this to go negative, but just in case it happens.
			TotalPower = 0;
		};
		if (starvingCycles > 15 && starving == 1) {					// They have 15 cycles to get out of starving before bad things happen.
				if (totalSoldier >= 1) {							// Soldiers are dying.
					totalSoldier--;
					totalHoused--;
					if (privates >= 1) {							// Correct categories for death. They die from the bottom up.
						privates--;
					};
					if (privates == 0 && majors >= 1) {				// I'm not going any further with this yet as only privates can exist in game atm.
						majors--;
					};
				};
				
				if (Lama >= 1) {
					Lama--;											// Lamas die first, followed by monks.
					LamaPower -= 10;								// Decrease power.
					totalHoused -= 1;								// Decrease followers
				};
				if (cursors >= 1 && Lama == 0) {					// If all Lamas are dead, then Monks start dying.
					cursors--;
					totalHoused -= 1;
				};
				
		// Will be adding Soldier and Missionaries in here once they actually do something beside eat your bread and take up housing.
		};
		starvingCycles++;
	};
	
	document.getElementById('TotalPower').innerHTML = TotalPower;	
	document.getElementById('Lama').innerHTML = Lama;
	document.getElementById('totalHoused').innerHTML = totalHoused;
	document.getElementById('cursors').innerHTML = cursors;

};

function genError(errorCode) {
	if (messageImportance != 1) { 										// 1 means important, override 'lesser' errors.
		switch(errorCode) {
			case 1:														// 1 is not enough cookies.
			   result = "You do not have the Power for this!";
			break;
			case 2:														// 2 is not enough Housing.
			   result = "You do not have the Housing for this!";
			break;
			case 3:														// 3 is lack of all resources required.
			   result = "You lack all the resources for this!";
			break;
			case 4:														// 4 is not enough bread.
		       result = "You need more bread for this!";					
			break;
			case 5:														// 5 is not enough soldiers for a raid.
				result = "You need more soldiers for this!";			
			break;
			default:													// Generic message if no match.
			   result = "You cannot do that now.";
		};
	};
	/*
	messages[mesPos] = result;										// Should write to array sequentially.
	mespos++;														// Increment position counter.
	if (mespos) > 6 {												// Reset to 1 after array full
		mespos = 1;
	}; */
	// This was created to make an array of recent error messages to display a short message log.
	// I've decided that isn't really a core feature needed right now so am not implementing this any further atm. Code completely untested.
	
	document.getElementById('result').innerHTML = result;			// Update error log for player.
	timeCount = 3;													// Leave error up for 3 cycles before clearing it.
};

function decreaseTimer() {
	if (timeCount > 0) {										// Check if there's time left to display message.
		timeCount--;
	} else {													// Otherwise, time to clear it out.
		result = "No pertinent messages.";
		document.getElementById('result').innerHTML = result;	
		timeCount = 0;											// Just in case timecount somehow went negative. Stupid floating point.
		messageImportance = 0;
	};

};

function endMaint() {											// End of turn maintenance. Just checking for hunger currently.
	if ((breadLoaves == 0) && (totalHoused > 0)) {
		result = "<b>Your followers are starving!</b>";
		timeCount = 3;
		messageImportance = 1; 									// 1 = most important, lesser errors will not overwrite it.
		starving = 1;											// Indicator everyone is starving up in here.
	};
	if ((breadLoaves > 0) && (starving == 1)) {					// Turn off starving indicator if breadloaves are above 0.
		starving = 0;
		starvingCycles = 0;
	};
	
	if ((totalHoused == 0) && (starving == 1)) {				// If no one is left alive, shut off starving. Soldiers and Missionaries never die so this
																// won't work right if you have any of those types.
		starving = 0;
		starvingCycles = 0;
		totalHoused = 0;										// This shouldn't ever be needed, but I'm paranoid.
	};
	
	if ((cursors + Lama == 0)) {								// This is temporary so starving shuts off while Soldiers and Missionaries are immortal.
		starving = 0;
		starvingCycles = 0;
		totalHoused = 0;										// This shouldn't ever be needed, but I'm paranoid.
	};
	document.getElementById('result').innerHTML = result;
};

function saveGame() {											// Saves game
	var save = {												// All the variables needed to save.
		cookies: cookies,
		cursors: cursors,
		Lama: Lama,
		LamaPower: LamaPower,
		housingAvail: housingAvail,
		totalHoused: totalHoused,
		bakeryOwned: bakeryOwned,
		breadLoaves: breadLoaves,
		totalSoldier: totalSoldier,
		totalMissionary: totalMissionary,
		saveCount: saveCount
	};
	localStorage.setItem("save",JSON.stringify(save));
};

function autoSave() {											// Auto save every saveCycle cycles. (Currently 90)
		if (saveCount == saveCycle) {
			saveGame();
			saveCount = 0;
			if (starving != 1) {								// Only update message if no one is starving.
				result = "Game autosaved";
				timeCount = 2;
				document.getElementById('result').innerHTML = result;
			};
		} else {
			saveCount++;
		};
};

function loadGame() {
	var savedGame = JSON.parse(localStorage.getItem("save"));
	if (typeof savedGame.cookies !== "undefined") {	            // Make sure value exists in save before setting anything.
		cookies = savedGame.cookies;
	};
	if (typeof savedGame.cursors !== "undefined") { 
		cursors = savedGame.cursors;
	};
	if (typeof savedGame.Lama !== "undefined") {
		Lama = savedGame.Lama;
	};
	if (typeof savedGame.LamaPower !== "undefined") { 
		LamaPower = savedGame.LamaPower;
	};
	if (typeof savedGame.housingAvail !== "undefined") {
		housingAvail = savedGame.housingAvail;
	};
	if (typeof savedGame.totalHoused !== "undefined") {
		totalHoused = savedGame.totalHoused;
	};
	if (typeof savedGame.bakeryOwned !== "undefined") {
		bakeryOwned = savedGame.bakeryOwned;
	};
	if (typeof savedGame.breadLoaves !== "undefined") {
		breadLoaves = savedGame.breadLoaves;
	};
	if (typeof savedGame.totalSoldier !== "undefined") {
		totalSoldier = savedGame.totalSoldier;
	};
	if (typeof savedGame.totalMissionary !== "undefined") {
		totalMissionary = savedGame.totalMissionary;
	};
	if (typeof savedGame.saveCount !== "undefined") {			// Not sure if I need to restore the state of the autosave counter.
		saveCount = savedGame.saveCount;
	};
	
	
	document.getElementById('Lama').innerHTML = Lama;				// Make sure everything loaded is updated on screen.
	document.getElementById('cursors').innerHTML = cursors;
	document.getElementById('housingAvail').innerHTML = housingAvail;
	document.getElementById('housingAvail2').innerHTML = housingAvail;
	document.getElementById('totalHoused').innerHTML = totalHoused;
	document.getElementById('bakeryOwned').innerHTML = bakeryOwned;
	document.getElementById('breadLoaves').innerHTML = breadLoaves;
	document.getElementById('totalSoldier').innerHTML = totalSoldier;
	document.getElementById('totalMissionary').innerHTML = totalMissionary;
	
};

function toggleMilitary() {
  var x = document.getElementById("military");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

// Main game loop for anything automated.
window.setInterval(function() {
	CalcPower();												// Calculate total power generated from monks/lamas. 
	cookieClick(TotalPower);									// Add TotalPower to cookies.
	breadGen();													// Generate Bread!
	calcMilitary();												// Update the military table.
	endMaint();													// Do any end-of-turn maintenance.
//	autoSave();													// Autosaves periodically.
	decreaseTimer();											// Check if any messages are displayed, if so reduce time left to display.
}, 1000);
