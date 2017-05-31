import fs from 'fs-extra';
import Mustache from 'mustache'
import playLevel from 'warriorjs-engine';

export default class Runner {
  _args;

  constructor(args) {
    this._args = args;
    this._towerPath = args[2];
    this._params = 'this._shootingThreshold = ' + args[3] +
                    ';\n this._healingThreshold = ' + args[4] +
                    ';\n this._walkToStairsThreshold = ' + args[5] + ';\n';
  }

  run() {
    var template = this.loadPlayerTemplate();
    var tower = this.loadTower(this._towerPath);
    var player = this.renderPlayerParams(template);
    var config = this.addAbilitiesToConfig(tower);
    const { passed, events, score } = playLevel(config, player);
    var result = 0;
    if (passed) {
      for (var key in score) {
        result += score[key];
      }
    }
    process.stdout.write(result + '\n');
  }

  loadPlayerTemplate() {
    return fs.readFileSync('./src/PlayerTemplate.js', 'utf8');
  }

  loadTower(path) {
    return JSON.parse(fs.readFileSync(path, 'utf8'));
  }

  renderPlayerParams(playerTemplate) {
    return Mustache.render(playerTemplate, { params: this._params });
  }

  addAbilitiesToConfig(config) {
    config["floor"]["warrior"]["abilities"] = this.playerAbilities();
    return config;
  }

  playerAbilities() {
    return [
      {
        "name": "walk",
        "args": []
      },
      {
          "name": "attack",
          "args": []
      },
      {
          "name": "feel",
          "args": []
      },
      {
          "name": "health",
          "args": []
      },
      {
          "name": "rest",
          "args": []
      },
      {
          "name": "rescue",
          "args": []
      },
      {
          "name": "pivot",
          "args": []
      },
      {
          "name": "look",
          "args": []
      },
      {
          "name": "shoot",
          "args": []
      },
      {
          "name": "directionOfStairs",
          "args": []
      },
      {
          "name": "distanceOf",
          "args": []
      }
    ]
  }
}
