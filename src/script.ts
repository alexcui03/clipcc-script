import XML from 'fast-xml-parser';
import Block from './block';
import { BlockType } from './block_prototype';
import BlockSet from './block_set';
import Definition from './definition';
import { loadArray } from './util';
import Variable from './variable';
import NameGenerator from './name_generator';

class Script {
    public blockSets: BlockSet[] = [];
    public variables: Variable[] = [];
    private code: string[] = [];
    private memberName = new NameGenerator();
    public definition: Definition;

    constructor(definition: Definition) {
        this.definition = definition;
    }

    public clear(): void {
        this.blockSets = [];
        this.variables = [];
        this.clearCode();
    }

    public clearCode(): void {
        this.code = [];
        this.memberName.clear();
    }
    
    public cntBlockSet(): number {
        return this.blockSets.length;
    }

    public loadFromXML(xmlString: string): void {
        const xml = XML.parse(xmlString, { ignoreAttributes: false });

        this.clear();

        // load variables
        if (xml.xml.variables && xml.xml.variables.variable) {
            const variables = loadArray(xml.xml.variables.variable);
            for (const varXML of variables) {
                const variable = new Variable();
                variable.loadFromXML(varXML);
                variable.identifier = this.memberName.checkIdentifier(variable.name);
                this.variables.push(variable);
            }
        }

        // load blocks
        const blocks = loadArray(xml.xml.block);
        for (let blockXML of blocks) {
            const blockSet = new BlockSet();

            const topBlock = new Block();
            topBlock.loadFromXML(blockXML);
            topBlock.isTop = true;

            const def = this.definition.getBlock(topBlock.opcode);
            if (def && def.type === BlockType.HEAD) {
                blockSet.topBlock = topBlock;
            }
            else {
                blockSet.topBlock = new Block();
                blockSet.topBlock.x = topBlock.x;
                blockSet.topBlock.y = topBlock.y;
                blockSet.push(topBlock);
            }

            let last: Block = blockSet.topBlock;
            while (blockXML.next) {
                blockXML = blockXML.next.block;
                const block = new Block();
                block.loadFromXML(blockXML);
                if (last) last.next = block;
                last = block;
                blockSet.push(block);
            }

            this.blockSets.push(blockSet);
        }
    }

    private generateMemberName(opcode: string): string {
        let name = 'anonymousBlockSet';

        const def = this.definition.getBlock(opcode);
        if (def && def.type === BlockType.HEAD) {
            name = def.memberName;
        }
        
        return this.memberName.checkIdentifier(name);
    }

    public generateCode(): string {
        this.clearCode();

        this.code.push('class CustomSprite extends Sprite {');

        for (const variable of this.variables) {
            this.code.push(variable.generateCode());
        }

        for (const blockSet of this.blockSets) {
            const memberName = this.generateMemberName(blockSet.topBlock.opcode);
            this.code.push(blockSet.generateCodeWithName(memberName, this));
        }
        
        this.code.push('}\n');

        return this.code.join('\n');
    }

    public exportXML(): string {
        const xml: any = {
            '@_xmlns': 'http://www.w3.org/1999/xhtml',
            block: []
        };

        if (this.variables.length) {
            xml.variables = {
                variable: []
            };
            for (const variable of this.variables) {
                xml.variables.variable.push(variable.exportXML());
            }
        }

        for (const blockSet of this.blockSets) {
            xml.block.push(blockSet.exportXML());
        }

        const parser = new XML.j2xParser({ ignoreAttributes: false });
        
        return parser.parse({ xml: xml });
    }

    public loadFromCode(code: string): void {
        this.clear();
    }

    public findVariableByIdentifier(identifier: string): Variable {
        for (const variable of this.variables) {
            if (variable.identifier === identifier) {
                return variable;
            }
        }
        return null;
    }

    public findVariableByName(name: string): Variable {
        for (const variable of this.variables) {
            if (variable.name === name) {
                return variable;
            }
        }
        return null;
    }
}

export default Script;
