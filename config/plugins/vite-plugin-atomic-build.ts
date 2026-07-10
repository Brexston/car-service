import type { Plugin } from 'vite';
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';

function removeExtraFiles(sourceDir: string, targetDir: string) {
	for (const entry of readdirSync(targetDir, { withFileTypes: true })) {
		const sourcePath = join(sourceDir, entry.name);
		const targetPath = join(targetDir, entry.name);

		if (!existsSync(sourcePath)) {
			rmSync(targetPath, { recursive: true, force: true });
			continue;
		}

		if (entry.isDirectory())
			removeExtraFiles(sourcePath, targetPath);
	}
}

function syncBuildOutput(sourceDir: string, targetDir: string) {
	mkdirSync(targetDir, { recursive: true });
	cpSync(sourceDir, targetDir, { recursive: true, force: true });
	removeExtraFiles(sourceDir, targetDir);
}

export function vitePluginAtomicBuild(tmpDir: string, outputDir: string): Plugin {
	let buildFailed = false;

	return {
		name: 'vite-plugin-atomic-build',
		apply: 'build',
		buildStart() {
			buildFailed = false;
		},
		buildEnd(error) {
			if (error)
				buildFailed = true;
		},
		closeBundle() {
			if (buildFailed) {
				if (existsSync(tmpDir))
					rmSync(tmpDir, { recursive: true, force: true });

				return;
			}

			if (!existsSync(tmpDir))
				return;

			syncBuildOutput(tmpDir, outputDir);
			rmSync(tmpDir, { recursive: true, force: true });
		},
	};
}
