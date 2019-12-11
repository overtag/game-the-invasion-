import * as PIXI from 'pixi.js';
import { config } from '../../config';
import { eventEmitter, EVENTS } from '../../events/EventEmitter';
import { Amath } from '../../utils/Amath';

export class BaseTrap extends PIXI.Container {
  constructor() {
    super();

    this.sprite = new PIXI.Sprite(PIXI.Texture.fromImage('Rake_mc0000'));
    this.sprite.anchor.set(0.5, 0.5);
    this.addChild(this.sprite);
  }

  init(point) {
    this.position.set(point.x, point.y);
  }

  createRectangle() {
    const graphics = new PIXI.Graphics();
    graphics.beginFill(0xeeffcc);
    graphics.drawRect(0, 0, 80, 80);
    graphics.endFill();

    return graphics;
  }

  update(enemies) {
    enemies.forEach(enemy => {
      this.collision(enemy, this);
    });
  }

  collision(enemy) {
    if (Amath.hitTestRectangle(this, enemy)) {
      enemy.damage(1);
      this.remove();
    } else {
      // console.log('----');
    }
  }

  remove() {
    eventEmitter.emit(EVENTS.REMOVE_TRAP, { trap: this });
  }
}
