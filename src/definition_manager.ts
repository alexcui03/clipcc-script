import BlockPrototype from "./block_prototype";
import blockPrototypes from "./block_definition";
import { CodeRule, CodeRuleFunction, CodeRuleType } from "./code_rule";
import { codeRules } from "./code_definition";

class DefinitionManager {
    private blocks: Map<string, BlockPrototype>;
    private codeRule: CodeRule;

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

    public getCodeRule<T = any>(type: CodeRuleType, key: string): CodeRuleFunction<T> {
        return this.codeRule.get(type).get(key);
    }

    /*
    public *walkFuzzyCodeRule<T = any>(type: CodeRuleType, key: string): Generator<CodeRuleFunction<T>> {
        for (const rule of this.codeFuzzyRule.get(type)) {
            if (rule[0].test(key)) {
                yield rule[1];
            }
        }
    }
    */
}

export default DefinitionManager;
