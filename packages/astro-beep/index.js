import { platform } from 'node:os';
import { readFileSync } from 'node:fs';
import { performance } from 'node:perf_hooks';
import { exec } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

import notifier from 'node-notifier';
import escalade from 'escalade';

function getTimeStat(timeStart, timeEnd) {
	const buildTime = timeEnd - timeStart;
	return buildTime < 750 ? `${Math.round(buildTime)}ms` : `${(buildTime / 1e3).toFixed(2)}s`;
}

function asset(name) {
	return fileURLToPath(new URL(`./lib/${name}`, import.meta.url));
}

const assets = {
	normal: {
		successSound: asset('success.aiff'),
		errorSound: asset('error.aiff'),
		successLogo: asset('astro.png'),
		errorLogo: asset('astro.png'),
	},
	blastoff: {
		successSound: asset('success-blastoff.aiff'),
		errorSound: asset('error-blastoff.aiff'),
		successLogo: asset('astro.png'),
		errorLogo: asset('astro.png'),
	},
};

export { assets as assets };

export default function beep(options) {
	const mode = options?.mode || 'normal';
	const isWin = platform() === 'win32';

	return {
		name: 'astro-beep',
		hooks: {
			'astro:build:start': async () => {
				const start = performance.now();
				const root = pathToFileURL(
					await escalade(process.cwd(), (dir, names) => {
						if (names.includes('package.json')) {
							return 'package.json';
						}
					})
				);
				const pkg = new URL('./package.json', root);
				const { name } = JSON.parse(readFileSync(pkg, 'utf-8'));
				process.on('exit', (code) => {
					const time = getTimeStat(start, performance.now() + 10);
					if (code !== 0) {
						if (!isWin) exec(`afplay ${assets[mode].errorSound}`);
						notifier.notify({
							title: `Astro: ${name}`,
							message: `❌ Build failed in ${time}`,
							icon: assets[mode].errorLogo,
						});
					} else {
						if (!isWin) exec(`afplay ${assets[mode].successSound}`);
						notifier.notify({
							title: `Astro: ${name}`,
							message: `✅ Build completed in ${time}`,
							icon: assets[mode].successLogo,
						});
					}
				});
			},
		},
	};
}
