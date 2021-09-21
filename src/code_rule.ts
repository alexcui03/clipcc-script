import Block from "./block";

enum CodeRuleType {
    SetProperty
}

interface CodeRulePrototype {
    key: string;
    toBlock?: () => (Block | Block[]);
}

interface CodeRule {
    type: CodeRuleType;
    rules: Map<string, CodeRulePrototype>;
}

export default CodeRule;
export {
    CodeRulePrototype,
    CodeRuleType
}
