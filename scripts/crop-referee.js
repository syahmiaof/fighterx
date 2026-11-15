const sharp = require('sharp');
const fs = require('fs');

async function processReferee() {
  const input = 'public/assets/fighterx/guidelines-referee.png';
  const output = 'public/assets/fighterx/guidelines-referee-waist-up.png';
  
  // Crop from top (y: 0 to 830) to capture waist and belt cleanly
  const cropped = await sharp(input)
    .extract({ left: 0, top: 0, width: 1012, height: 830 })
    .toBuffer();
    
  const meta = await sharp(cropped).metadata();
  const width = meta.width;
  const height = meta.height;
  
  const maskSvg = Buffer.from(`
    <svg width="${width}" height="${height}">
      <defs>
        <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#fff" stop-opacity="1" />
          <stop offset="85%" stop-color="#fff" stop-opacity="1" />
          <stop offset="100%" stop-color="#fff" stop-opacity="0" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#fade)" />
    </svg>
  `);
  
  const { data, info } = await sharp(cropped)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
    
  const maskRes = await sharp(maskSvg).raw().toBuffer({ resolveWithObject: true });
  
  for (let i = 0; i < data.length; i += 4) {
    const maskVal = maskRes.data[i];
    data[i + 3] = Math.round((data[i + 3] * maskVal) / 255);
  }
  
  await sharp(data, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4
    }
  }).png().toFile(output);
  
  console.log('Successfully saved waist-up referee with fade to:', output);
}

processReferee().catch(err => {
  console.error(err);
  process.exit(1);
});
