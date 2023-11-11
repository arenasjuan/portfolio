const fs = require('fs');
const path = require('path');

const imageDirectories = ['comics', 'qr', 'concepts', 'wallpapers', 'products'];
const validExtensions = new Set(['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff']);
const imageBasePath = path.join(__dirname, 'public', 'images');
let imagePaths = {};

// Custom sort function for filenames
function sortNumerically(a, b) {
  const numA = a.match(/\d+/g) ? parseInt(a.match(/\d+/g)[0], 10) : 0;
  const numB = b.match(/\d+/g) ? parseInt(b.match(/\d+/g)[0], 10) : 0;
  return numA - numB;
}

imageDirectories.forEach(dir => {
  const dirPath = path.join(imageBasePath, dir);
  const files = fs.readdirSync(dirPath);
  imagePaths[dir] = files
    .filter(file => validExtensions.has(path.extname(file).toLowerCase()))
    .sort(sortNumerically) // Use the custom sort function
    .map(file => `/images/${dir}/${file}`);
});

fs.writeFileSync(path.join(__dirname, 'src', 'imagePaths.json'), JSON.stringify(imagePaths, null, 2));