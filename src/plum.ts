interface Point {
  x: number;
  y: number;
}
interface Branch {
  start: Point;
  length: number;
  theta: number;
}
const WITH = 800;
const HEIGHT = 800;
export class Plum {
  ctx: CanvasRenderingContext2D;
  frameQueue: Function[];
  depth: number;
  constructor(el: HTMLCanvasElement) {
    this.ctx = el.getContext("2d")!;
    this.depth = 0;
    this.frameQueue = [];
    this.init();
  }
  init() {
    const branch: Branch = {
      start: { x: WITH / 2, y: HEIGHT },
      length: 20,
      theta: -Math.PI / 2,
    };
    this.step(branch);
    requestAnimationFrame(() => this.startAnimation());
  }
  startAnimation() {
    //因为我们的frame 函数会动态的改变当前的this.frameQueue 所以这里进行一次浅拷贝;
    const current_frames = [...this.frameQueue];
    //执行完函数之前清空this.frameQueue 为下一次的frames 腾出空间;
    this.frameQueue = [];
    current_frames.forEach((frame) => frame());
    if (current_frames.length && this.depth < 100) {
      requestAnimationFrame(() => this.startAnimation());
      this.depth++;
    }
  }
  calcNextPoint(b: Branch) {
    const endPoint = {
      x: b.start.x + Math.cos(b.theta) * b.length,
      y: b.start.y + Math.sin(b.theta) * b.length,
    };
    return endPoint;
  }
  lineTo(s: Point, e: Point) {
    this.ctx.moveTo(s.x, s.y);
    this.ctx.lineTo(e.x, e.y);
    this.ctx.stroke();
  }
  branch(b: Branch) {
    this.lineTo(b.start, this.calcNextPoint(b));
  }
  getRandomTheta() {
    return Math.random() * 0.8;
  }
  getRandomLength() {
    return Math.random() * 10 + 5;
  }
  nextLeftBranch(b: Branch) {
    return {
      theta: b.theta - this.getRandomTheta(),
      start: this.calcNextPoint(b),
      length: this.getRandomLength(),
    };
  }
  nextRightBranch(b: Branch) {
    return {
      theta: b.theta + this.getRandomTheta(),
      start: this.calcNextPoint(b),
      length: this.getRandomLength(),
    };
  }
  step(b: Branch) {
    this.branch(b);
    if (this.depth < 4 || Math.random() < 0.5) {
      this.frameQueue.push(() => this.step(this.nextLeftBranch(b)));
    }

    if (this.depth < 4 || Math.random() < 0.5) {
      this.frameQueue.push(() => this.step(this.nextRightBranch(b)));
    }
  }
}
