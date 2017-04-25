class Player {
  constructor() {
    {{{ params }}}
    this._maxHealth = 20;
    this._health = 20;
    this._isHealing = false;
    this._directions = ['left', 'right', 'backward', 'forward'];
    this._retreatPath = [];
    this._turnedBack = false;
    this._archerKilled = false;
    console.log(this.param);
  }

  playTurn(warrior) {
    if (this.enemiesBehind(warrior)) {
      warrior.pivot();
    } else if (warrior.health() < this._maxHealth) {
      if (this.isHealing(warrior)) {
        if (this.takingDamage(warrior)) {
          this.retreat(warrior, []);
        } else {
          this.heal(warrior);
        }
      } else if (this.needsHealing(warrior)) {
        var closestEnemies = this.closestEnemies(warrior);
        if (closestEnemies.length > 0) {
          this.retreat(warrior, closestEnemies);
        } else {
          this.heal(warrior);
        }
      } else {
        this.proceedOrFight(warrior);
      }
    } else {
      this.proceedOrFight(warrior);
    }
    this.updateHealth(warrior);
  }

  proceedOrFight(warrior) {
    var closestEnemies = this.closestEnemies(warrior);
    var closestCaptives = this.closestCaptives(warrior);
    var enemiesAhead = this.enemiesAhead(warrior);
    if (closestEnemies.length > 0) {
      this.attack(warrior, closestEnemies[0]);
    } else if (closestCaptives.length > 0) {
      this.rescue(warrior, closestCaptives[0]);
    // } else if (enemiesAhead) {
    //   this.shootAhead(warrior);
    } else if (this.retreatPathPresent()) {
      var direction = this.oppositeDirection(this.popRetreatPath());
      this.walk(warrior, direction);
    } else {
      this.walkAhead(warrior);
    }
  }

  closestEnemies(warrior) {
    return this._directions.filter((dir) => warrior.feel(dir).isEnemy());
  }

  enemiesAhead(warrior) {
    var spaces = warrior.look();
    var captives = spaces.findIndex((space) => space.isCaptive());
    var enemies = spaces.findIndex((space) => space.isEnemy());
    if (captives >= 0 && captives < enemies || enemies == -1) {
      return false;
    } else {
      return true;
    }
  }

  enemiesBehind(warrior) {
    var spaces = warrior.look('backward');
    var captives = spaces.findIndex((space) => space.isCaptive());
    var enemies = spaces.findIndex((space) => space.isEnemy());
    if (captives >= 0 && captives < enemies || enemies == -1) {
      return false;
    } else {
      return true;
    }
  }

  attack(warrior, direction) {
    warrior.attack(direction);
  }

  shootAhead(warrior) {
    warrior.shoot();
  }

  closestCaptives(warrior) {
    return this._directions.filter((dir) => warrior.feel(dir).isCaptive());
  }

  rescue(warrior, direction) {
    warrior.rescue(direction);
  }

  canFightInMeelee(warrior) {
    return warrior.health() > 0.8 * this._maxHealth;
  }

  needsHealing(warrior) {
    return !this.isHealing() && warrior.health() < 0.5 * this._maxHealth;
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

  retreat(warrior, enemyPositions) {
    var moveCandidates = this._directions.filter(
      (dir) => !enemyPositions.includes(dir)
    );
    var self = this;
    var moved = false;
    moveCandidates.forEach(function (dir) {
      if (warrior.feel(dir).isEmpty() && !moved) {
        self._retreatPath.push(dir);
        self.walk(warrior, dir);
        moved = true;
      }
    });
    return moved;
  }

  retreatPathPresent() {
    return this._retreatPath.length > 0;
  }

  popRetreatPath() {
    return this._retreatPath.pop();
  }

  walk(warrior, direction) {
    warrior.walk(direction);
  }

  walkAhead(warrior) {
    if (warrior.feel('forward').isWall()) {
      warrior.pivot();
    } else {
      this.walk(warrior, warrior.directionOfStairs());
    }
  }

  updateHealth(warrior) {
    this._health = warrior.health();
  }

  oppositeDirection(dir) {
    var oppositeDirs = {
      'left': 'right',
      'right': 'left',
      'forward': 'backward',
      'backward': 'forward'
    }
    return oppositeDirs[dir];
  }
}
