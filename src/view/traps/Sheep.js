import { BaseTrap } from './BaseTrap';
import { types, getTexture } from './types';
import { config } from '../../config';

const RIGHT = -1;
const LEFT = 1;

export class Sheep extends BaseTrap {
  constructor(universe) {
    super();

    this.speed = 1;
    this.orientation = LEFT;
    this.type = types.sheep;

    this.initSprite();
    this.initEffect();
  }

  initSprite() {
    const texture = getTexture(this.type);
    this.sprite = new PIXI.extras.AnimatedSprite(getTexture(this.type));
    this.sprite.anchor.set(0.5, 0.5);
    this.sprite.position.set(-100, 50);
    this.sprite.scale.set(2, 2);
    this.sprite.loop = true;
    this.sprite.animationSpeed = 1;
    this.addChild(this.sprite);
  }

  init(point) {
    super.init(point);

    if (point.x < config.defaultWidth * 0.5) {
      this.orientation = LEFT;

      this.sprite.scale.x = -2;
      this.position.x = 1 + this.width * 1.5;
    } else {
      this.sprite.scale.x = 2;
      this.orientation = RIGHT;
      this.position.x = config.defaultWidth + this.width * 0.5;
    }

    this.sprite.gotoAndPlay(0);
  }

  walkedAway() {
    if (this.orientation === LEFT && this.position.x > config.defaultWidth) {
      this.remove();
    } else if (this.orientation === RIGHT && this.position.x < 0) {
      this.remove();
    }
  }

  update(enemies) {
    this.x += this.speed * this.orientation;
    this.walkedAway();
    super.update(enemies);
  }
}
