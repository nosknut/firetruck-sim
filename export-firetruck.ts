// NOdejs file
import { spawnSync } from 'child_process';
import { copyFileSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { join } from 'path';

const modelName = 'Firetruck'
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
    .replace('staticmodelsFiretruck', 'models/Firetruck');

writeFileSync(modelPath, content);
rmSync(sveltePath);
