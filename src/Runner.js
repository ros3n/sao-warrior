import fs from 'fs-extra';
import Mustache from 'mustache'
import playLevel from 'warriorjs-engine';

export default class Runner {
  _args;

  constructor(args) {
    this._args = args;
    this._towerPath = '../towers/beginner/level001.json'
    this._params = 'this.param = 42;'
  }

  run() {
    template = this.loadPlayerTemplate();
    tower = this.loadTower(path);
    player = renderPlayerParams(template);
    { passed, events, score } = playLevel(augmentedLevelConfig, playerCode);
    console.log(score);
  }

  loadPlayerTemplate() {
    return fs.readFile('PlayerTemplate.js'), 'utf8');
  }

  loadTower(path) {
    return fs.readFile(path), 'utf8');
  }

  renderPlayerParams(playerTemplate) {
    return Mustache.render(playerTemplate, { params: this._params });
  }
}
