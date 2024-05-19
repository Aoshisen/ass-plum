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

  constructor(private el: HTMLCanvasElement) {
    this.ctx = el.getContext("2d")!;
    this.init();
  }

  private init(): void {
    const branch: Branch = {
      start: { x: this.el.width / 2, y: this.el.height },
      length: 20,
      theta: -Math.PI / 2,
    };
    this.step(branch);
    requestAnimationFrame(() => this.startAnimation());
  }

  private startAnimation(): void {
    const currentFrames = [...this.frameQueue];
    this.frameQueue = [];
    currentFrames.forEach((frame) => frame());
    if (currentFrames.length && this.depth < 100) {
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

  private branch(b: Branch): void {
    this.lineTo(b.start, this.getNextPoint(b));
  }

  private getRandomTheta(): number {
    return Math.random() * 0.85;
  }

  private getRandomLength(): number {
    // 5-15
    return Math.random() * 10 + 5;
  }

  private nextLeftBranch(b: Branch): Branch {
    return {
      theta: b.theta - this.getRandomTheta(),
      start: this.getNextPoint(b),
      length: this.getRandomLength(),
    };
  }

  private nextRightBranch(b: Branch): Branch {
    return {
      theta: b.theta + this.getRandomTheta(),
      start: this.getNextPoint(b),
      length: this.getRandomLength(),
    };
  }

  private step(b: Branch): void {
    this.branch(b);
    if (this.depth < 4 || Math.random() < 0.5) {
      this.frameQueue.push(() => this.step(this.nextLeftBranch(b)));
    }

    if (this.depth < 4 || Math.random() < 0.5) {
      this.frameQueue.push(() => this.step(this.nextRightBranch(b)));
    }
  }
}
