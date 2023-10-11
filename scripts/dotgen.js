const p5 = require('node-p5');
const commander = require('commander');

function sketch(p) {
  p.setup = () => {
    let canvas = p.createCanvas(800, 400);

    setTimeout(() => {
      p.saveCanvas(canvas, 'canvas', 'png').then((filename) => {
        console.log(`saved the canvas as ${filename}`);
      });
    }, 100);
  };
  p.draw = () => {
    p.noLoop();

    const bgColors = [p.color('#ffffff'), p.color('#000000')];
    let niceColors = [
      p.color('#ffffff'),
      p.color('#3c7b5f'),
      p.color('#8ab09f'),
      p.color('#000000'),
      p.color('#7f7f7f'),
      p.color('#476399'),
      p.color('#91a1c2'),
      p.color('#d0a000'),
      p.color('#e3c666'),
      p.color('#c34f2a'),
      p.color('#e2957f'),
    ];

    let palette = [p.random(bgColors)];

    while (palette.length < 3) {
      let colorSelection = p.random(niceColors);
      if (
        !palette
          .map((c) => JSON.stringify(c.levels))
          .includes(JSON.stringify(colorSelection.levels))
      ) {
        palette.push(colorSelection);
      }
      niceColors.splice(niceColors.indexOf(colorSelection), 1);
    }
    p.background(palette[0]);
    let radius = 16;
    let spacing = radius / 2;

    p.noStroke();
    p.rectMode(p.CENTER);

    for (let i = radius - radius / 4; i < p.height + radius; i += radius + spacing) {
      for (let j = radius - radius / 4; j < p.width + radius; j += radius + spacing) {
        circleColor = p.noise(j / 10, i / 10) > 0.5 ? palette[1] : palette[2];
        p.fill(circleColor);
        p.random() > 0.8 ? p.square(j, i, radius) : p.circle(j, i, radius);
      }
    }

    p.rectMode(p.CORNER);

    p.fill('#ffffffdd');

    let textRect = [50, p.height - 50 - p.height / 3.5 + 8, p.width / 1.4, p.height / 3.5];
    p.rect(...textRect, 10);

    p.fill('#000000dd');
    p.textSize(42);
    p.textAlign(p.LEFT, p.CENTER);
    p.textFont(inter);
    textRect[0] += 10;
    textRect[2] -= 10;
    p.text(options.title, ...textRect);
  };
}

commander.option('-t, --title <value>', 'Title to put on card');

commander.parse();
const options = commander.opts();

let inter = p5.loadFont('Inter-SemiBold.otf');
p5.createSketch(sketch);
