interface Point {
  x: number;
  y: number;
}

interface Branch {
  start: Point;
  length: number;
  theta: number;
}

export class Plum {
  private ctx: CanvasRenderingContext2D;
  private frameQueue: (() => void)[] = [];
  private depth: number = 0;
  private readonly MAX_DEPTH = 100;
  private readonly MIN_DEPTH = 5;
  constructor(private el: HTMLCanvasElement) {
    this.ctx = el.getContext("2d")!;
    this.init();
  }
  private init(): void {
    this.ctx.strokeStyle = "grey";
    const branch: Branch = {
      start: { x: this.el.width / 2, y: this.el.height },
      length: this.getRandomLength(),
      theta: -Math.PI / 2,
    };
    this.step(branch);
    this.startAnimation();
  }
  private startAnimation(): void {
    const currentFrames = [...this.frameQueue];
    this.frameQueue = [];
    currentFrames.forEach((frame) => frame());
    if (currentFrames.length && this.depth < this.MAX_DEPTH) {
      requestAnimationFrame(() => this.startAnimation());
      this.depth++;
    }
  }
  private getNextPoint(b: Branch): Point {
    return {
      x: b.start.x + Math.cos(b.theta) * b.length,
      y: b.start.y + Math.sin(b.theta) * b.length,
    };
  }
  private lineTo(s: Point, e: Point): void {
    this.ctx.beginPath();
    this.ctx.moveTo(s.x, s.y);
    this.ctx.lineTo(e.x, e.y);
    this.ctx.stroke();
  }
  private branch(b: Branch): Point {
    const endPoint = this.getNextPoint(b);
    this.lineTo(b.start, endPoint);
    return endPoint;
  }
  private getRandom(): number {
    return Math.random();
  }
  private getRandomLength(): number {
    // 5-15
    return Math.random() * 10 + 5;
  }
  private getNextLeftBranch(b: Branch, end: Point): Branch {
    return {
      theta: b.theta - this.getRandom(),
      start: end,
      length: this.getRandomLength(),
    };
  }
  private getNextRightBranch(b: Branch, end: Point): Branch {
    return {
      theta: b.theta + this.getRandom(),
      start: end,
      length: this.getRandomLength(),
    };
  }
  private checkIsRenderBranch() {
    return this.depth < this.MIN_DEPTH || this.getRandom() < 0.5;
  }
  private step(b: Branch): void {
    const endPoint = this.branch(b);
    if (this.checkIsRenderBranch()) {
      this.frameQueue.push(() =>
        this.step(this.getNextLeftBranch(b, endPoint))
      );
    }

    if (this.checkIsRenderBranch()) {
      this.frameQueue.push(() =>
        this.step(this.getNextRightBranch(b, endPoint))
      );
    }
  }
}
