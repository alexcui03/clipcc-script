import CodeRule, { CodeRulePrototype, CodeRuleType } from "./code_rule";

const codeRules = new Map<CodeRuleType, CodeRule>([
    [CodeRuleType.SetProperty, {
        type: CodeRuleType.SetProperty,
        rules: new Map<string, CodeRulePrototype>([
            ['x', {
                key: 'x'
            }]
        ])
    }]
]);

export default codeRules;
