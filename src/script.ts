import XML from 'fast-xml-parser';
import Block, { BlockField, BlockInput, BlockShadow } from './block';
import BlockSet from './blockset';

function loadArray(obj: any) {
    if (obj === undefined || obj === null) return [];
    return Array.isArray(obj) ? obj : [obj];
}

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

    private parseBlockFromXML(xml: any): Block {
        const block = new Block();

        block.opcode = xml['@_type'];
        block.id = xml['@_id'];

        // parse fields
        const fields = loadArray(xml.field);
        for (const fieldXML of fields) {
            const field = new BlockField();
            field.id = fieldXML['@_id'];
            field.value = fieldXML['#text'];
            block.fields.set(fieldXML['@_name'], field);
        }

        // parse inputs
        const inputs = loadArray(xml.value);
        for (const inputXML of inputs) {
            const input = new BlockInput();

            if (inputXML.shadow) {
                input.shadow = new BlockShadow();
                input.shadow.id = inputXML.shadow['@_id'];
                input.shadow.type = inputXML.shadow['@_type'];
                input.shadow.value = inputXML.shadow.field['#text'];
            }

            if (inputXML.block) {
                input.block = this.parseBlockFromXML(inputXML.block);
            }

            block.inputs.set(inputXML['@_name'], input);
        }

        return block;
    }

    public loadFromXML(xmlString: string): void {
        const xml = XML.parse(xmlString, { ignoreAttributes: false });

        this.clear();

        // load variables
        // @todo: load var

        // load blocks
        let blocks = loadArray(xml.xml.block);
        for (let block of blocks) {
            const blockSet = new BlockSet();

            const topBlock = new Block();
            topBlock.opcode = block['@_type'];
            topBlock.id = block['@_id'];
            topBlock.x = block['@_x'] || 0;
            topBlock.y = block['@_y'] || 0;
            if (topBlock.opcode === 'event_whenflagclicked') {
                blockSet.topBlock = topBlock;
            }
            else {
                blockSet.topBlock = new Block();
                blockSet.topBlock.x = topBlock.x;
                blockSet.topBlock.y = topBlock.y;
                blockSet.push(topBlock);
            }

            while (block.next) {
                block = block.next.block;
                blockSet.push(this.parseBlockFromXML(block));
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

    public generateCode(): string {
        this.clearCode();

        for (const blockSet of this.blockSets) {
            const memberName = this.generateMemberName(blockSet.topBlock.opcode);
            this.code.push(blockSet.generateCodeWithName(memberName));
        }

        return this.code.join('\n');
    }
}

export default Script;
