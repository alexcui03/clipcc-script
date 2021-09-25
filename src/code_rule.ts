import Block from "./block";
import CodeParser from "./code_parser";

enum CodeRuleType {
    AssignmentProperty
}

type CodeRuleFunction<T> = (node: T, parser?: CodeParser) => Block;
type CodeRuleMap = Map<string, CodeRuleFunction<any>>;
type CodeRule = Map<CodeRuleType, CodeRuleMap>;
// type CodeFuzzyRuleItem = [RegExp, CodeRuleFunction<any>];
// type CodeFuzzyRule = Map<CodeRuleType, CodeFuzzyRuleItem[]>;

export {
    CodeRule,
    // CodeFuzzyRule,
    CodeRuleType,
    CodeRuleFunction,
    CodeRuleMap,
    // CodeFuzzyRuleItem
}
