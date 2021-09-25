import XML from 'fast-xml-parser';
import Block from './block';
import { BlockType } from './block_prototype';
import BlockSet from './block_set';
import DefinitionManager from './definition_manager';
import { loadArray } from './util';
import Variable from './variable';

class Script {
    public blockSets: BlockSet[] = [];
    public variables: Variable[] = [];
    private code: string[] = [];
    private usedMemberName: Set<string>;
    private cntMemberPrefix: Map<string, number>;
    public definition: DefinitionManager;

    constructor(definition: DefinitionManager) {
        this.usedMemberName = new Set<string>();
        this.cntMemberPrefix = new Map<string, number>();
        this.definition = definition;
    }

    public clear(): void {
        this.blockSets = [];
        this.clearCode();
    }

    public clearCode(): void {
        this.code = [];
        this.usedMemberName.clear();
        this.cntMemberPrefix.clear();
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
            if (this.definition.getBlock(topBlock.opcode).type === BlockType.HEAD) {
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
        
        if (this.usedMemberName.has(name)) {
            const suffix = this.cntMemberPrefix.get(name) + 1;
            this.cntMemberPrefix.set(name, suffix + 1);
            name = name + suffix.toString();
            this.usedMemberName.add(name);
        }
        else {
            this.usedMemberName.add(name);
            this.cntMemberPrefix.set(name, 1);
        }
        
        return name;
    }

    public generateCode(): string {
        this.clearCode();

        for (const blockSet of this.blockSets) {
            const memberName = this.generateMemberName(blockSet.topBlock.opcode);
            this.code.push(blockSet.generateCodeWithName(memberName, this.definition));
        }

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
}

export default Script;
