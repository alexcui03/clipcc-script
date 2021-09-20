import fs from "fs";
import acorn = require('acorn');

const js: string = fs.readFileSync(`./test/ccs/${process.argv[2]}.js`, {encoding: 'utf-8'});

const option: acorn.Options = {
    ecmaVersion: 2020,
    sourceType: 'module'
};

console.log(acorn.parse(js, option));
