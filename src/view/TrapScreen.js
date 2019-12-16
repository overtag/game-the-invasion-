import * as PIXI from 'pixi.js';
import { eventEmitter, EVENTS } from '../events/EventEmitter';
import { config } from '../config';

export class TrapScreen extends PIXI.Container {
  constructor() {
    super();
    this.isDrag = false;
    this.currentType = -1;
    this.targetSprite = new PIXI.Sprite(
      this.createRectangle().generateCanvasTexture(),
    );
    eventEmitter.on(EVENTS.PAY_TRAP, this.startDrag, this);
    eventEmitter.on(EVENTS.CLEAN_GAME, this.cleanGame, this);

    this.rakeTexture = PIXI.Texture.fromImage(`RakeEffect_mc0000`);
    this.sheepTexture = PIXI.Texture.fromImage(`Sheep_mc0000`);
    this.targetSprite = new PIXI.Sprite(this.getTexture(config.TRAP_RAKE));
  }

  cleanGame() {
    this.isDrag = false;
    this.targetSprite.visible = false;
  }

  add(evt) {
    const trap = this.createTrap(evt.type);
    this.traps.push(trap);
    trap.init(evt.point);
    this.universe.addChild(trap);
  }

  createRectangle() {
    const graphics = new PIXI.Graphics();
    graphics.beginFill(0xeeffcc);
    graphics.drawRect(0, 0, 80, 80);
    graphics.endFill();

    return graphics;
  }

  getTexture(type) {
    switch (type) {
      case config.TRAP_RAKE:
        return this.rakeTexture;
      case config.TRAP_SHEEP:
        return this.sheepTexture;
    }
  }
  startDrag(evt) {
    if (this.isDrag) return;

    const { type } = evt;
    this.currentType = type;

    this.targetSprite.texture = this.getTexture(type);
    this.targetSprite.visible = true;
    // new PIXI.Sprite(PIXI.Texture.fromImage('Rake_mc0000'));
    this.targetSprite.anchor.set(0.5, 0.5);

    const point = this.toLocal(evt.point);
    this.targetSprite.position.set(point.x, point.y);
    this.addChild(this.targetSprite);
    console.log('startDrag');
    this.isDrag = true;

    this.targetSprite.click = this.endDrag.bind(this);
    this.targetSprite.mousemove = this.dragAndDrop.bind(this);
    this.targetSprite.mouseupoutside = this.endDrag.bind(this);
    this.targetSprite.touchmove = this.dragAndDrop.bind(this);
    this.targetSprite.touchend = this.endDrag.bind(this);
    this.targetSprite.touchcancel = this.endDrag.bind(this);
    this.targetSprite.touchendoutside = this.endDrag.bind(this);
    this.targetSprite.interactive = true;
    this.isDrag = true;
  }

  dragAndDrop(evt) {
    if (!this.isDrag) return;
    const point = this.toLocal(evt.data.global);
    //--console.log("point", point);
    this.targetSprite.x = point.x;
    this.targetSprite.y = point.y;
  }

  endDrag() {
    this.isDrag = false;
    this.targetSprite.visible = false;

    const pointY =
      this.targetSprite.y > config.defaultHeight - 150 - 80
        ? config.defaultHeight - 150 - 80
        : this.targetSprite.y;

    eventEmitter.emit(EVENTS.ADD_TRAP, {
      type: this.currentType,
      point: { x: this.targetSprite.x, y: pointY },
    });
  }

  show() {
    this.visible = true;
  }

  hide() {
    this.visible = false;
  }
}
