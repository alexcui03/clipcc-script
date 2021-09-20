import BlockPrototype from "./block_prototype";
import blockPrototypes from "./block_definition";

class DefinitionManager {
    private blocks: Map<string, BlockPrototype>;

    constructor() {
        this.blocks = blockPrototypes;
    }

    public add(block: BlockPrototype): void {
        this.blocks.set(block.opcode, block);
    }

    public get(opcode: string): BlockPrototype {
        return this.blocks.get(opcode);
    }
}

export default DefinitionManager;
