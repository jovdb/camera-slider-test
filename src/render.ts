export interface IData {
  position: number;
  angle: number;
  easing?: string;
  begin:
    | {
        position: number;
        angle: number;
      }
    | undefined;
  end:
    | {
        position: number;
        angle: number;
      }
    | undefined;
}

export function render(canvas: HTMLCanvasElement, data: IData) {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Error creating rendering context');

  ctx.reset();
  ctx.translate(0.5, 0.5);
  drawTrack(ctx, data);
}

function drawTrack(ctx: CanvasRenderingContext2D, data: IData) {
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;

  const trackWidth = w * 0.8;
  const trackHeight = trackWidth * 0.02;
  const trackX = (w - trackWidth) * 0.5;
  const trackY = h * 0.8 - trackHeight / 2;

  ctx.strokeStyle = '#444';
  ctx.fillStyle = '#888';
  ctx.fillRect(trackX, trackY, trackWidth, trackHeight);
  ctx.strokeRect(trackX, trackY, trackWidth, trackHeight);

  const cameraWidth = trackWidth * 0.9;
  const cameraLeft = (w - cameraWidth) * 0.5;
  const cameraTop = h * 0.8;

  if (data.begin) {
    drawCamera(
      ctx,
      cameraLeft + data.begin.position * cameraWidth,
      cameraTop,
      cameraWidth,
      data.begin.angle,
      'green'
    );
  }

  if (data.end) {
    drawCamera(
      ctx,
      cameraLeft + data.end.position * cameraWidth,
      cameraTop,
      cameraWidth,
      data.end.angle,
      'red'
    );
  }

  drawCamera(
    ctx,
    cameraLeft + data.position * cameraWidth,
    cameraTop,
    cameraWidth,
    data.angle
  );
}

function drawCamera(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  angle: number,
  fill = '#fff'
) {
  const size = 10;
  ctx.save();

  ctx.translate(x, y);
  ctx.rotate((angle / 180) * Math.PI);

  ctx.save();
  // Define the dash pattern: [dash length, space length]
  // For example, [5, 5] means 5 pixels drawn, 5 pixels space, repeated
  // [10, 5, 2, 5] means 10px dash, 5px space, 2px dash, 5px space, repeated
  ctx.strokeStyle = '#ddd';
  ctx.lineWidth = 2;
  ctx.setLineDash([10, 5]); // 10 pixels dash, 5 pixels space
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, -10000);
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = fill;
  ctx.strokeStyle = 'black';

  // triangle
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(-size * 0.5, -size);
  ctx.lineTo(size * 0.5, -size);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // box
  ctx.fillRect(-size * 0.5, 0, size, size);
  ctx.strokeRect(-size * 0.5, 0, size, size);
  ctx.restore();
}
