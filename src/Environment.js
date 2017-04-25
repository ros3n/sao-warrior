class Environment {
  constructor (warrior) {
    this._warrior = warrior;
    this._enemies = {
      adjacent: {},
      visible: {},
    };
    this._captives = {
      adjacent: {},
      visible: {},
    };
    this._obstacles = {};
    this._directionOfStairs = {};
    this._directions = ['forward', 'backward', 'right', 'left'];
  }

  processWarriorSenses() {
    this._directions.forEach(function (direction) {
      spaces = this._warrior.look(direction);
      adjacentSpace = this._warrior.feel(direction);
      this.findEnemies(direction, spaces);
      this.findCaptives(direction, spaces);
      this.findObsctacle(direction, adjacentSpace);
    });
    this.findDirectionOfStairs();
  }

  findDirectionOfStairs() {
    this._directionOfStairs[this._warrior.directionOfStairs()] = true;
  }

  findEnemies(direction, spaces) {
    spaces = spaces.filter((space) => space.isEnemy());
    adjacentEnemy = spaces.filter(
      (space) => this._warrior.distanceOf(space) == 1
    ).length > 0;
    visibleEnemies = spaces.filter(
      (space) => this._warrior.distanceOf(space) > 1
    ).length > 0;
    if (adjacentEnemy) {
      this.addAdjacentEnemy(direction);
    }
    if (visibleEnemies) {
      this.addVisibleEnemies(direction);
    }
  }

  findCaptives(direction, spaces) {
    spaces = spaces.filter((space) => space.isCaptive());
    adjacentCaptive = spaces.filter(
      (space) => this._warrior.distanceOf(space) == 1
    ).length > 0;
    visibleCaptives = spaces.filter(
      (space) => this._warrior.distanceOf(space) > 1
    ).length > 0;
    if (adjacentCaptive) {
      this.addAdjacentCaptive(direction);
    }
    if (visibleCaptives) {
      this.addVisibleCaptives(direction);
    }
  }

  findObsctacle(direction, space) {
    if (!space.isEmpty()) {
      this.addObscatle(direction);
    }
  }

  addAdjacentEnemy(direction) {
    this._enemies['adjacent'][direction] = true;
  }

  addVisibleEnemies(direction) {
    this._enemies['visible'][direction] = true;
  }

  addAdjacentCaptive(direction) {
    this._captives['adjacent'][direction] = true;
  }

  addVisibleCaptive(direction) {
    this._captives['visible'][direction] = true;
  }

  addObscatle(direction) {
    this._obstacles[direction] = true;
  }
}
