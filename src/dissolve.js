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



export async function startTransition(targetEl, fromImage, toImage) {
  const turbulence = kampos.effects.turbulence({ noise: kampos.noise.perlinNoise });

  let WIDTH, HEIGHT;

  if (window.innerWidth > window.innerHeight) {
    // Viewport is wider, so set the width of the image to the width of the viewport
    // and calculate the height to maintain the image's aspect ratio
    WIDTH = window.innerWidth;
    HEIGHT = window.innerWidth / 2;
  } else {
    // Viewport is taller, so set the height of the image to the height of the viewport
    // and calculate the width to maintain the image's aspect ratio
    HEIGHT = window.innerHeight;
    WIDTH = window.innerHeight * 2;
  }

  const CELL_FACTOR = 10;
  const AMPLITUDE = CELL_FACTOR / WIDTH;

  turbulence.frequency = { x: AMPLITUDE, y: AMPLITUDE };
  turbulence.octaves = 8;
  turbulence.isFractal = true;

  const mapTarget = document.createElement('canvas');
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
  const duration = 900;

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
}