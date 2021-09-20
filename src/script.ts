import XML from 'fast-xml-parser';
import Block, { BlockField, BlockInput, BlockShadow } from './block';
import BlockSet from './block_set';
import DefinitionManager from './definition_manager';
import { loadArray } from './util';

class Script {
    private blockSets: BlockSet[] = [];
    private code: string[] = [];
    private usedMemberName: Set<string>;
    private cntMemberPrefix: Map<string, number>;

    constructor() {
        this.usedMemberName = new Set<string>();
        this.cntMemberPrefix = new Map<string, number>();
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
        // @todo: load var

        // load blocks
        let blocks = loadArray(xml.xml.block);
        for (let blockXML of blocks) {
            const blockSet = new BlockSet();

            const topBlock = new Block();
            topBlock.loadFromXML(blockXML);
            if (topBlock.opcode === 'event_whenflagclicked') {
                blockSet.topBlock = topBlock;
            }
            else {
                blockSet.topBlock = new Block();
                blockSet.topBlock.x = topBlock.x;
                blockSet.topBlock.y = topBlock.y;
                blockSet.push(topBlock);
            }

            while (blockXML.next) {
                blockXML = blockXML.next.block;
                const block = new Block();
                block.loadFromXML(blockXML);
                blockSet.push(block);
            }

            this.blockSets.push(blockSet);
        }
    }

    private generateMemberName(opcode: string): string {
        let name = 'unnamedBlocks';
        if (opcode === 'event_whenflagclicked') name = 'whenGreenFlag';
        
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

    public generateCode(definition: DefinitionManager): string {
        this.clearCode();

        for (const blockSet of this.blockSets) {
            const memberName = this.generateMemberName(blockSet.topBlock.opcode);
            this.code.push(blockSet.generateCodeWithName(memberName, definition));
        }

        return this.code.join('\n');
    }
}

export default Script;
