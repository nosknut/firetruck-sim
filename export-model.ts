// NOdejs file
import { spawnSync } from 'child_process';
import { copyFileSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { join } from 'path';

function exportModel(modelName: string) {
    const fileName = modelName + '.gltf'
    const svelteFileName = modelName + '.svelte'

    const blenderPath = join('.', 'Blender', modelName, fileName)
    const staticPath = join('.', 'static', 'models', fileName)
    const sveltePath = join('.', svelteFileName)
    const modelPath = join('.', 'src', 'lib', 'components', 'models', svelteFileName)

    copyFileSync(blenderPath, staticPath);

    const result = spawnSync('npx', ['@threlte/gltf', staticPath, '-t', '-u', '-m'], { stdio: 'inherit', shell: true });

    if (result.error) throw result.error;
    if (result.stderr) throw result.stderr;

    const content = readFileSync(sveltePath)
        .toString()
        .replace('staticmodels' + modelName, 'models/' + modelName);

    writeFileSync(modelPath, content);
    rmSync(sveltePath);
}

// Provide the model name as the first argument
const modelArg = process.argv[2];

if (!modelArg) throw new Error('No model name provided');

exportModel(modelArg);
