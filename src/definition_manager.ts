import BlockPrototype from "./block_prototype";
import blockPrototypes from "./block_definition";
import CodeRule, { CodeRuleType } from "./code_rule";
import codeRules from "./code_definition";

class DefinitionManager {
    private blocks: Map<string, BlockPrototype>;
    private codeRule: Map<CodeRuleType, CodeRule>;

    constructor() {
        this.blocks = blockPrototypes;
        this.codeRule = codeRules;
    }

    public addBlock(block: BlockPrototype): void {
        this.blocks.set(block.opcode, block);
    }

    public getBlock(opcode: string): BlockPrototype {
        return this.blocks.get(opcode);
    }

    public addCodeRule(codeRule: CodeRule): void {
        this.codeRule.set(codeRule.type, codeRule);
    }

    public getCodeRule(type: CodeRuleType): CodeRule {
        return this.codeRule.get(type);
    }
}

export default DefinitionManager;
