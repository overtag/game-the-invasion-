import * as PIXI from 'pixi.js';
import * as filters from 'pixi-filters';
import { config } from './config.js';
import { Core } from './view/Core.js';
import { Controller } from './Controller';

export class App {
  constructor() {
    var canvas = document.getElementById('game-canvas');
    // filters
    Object.assign(PIXI.filters, filters);
    // sound
    document.body.style.transform = 'rotate(0deg)';

    this.isPixiLoad = false;
    this.isSoundLoad = false;

    PIXI.Graphics.CURVES.adaptive = true;
    config.isMobile = !!window.navigator.userAgent.match(
      /iPhone|Android|BlackBerry/i,
    );
    this.defaultWidth = config.defaultWidth;
    this.defaultHeight = config.defaultHeight;
    this.canvas = canvas;
    this.canvas.width = this.defaultWidth;
    this.canvas.height = this.defaultHeight;
    window.canvas = this.canvas;
    PIXI.loader
      .add('../assets/lobby.json')
      .add('../assets/button.png')
      .add('../assets/trab_back.png')
      .add('../assets/zombie.json')
      .add('../assets/ZJester.json')
      .add('../assets/rake.json')
      .add('../assets/rake_effect.json')
      .load(this.init.bind(this));
  }

  init() {
    const stage = new PIXI.Container();
    const renderer = PIXI.autoDetectRenderer(
      this.canvas.width,
      this.canvas.height,
      {
        view: this.canvas,
        transparent: true,
        antialias: true,
        autoResize: true,
      },
    );

    this.app = { stage, renderer, view: this.canvas };
    config.app = { stage, renderer, view: this.canvas };
    requestAnimationFrame(this.update.bind(this));

    this.viewWidth = 1;
    this.viewHeight = 1;

    if (!this.core) this.core = new Core();
    if (!this.controller) this.controller = new Controller();

    this.core.visible = true;
    this.app.stage.addChild(this.core);

    this.controller.init();

    this.resize();
  }

  update() {
    this.app.renderer.render(this.app.stage);
    requestAnimationFrame(this.update.bind(this));
  }

  onResize() {
    let width = window.innerWidth; // document.getElementById('visualization').clientWidth;
    let height = window.innerHeight;

    const canvas = this.app.view;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    canvas.width = width;
    canvas.height = height;

    this.app.renderer.resize(width, height);
    // this.defaultWidth = config.internalWidth;
    // this.defaultHeight = config.internalHeight;
  }

  resize() {
    this.onResize();
    const sW = ((this.app.view.width / this.defaultWidth) * 10) / 10;
    const sH = ((this.app.view.height / this.defaultHeight) * 10) / 10;
    let koef = sW < sH ? sW : sH;

    this.core.scale.set(koef);
    this.core.position.set(
      this.app.view.width / 2 - this.core.width / 2,
      this.app.view.height / 2 - this.core.height / 2,
    );
  }
}

new App();
