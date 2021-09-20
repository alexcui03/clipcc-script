import fs from 'fs';
import DefinitionManager from '../src/definition_manager';
import Script from '../src/script';

const xml: string = fs.readFileSync(`./test/xml/${process.argv[2]}.xml`, {encoding: 'utf-8'});

const definition = new DefinitionManager();

const script = new Script();
script.loadFromXML(xml);
console.log(script.generateCode(definition));

console.log(script.exportXML());
