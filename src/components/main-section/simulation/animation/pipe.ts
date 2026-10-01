class Pipe {
  x = 600 - 20;
  readonly w = 20;
  readonly speed = 2;
  readonly gap: number;

  constructor(gap: number) {
    this.gap = gap;
  }

  update() {
    this.x -= this.speed;
  }

  draw(ctx: CanvasRenderingContext2D, gapWidth: number) {
    ctx.fillStyle = "rgba(69, 81, 94,0.9)";
    ctx.fillRect(this.x, 0, this.w, this.gap - gapWidth);
    ctx.fillRect(this.x, this.gap + gapWidth, this.w, 600);
  }
}

export { Pipe };
