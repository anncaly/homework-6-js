function Character(name, type, life, damage){
  this.life = life;
  this.damage = damage;
  this.maxLife = life;
  this.counter = 2;
  this.name = name;
  this.type = type;
  // allow/not allow to use opposite superpower
  this.trick = Math.random() >= 0.5;
}

Character.prototype.setLife = function(dmg) {
  this.life -= dmg;
}

Character.prototype.updateLife = function() {
  this.life = this.maxLife;
  this.counter = 2;
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
  return this.life;
}

Character.prototype.shouldUseSkill = function() {
  return (this.life < this.maxLife/2 && this.counter > 0); 
}


function Hero() {
  Character.apply(this, arguments);
}

Hero.HEROES_NAMES = ['Lian', 'Nuklo', 'Broly', 'Vivian', 'Brook', 'Seamus', 'Talus'];
Hero.HEROES_TYPE  = ['Thief', 'Warrior', 'Wizard'];

Hero.prototype = Object.create(Character.prototype);
Hero.prototype.constructor = Hero;

Hero.prototype.setLife = function(dmg) {
  if (this.shouldUseSkill()) {
    this.counter--;
    console.log("Own superpower is used by " + this.name);
  } else {
    this.life -= dmg;
  } 
}

Hero.prototype.getDamage = function() {
  if (this.shouldUseSkill() && this.trick) {
    this.counter--;
    console.log("Opposite superpower is used by " + this.name);
    return this.damage*2;
  }
  return this.damage;
}


function Monster() {
  Character.apply(this, arguments);
}

Monster.MONSTERS_GUIDE = ['Willo', 'Strix', 'Furia', 'Apex', 'Arkon', 'Morbius', 'Guatus'];
Monster.MONSTERS_TYPE  = ['Goblin', 'Orc', 'Vampire'];

Monster.prototype = Object.create(Character.prototype);
Monster.prototype.constructor = Monster;

Monster.prototype.getDamage = function() {
  if (this.shouldUseSkill()) {
    this.counter--;
    console.log("Own superpower is used by " + this.name);
    return this.damage*2;
  }
  return this.damage;
}
 
Monster.prototype.setLife = function(dmg) {
  if (this.shouldUseSkill() && this.trick) {
    this.counter--; 
    console.log("Opposite superpower is used by " + this.name);
  } else {
    this.life -= dmg;
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
          life = 0;
          damage = 0;
          break;
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
          life = 0;
          damage = 0;
          break;
  }
  return new Hero(name, type, life, damage);
}


function Tournament(amount) {
  this.amount = amount;
}

Tournament.prototype.register = function() {
  var args = Array.prototype.slice.call(arguments);
  console.log('Number of all applications for tournament: ' + args.length);
  var filtered_players = this.faceControl.apply(this, args);
  this.players = [];
  for (var i = 0; i < filtered_players.length; i++) {
    if (this.players.length < this.amount) {
      this.players.push(filtered_players[i]);
      console.log('All valid players have been registered');
    } else {
      console.log('Required amount of players has already been registered, the registration is stopped');
      break;
    }
  }  
  console.log('Number of players admitted to tournament: ' + this.players.length);
}

    
Tournament.prototype.faceControl = function() {
  var args = Array.prototype.slice.call(arguments);
  var filtered_players = [];
  for (var i = 0; i < args.length; i++) {
    if (args[i] instanceof Monster && Monster.MONSTERS_GUIDE.indexOf(args[i].name) == -1) {
       console.log(args[i].name + " is not allowed monster name");
       continue;
    }
    if (args[i] instanceof Monster && Monster.MONSTERS_TYPE.indexOf(args[i].type) == -1) {
       console.log(args[i].type + " is not allowed monster type");
       continue;
    }
    if (args[i] instanceof Hero && Hero.HEROES_NAMES.indexOf(args[i].name) == -1) {
       console.log(args[i].name + " is not allowed hero name");
       continue;
    }
    if (args[i] instanceof Hero && Hero.HEROES_TYPE.indexOf(args[i].type) == -1) {
       console.log(args[i].type + " is not allowed hero type");
       continue;
    }
    filtered_players.push(args[i]);
  }
  return filtered_players;
}

Tournament.prototype.fight = function() {
  this.winners = [];
  var awaitingPlayer;
  
  if (this.players.length >= 2) {
    console.log('-');
    console.log('Players will be splitted into pairs');
    
    this.splitPairs(this.players);
    
    for(var j = 0; j < this.result.length; j++) {
      var first = this.result[j][0];
      var second = this.result[j][1];
      this.gameSet(first, second);
    }
    
    this.players = this.winners;
    if (awaitingPlayer) {
      this.players.unshift(awaitingPlayer);
      console.log('! Player added: ' + awaitingPlayer.name);
    }
    this.fight();
  } else {
    console.log("-");
    console.log("There is a winner! " + this.players[0].name + " has made everyone!");
    console.log("Tournament is over");
  }
}

Tournament.prototype.splitPairs = function(players) { 
  this.players = players;
  this.result = [];
  
  if (this.players.length % 2) {
    awaitingPlayer = this.players[this.players.length - 1];
    if(awaitingPlayer) {
      console.log('The player is without pair and waiting for fight: ' + awaitingPlayer.name);
    }
    this.players.splice(-1,1); 
  } 

  for(var i = 0; i < this.players.length; i += 2) {
     this.result.push(this.players.slice(i, i + 2));
  }
}

Tournament.prototype.gameSet = function(first, second) {
  console.log("---");
  console.log("pair: " + first.type + ' ' + first.name + ' and ' + second.type + ' ' + second.name);
  console.log(first.name + ' hp: ' + first.life + ' damage: ' + first.damage + ' trick: ' + first.trick);
  console.log(second.name + ' hp: '  + second.life + ' damage: ' + second.damage + ' trick: ' + second.trick);
  console.log("-");
  while (first.isAlive() && second.isAlive()) {
    first.attack(second);
    console.log(first.name + ' attacks ' + second.name);
    console.log('hp 2 player ' + second.name + ' ' + second.getLife());
   
    if(second.isAlive()) {
      second.attack(first);
      console.log(second.name + ' attacks '  + first.name);
      console.log('hp 1 player ' + first.name + ' ' + first.getLife());
    } 
  }
  if(!first.isAlive()) {
    console.log(second.name + " won");
    this.winners.push(second);
    second.updateLife();
  } else if (!second.isAlive()) {
      console.log(first.name + " won");
      this.winners.push(first);
      first.updateLife();
    }
}


var myTournament = new Tournament(10);

myTournament.register(monsterFactory('Willo', 'Orc'), monsterFactory('Arkon', 'Goblin'), heroFactory('Lian', 'Thief'), monsterFactory('Apex', 'Goblin'), monsterFactory('Strix', 'Vampire'), monsterFactory('Guatus', 'Goblin'), monsterFactory('Talus', 'Warrior'), monsterFactory('Morbius', 'Vampire'), heroFactory('Nuklo', 'Archer'), heroFactory('Broly', 'Wizard'), monsterFactory('Furia', 'Orc'));
myTournament.fight();