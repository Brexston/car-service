import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import toIco from 'to-ico';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, '../src/public/favicons');
const svg = readFileSync(join(outDir, 'favicon.svg'));

const sizes = [
	['favicon-96x96.png', 96],
	['apple-touch-icon.png', 180],
	['web-app-manifest-192x192.png', 192],
	['web-app-manifest-512x512.png', 512],
];

for (const [name, size] of sizes) {
	await sharp(svg).resize(size, size).png().toFile(join(outDir, name));
}

const icoBuffers = await Promise.all(
	[16, 32, 48].map(size => sharp(svg).resize(size, size).png().toBuffer()),
);
writeFileSync(join(outDir, 'favicon.ico'), await toIco(icoBuffers));

console.log('Favicons generated.');
