import Block from "./block";
import DefinitionManager from "./definition_manager";

class BlockSet {
    public topBlock: Block;
    public bodyBlocks: Block[] = [];

    public push(block: Block): void {
        this.bodyBlocks.push(block);
    }

    public getTopBlock(): Block | null {
        if (this.topBlock) return this.topBlock;
        else if (this.bodyBlocks.length) return this.bodyBlocks[0];
        else return null;
    }

    public generateCodeWithName(name: string, definition: DefinitionManager): string {
        const code: string[] = [];

        const topBlock = this.getTopBlock();
        if (topBlock) {
            code.push(`@position(${topBlock.x}, ${topBlock.y})`);
        }

        code.push(`${name}() {`);

        for (const block of this.bodyBlocks) {
            code.push(block.generateCode(definition));
        }

        code.push('}');
        return code.join('\n');
    }

    public exportXML(): any {
        if (this.topBlock.isTop) {
            return this.topBlock.exportXML();
        }
        else {
            return this.bodyBlocks[0].exportXML();
        }
    }
}

export default BlockSet;
