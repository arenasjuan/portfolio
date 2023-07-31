import * as kampos from 'kampos';

export function preloadImages(srcs) {
  const promises = srcs.map(src => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve({ [src]: img });
      img.onerror = reject;
    });
  });

  return Promise.all(promises).then(images => Object.assign({}, ...images));
}



export async function startTransition(targetEl, fromImage, toImage, WIDTH, HEIGHT) {
  const turbulence = kampos.effects.turbulence({ noise: kampos.noise.perlinNoise });

  const CELL_FACTOR = 15;
  const AMPLITUDE = CELL_FACTOR / WIDTH;

  turbulence.frequency = { x: AMPLITUDE, y: AMPLITUDE };
  turbulence.octaves = 18;
  turbulence.isFractal = true;

  var mapTarget = document.createElement('canvas');
  mapTarget.width = WIDTH;
  mapTarget.height = HEIGHT;

  const dissolveMap = new kampos.Kampos({ target: mapTarget, effects: [turbulence], noSource: true });
  dissolveMap.draw();

  const dissolve = kampos.transitions.dissolve();

  dissolve.map = mapTarget;
  dissolve.high = 0.05;

  const hippo = new kampos.Kampos({ target: targetEl, effects: [dissolve] });

  hippo.setSource({ media: fromImage, width: WIDTH, height: HEIGHT });

  dissolve.to = toImage;

  let start;
  const duration = 1100;

  const transition = (timestamp) => {
    if (!start) start = timestamp;
    const elapsed = timestamp - start;
    dissolve.progress = Math.min(elapsed / duration, 1);

    hippo.draw();

    if (elapsed < duration) {
      requestAnimationFrame(transition);
    } else {
      hippo.stop();
    }
  }

  requestAnimationFrame(transition);
  const context = mapTarget.getContext('webgl');
  context.getExtension("WEBGL_lose_context").loseContext();
  mapTarget = null;
}