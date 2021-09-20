import Block from "./block";

class BlockSet {
    public topBlock: Block;
    public bodyBlocks: Block[] = [];

    public push(block: Block): void {
        this.bodyBlocks.push(block);
    }

    public generateCodeWithName(name: string): string {
        const code: string[] = [];
        code.push(`${name}() {`);

        for (const block of this.bodyBlocks) {
            code.push(block.generateCode());
        }

        code.push('}');
        return code.join('\n');
    }
}

export default BlockSet;
