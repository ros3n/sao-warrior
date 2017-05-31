var Environment = require('PATH_TO_ENVIRONMENT_JS');

class Player {
  constructor() {
    {{{ params }}}
    // this._shootingThreshold
    // this._healingThreshold
    // this._walkToStairsThreshold

    this._maxHealth = 20;
    this._health = 20;
    this._isHealing = false;
    this._directions = ['left', 'right', 'backward', 'forward'];
  }

  playTurn(warrior) {
    let self = this;
    let environment = this.recognizeEnvironment(warrior);
    let adjacentEnemies = this.adjacentEnemies(environment);
    let adjacentCaptives = this.adjacentCaptives(environment);
    let visibleEnemies = this.visibleEnemies(environment);
    let visibleCaptives = this.visibleCaptives(environment);

    let fightInMeeleeMode = function () {
      if (adjacentEnemies.length > 0) {
        warrior.attack(adjacentEnemies[0]);
      } else if (visibleEnemies.length > 0) {
        warrior.walk(visibleEnemies[0]);
      } else if (adjacentCaptives.length > 0) {
        warrior.rescue(adjacentCaptives[0]);
      } else if (visibleCaptives.length > 0) {
        warrior.walk(visibleCaptives[0]);
      } else {
        self.walk(warrior, environment);
      }
    }

    let fightWithBowMode = function () {
      if (adjacentEnemies.length > 0) {
        warrior.walk(self.oppositeDirection(adjacentEnemies[0]));
      } else if (visibleEnemies.length > 0) {
        warrior.shoot(visibleEnemies[0]);
      } else if (adjacentCaptives.length > 0) {
        warrior.rescue(adjacentCaptives[0]);
      } else if (visibleCaptives.length > 0) {
        warrior.walk(visibleCaptives[0]);
      } else {
        self.walk(warrior, environment);
      }
    }

    if (this.canFightInMeelee(warrior)) {
      fightInMeeleeMode();
    } else if (this.canFightWithBow(warrior)) {
      fightWithBowMode();
    } else {
      if (this.takingDamage(warrior)) {
        var cf = environment.clearFields();
        if (cf.length > 0) {
          warrior.walk(cf[0]);
        } else {
          fightInMeeleeMode();
        }
      } else {
        warrior.rest();
      }
    }

    this.updateHealth(warrior);
  }

  recognizeEnvironment(warrior) {
    let environment = new Environment(warrior);
    environment.processWarriorSenses();
    return environment;
  }

  adjacentEnemies(environment) {
    return this._directions.filter((dir) => environment.adjacentEnemies(dir));
  }

  visibleEnemies(environment) {
    return this._directions.filter((dir) => environment.visibleEnemies(dir));
  }

  adjacentCaptives(environment) {
    return this._directions.filter((dir) => environment.adjacentCaptives(dir));
  }

  visibleCaptives(environment) {
    return this._directions.filter((dir) => environment.visibleCaptives(dir));
  }

  canFightInMeelee(warrior) {
    return warrior.health() > this._shootingThreshold * this._maxHealth;
  }

  canFightWithBow(warrior) {
    return warrior.health() > this._healingThreshold * this._maxHealth;
  }

  needsHealing(warrior) {
    let threshold = this._healingThreshold * this._maxHealth;
    return !this.isHealing() && warrior.health() < threshold;
  }

  isHealing(warrior) {
    return this._isHealing;
  }

  heal(warrior) {
    warrior.rest();
    if (warrior.health() < this._maxHealth) {
      this._isHealing = true;
    } else {
      this._isHealing = false;
    }
  }

  takingDamage(warrior) {
    return warrior.health() < this._health;
  }

  updateHealth(warrior) {
    this._health = warrior.health();
  }

  walk(warrior, environment) {
    let dos = warrior.directionOfStairs();
    if (Math.random() < this._walkToStairsThreshold) {
      warrior.walk(dos)
    } else {
      let directions = this._directions.filter((dir) => dir != dos);
      let direction = directions.find((dir) => environment.obstacle(dir));
      if (direction) {
        warrior.walk(direction);
      } else {
        walk(dos);
      }
    }
  }

  oppositeDirection(dir) {
    let oppositeDirs = {
      'left': 'right',
      'right': 'left',
      'forward': 'backward',
      'backward': 'forward'
    }
    return oppositeDirs[dir];
  }
}
