var HEROES_NAMES   = ['Lian', 'Nuklo', 'Broly', 'Vivian', 'Brook', 'Seamus', 'Talus'];
var MONSTERS_GUIDE = ['Willo', 'Strix', 'Furia', 'Apex', 'Arkon', 'Morbius', 'Guatus'];

var HEROES_TYPE = ['Thief', 'Warrior', 'Wizard'];
var MONSTERS_TYPE = ['Goblin', 'Orc', 'Vampire'];

function Character(name, type, life, damage){
  this.life = life;
  this.damage = damage;
  this.maxLife = life;
  this.counter = 2;
  this.name = name;
  this.type = type;
  this.trick = Math.random() >= 0.5;
}

Character.prototype.setLife = function(dmg) {
  this.life -= dmg;
}

Character.prototype.updateLife = function() {
  this.life = this.maxLife;
}

Character.prototype.getDamage = function() {
  return this.damage;
}

Character.prototype.attack = function(obj) {
  obj.setLife(this.getDamage());
}

Character.prototype.isAlive = function() {
  return this.life > 0;
}

Character.prototype.getLife = function() {
  if(this.life > 0){
    //console.log("alive");
  } else {
    console.log("dead");
  }
  return this.life;
}

Character.prototype.shouldUseSkill = function() {
  return (this.life < this.maxLife/2 && this.counter > 0); 
}



function Hero() {
  Character.apply(this, arguments);
}

Hero.prototype = Object.create(Character.prototype);
Hero.prototype.constructor = Hero;

Hero.prototype.setLife = function(dmg) {
  if (this.shouldUseSkill()) {
    this.counter--;   
  } else {
      this.life -= dmg;
    } 
}

Hero.prototype.getEnemyPower = function() {
  if(this.trick) {
    if (this.shouldUseSkill()) {
      this.counter--;
      return this.damage*2;
    }
    return this.damage;
  }
}


function Monster() {
  Character.apply(this, arguments);
}

Monster.prototype = Object.create(Character.prototype);
Monster.prototype.constructor = Monster;

Monster.prototype.getDamage = function() {
  if (this.shouldUseSkill()) {
    this.counter--;
    return this.damage*2;
  }
  return this.damage;
}

Monster.prototype.getEnemyPower = function(dmg) {
  if(this.trick) {
    if (this.shouldUseSkill()) {
      this.counter--;   
    }
  }
}

function monsterFactory(name, type) {
  var life;
  var damage;
  switch(type) {
      case 'Goblin':
          life = 220;
          damage = 50;
          break;
      case 'Orc':
          life = 270;
          damage = 80;
          break;
      case 'Vampire':
          life = 320;
          damage = 70;
          break;
      case 'Zombie':
          life = 280;
          damage = 90;
          break;
      default:
          console.log("There is no such type of Monster");
  }
  return new Monster(name, type, life, damage);
}

function heroFactory(name, type) {
  var life;
  var damage;
  switch(type) {
      case 'Thief':
          life = 200;
          damage = 30;
          break;
      case 'Warrior':
          life = 230;
          damage = 60;
          break;
      case 'Wizard':
          life = 290;
          damage = 70;
          break;
      case 'Archer':
          life = 210;
          damage = 50;
          break;
      default:
          console.log("There is no such type of Hero");
  }
  return new Hero(name, type, life, damage);
}


function Tournament(amount) {
  this.amount = amount;
}


Tournament.prototype.register = function() {
  var args = Array.prototype.slice.call(arguments);
  var filtered_players = this.faceControl.apply(this, args);
  //console.log(players);
  this.players = [];
    for (var i = 0; i < filtered_players.length; i++) {
      if (this.players.length < this.amount) {
        this.players.push(filtered_players[i]);
        console.log('All players has been registered');
      } else {
        console.log('Required amount of players has already been registered');
        break;
      }
    }  
  console.log('Number of players: ' + this.players.length);
  //console.log(this.players);
  //return filtered_players;
}

    
Tournament.prototype.faceControl = function() {
  var args = Array.prototype.slice.call(arguments);
  var filtered_players = [];
  for (var i = 0; i < args.length; i++) {
    if (args[i] instanceof Monster && MONSTERS_GUIDE.indexOf(args[i].name) == -1) {
       console.log("not allowed monster name");
       continue;
    }
    if (args[i] instanceof Monster && MONSTERS_TYPE.indexOf(args[i].type) == -1) {
       console.log("not allowed monster type");
       continue;
    }
    if (args[i] instanceof Hero && HEROES_NAMES.indexOf(args[i].type) == -1) {
       console.log("not allowed hero type");
       continue;
    }
    if (args[i] instanceof Hero && HEROES_TYPE.indexOf(args[i].type) == -1) {
       console.log("not allowed hero type");
       continue;
    }
    filtered_players.push(args[i]);
  }
  return filtered_players;
}

Tournament.prototype.splitPairs = function() {}

Tournament.prototype.fight = function() {
  var result = [];
  this.winners = [];
  var awaitingPlayer;
  
  if (this.players.length >= 2) {
    if (this.players.length % 2) {
      awaitingPlayer = this.players[this.players.length - 1];
      this.players.splice(-1,1);    
    } 
    for(var i = 0; i < this.players.length; i += 2) {
       result.push(this.players.slice(i, i + 2));
    }
    for(var j = 0; j < result.length; j++) {
      var first = result[j][0];
      var second = result[j][1];
      this.gameSet(first, second);
    }
    console.log('winner');
    console.log(this.winners);
    if (awaitingPlayer) {
      this.winners.push(awaitingPlayer);
    }
    this.players = this.winners;
    console.log(this.players);
    if (this.players.length == 1) {
       console.log("that's all");
    }
    this.fight();
  } else {
    console.log("There is a winner! Tournament is over");
  }
}


Tournament.prototype.gameSet = function(first, second) {
  while (first.isAlive() && second.isAlive()) {
    second.attack(first);
    console.log('Хп 1 игрока: ' + first.getLife());
   
    if(first.isAlive()) {
      first.attack(second);
      console.log('Хп 2 игрока: ' + second.getLife());
    } 
  }
  if(!first.isAlive()) {
    console.log("2 won");
    this.winners.push(second);
    second.updateLife();
  } else if (!second.isAlive()) {
      console.log("1 won");
      this.winners.push(first);
      first.updateLife();
    }
    //console.log(this.winners);
}


var myTournament = new Tournament(8);

myTournament.register(monsterFactory('Willo', 'Orc'), monsterFactory('Arkon', 'Goblin'), heroFactory('Lian', 'Thief'), monsterFactory('Apex', 'Goblin'), monsterFactory('Willo', 'Vampire'), monsterFactory('Willo', 'Goblin'), monsterFactory('Talus', 'Warrior'), monsterFactory('Morbius', 'Vampire'), heroFactory('Nuklo', 'Archer'));
myTournament.fight();
//console.log(monsterFactory('Willo', 'Orc'), heroFactory('Olly', 'Thief'));