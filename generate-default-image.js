// generate-default-image.js
const { createCanvas } = require('canvas');

const width = 1200;
const height = 800;
const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');

// Fill background
ctx.fillStyle = '#f3f4f6';
ctx.fillRect(0, 0, width, height);

// Add text
ctx.fillStyle = '#6b7280';
ctx.font = '48px Arial';
ctx.textAlign = 'center';
ctx.fillText('Property Image Coming Soon', width / 2, height / 2);

// Save as JPG
const fs = require('fs');
const out = fs.createWriteStream('public/default-property.jpg');
const stream = canvas.createJPEGStream({ quality: 0.8 });
stream.pipe(out);
