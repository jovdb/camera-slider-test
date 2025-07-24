import { trackSelf } from 'solid-js/store/types/store';
import { IData } from './src/render';

function easeInOutQuad(pos: number) {
  if ((pos /= 0.5) < 1) return 0.5 * Math.pow(pos, 2);
  return -0.5 * ((pos -= 2) * pos - 2);
}

function easeInOutCubic(pos: number) {
  if ((pos /= 0.5) < 1) return 0.5 * Math.pow(pos, 3);
  return 0.5 * (Math.pow(pos - 2, 3) + 2);
}

function easeInOutSine(pos: number) {
  return -0.5 * (Math.cos(Math.PI * pos) - 1);
}

function calcInterpolate(data: IData, t: number) {
  if (!data.begin || !data.end) return;
  const angle = data.begin?.angle + (data.end?.angle - data.begin?.angle) * t;
  const position =
    data.begin?.position + (data.end?.position - data.begin?.position) * t;

  return {
    position,
    angle,
  };
}

function calc(data: IData, t: number) {
  if (!data.begin || !data.end) return;

  const angle = data.begin?.angle + (data.end?.angle - data.begin?.angle) * t;

  // If not pointed to a single point --> interpolate
  if (Math.abs(data.begin.angle - data.end.angle) < 1) {
    const position =
      data.begin?.position + (data.end?.position - data.begin?.position) * t;
    return {
      position,
      angle,
    };
  }

  // Calculate slopes for non-vertical lines
  const a = (angle / 180) * Math.PI;
  const a1 = (data.begin.angle / 180) * Math.PI;
  const a2 = (data.end.angle / 180) * Math.PI;
  const p1 = data.begin.position;
  const p2 = data.end.position;

  // Get Slope
  const m1 = Math.tan(a1);
  const m2 = Math.tan(a2);

  // Calculate intersection point for the general case
  // Formula derived from setting
  // y = m1*x + p1
  // y = m2*x + p2
  // m1*x + p1 = m2*x + p2
  // x = (p2 - p1) / (m1 - m2)
  const intersectionX = (p2 - p1) / (m1 - m2);
  const intersectionPosition = m1 * intersectionX + p1; // Use line 1 equation to find y

  return {
    position: intersectionPosition - intersectionX * Math.tan(a),
    angle,
  };
}

export function run(
  duration: number,
  data: IData,
  update: (position: number, angle: number) => void,
  onEnd: () => void,
  stop?: () => boolean,
  startTime = Date.now()
) {
  let t = Math.min((Date.now() - startTime) / duration, 1);
  if (data.easing === 'ease-in-out-quad') {
    t = easeInOutQuad(t);
  } else if (data.easing === 'ease-in-out-cubic') {
    t = easeInOutCubic(t);
  } else if (data.easing === 'ease-in-out-sine') {
    t = easeInOutSine(t);
  }

  if (t >= 1 || stop?.()) {
    onEnd();
    return;
  }

  const newData = calc(data, t);
  // const newData = calcInterpolate(data, t);
  if (!newData) {
    onEnd();
    return;
  }

  const { position, angle } = newData;
  update(position, angle);

  requestAnimationFrame(() => {
    run(duration, data, update, onEnd, stop, startTime);
  });
}
