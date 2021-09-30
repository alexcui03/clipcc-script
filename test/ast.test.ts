import fs from 'fs';
import CodeParser from '../src/code_parser';
import Definition from '../src/definition';
import Script from '../src/script';

const code: string = fs.readFileSync(`./test/ccs/${process.argv[2]}.js`, {encoding: 'utf-8'});

const definition = new Definition();

const script = new Script(definition);
const parser = new CodeParser(script);
parser.loadFullCode(code);
console.log(script.exportXML());
console.log(script.generateCode());
