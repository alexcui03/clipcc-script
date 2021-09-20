class Block {
    public opcode: string = '';
    public id: string = '';
    public x: number = 0;
    public y: number = 0;
    public line: number = 0;
    public fields = new Map<string, BlockField>();
    public inputs = new Map<string, BlockInput>();

    public generateCode() {
        return `${this.opcode}(${this.generateParams()})`;
    }

    public generateParams() {
        const params: string[] = [];

        for (const [name, field] of this.fields) {
            params.push(String(field.value));
        }

        for (const [name, input] of this.inputs) {
            if (input.block) {
                params.push(input.block.generateCode());
            }
            else if (input.shadow) {
                params.push(String(input.shadow.value));
            }
            else {
                params.push('null');
            }
        }

        return params.join(', ');
    }
}

class BlockShadow {
    public type: string = 'script_unknown';
    public id: string = '';
    public value: any;
}

class BlockInput {
    // public name: string = 'script_unknown';
    public shadow: BlockShadow | null = null;
    public block: Block | null = null;
}

class BlockField {
    // public name: string = 'script_unknown';
    public id: string = '';
    public value: any;
}

export default Block;
export {
    BlockShadow,
    BlockInput,
    BlockField
};
