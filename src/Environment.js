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
    this._clearFields = ['forward', 'backward', 'right', 'left'];
  }

  processWarriorSenses() {
    var self = this;
    self._directions.forEach(function (direction) {
      var spaces = self._warrior.look(direction);
      var adjacentSpace = self._warrior.feel(direction);
      self.findEnemies(direction, spaces);
      self.findCaptives(direction, spaces);
      self.findObsctacle(direction, adjacentSpace);
    });
    self.findDirectionOfStairs();
  }

  findDirectionOfStairs() {
    var self = this;
    self._directionOfStairs[self._warrior.directionOfStairs()] = true;
  }

  findEnemies(direction, spaces) {
    var self = this;
    var spaces = spaces.filter((space) => space.isEnemy());
    var adjacentEnemy = spaces.filter(
      (space) => self._warrior.distanceOf(space) == 1
    ).length > 0;
    var visibleEnemies = spaces.filter(
      (space) => self._warrior.distanceOf(space) > 1
    ).length > 0;
    if (adjacentEnemy) {
      self.addAdjacentEnemy(direction);
    }
    if (visibleEnemies) {
      self.addVisibleEnemies(direction);
    }
  }

  findCaptives(direction, spaces) {
    var self = this;
    var spaces = spaces.filter((space) => space.isCaptive());
    var adjacentCaptive = spaces.filter(
      (space) => self._warrior.distanceOf(space) == 1
    ).length > 0;
    var visibleCaptives = spaces.filter(
      (space) => self._warrior.distanceOf(space) > 1
    ).length > 0;
    if (adjacentCaptive) {
      self.addAdjacentCaptive(direction);
    }
    if (visibleCaptives) {
      self.addVisibleCaptives(direction);
    }
  }

  findObsctacle(direction, space) {
    if (!space.isEmpty()) {
      this.addObscatle(direction);
    }
  }

  addAdjacentEnemy(direction) {
    this._enemies['adjacent'][direction] = true;
    this.removeClearField(direction);
  }

  addVisibleEnemies(direction) {
    this._enemies['visible'][direction] = true;
  }

  addAdjacentCaptive(direction) {
    this._captives['adjacent'][direction] = true;
    this.removeClearField(direction);
  }

  addVisibleCaptives(direction) {
    this._captives['visible'][direction] = true;
  }

  addObscatle(direction) {
    this._obstacles[direction] = true;
    this.removeClearField(direction);
  }

  adjacentEnemies(direction) {
    return this._enemies['adjacent'][direction] || false;
  }

  visibleEnemies(direction) {
    return this._enemies['visible'][direction] || false;
  }

  adjacentCaptives(direction) {
    return this._captives['adjacent'][direction] || false;
  }

  visibleCaptives(direction) {
    return this._captives['visible'][direction] || false;
  }

  obstacle(direction) {
    return this._obstacles[direction] || this._enemies['adjacent'][direction] || this._captives['adjacent'][direction] || false;
  }

  removeClearField(direction) {
    var index = this._clearFields.indexOf(direction);
    if (index > -1) {
       this._clearFields.splice(index, 1);
    }
  }

  clearFields() {
    return this._clearFields;
  }
}

module.exports = Environment;
