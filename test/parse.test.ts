import fs from 'fs';
import Definition from '../src/definition';
import Script from '../src/script';

const xml: string = fs.readFileSync(`./test/xml/${process.argv[2]}.xml`, {encoding: 'utf-8'});

const definition = new Definition();

const script = new Script(definition);
script.loadFromXML(xml);
console.log(script.generateCode());

console.log(script.exportXML());
