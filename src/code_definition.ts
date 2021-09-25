import type = require('@babel/types');
import Block from "./block";
import CodeParser from './code_parser';
import { CodeRuleFunction, CodeRuleMap, CodeRuleType } from './code_rule';
import { generateBlockID } from './util';

const codeRules = new Map<CodeRuleType, CodeRuleMap>([
    [CodeRuleType.AssignmentProperty, new Map<string, CodeRuleFunction<type.AssignmentExpression>>([
        ['x', (node: type.AssignmentExpression, parser: CodeParser): Block => {
            const block = new Block();
            if (node.operator === '=') block.opcode = 'motion_setx';
            else if (node.operator === '+=') block.opcode = 'motion_changexby';
            else return null;
            block.id = generateBlockID();
            block.inputs.set('X', parser.parseExpressionOrLiteralToInput(
                node.right, true, 'math_number', 'NUM'
            ));
            return block;
        }],
        ['y', (node: type.AssignmentExpression, parser: CodeParser): Block => {
            const block = new Block();
            if (node.operator === '=') block.opcode = 'motion_sety';
            else if (node.operator === '+=') block.opcode = 'motion_changeyby';
            else return null;
            block.id = generateBlockID();
            block.inputs.set('Y', parser.parseExpressionOrLiteralToInput(
                node.right, true, 'math_number', 'NUM'
            ));
            return block;
        }]
    ])],
    [CodeRuleType.GetProperty, new Map<string, CodeRuleFunction<type.Expression>>([
        ['x', (node: type.Expression, parser: CodeParser): Block => {
            const block = new Block();
            block.id = generateBlockID();
            block.opcode = 'motion_xposition';
            return block;
        }],
        ['y', (node: type.Expression, parser: CodeParser): Block => {
            const block = new Block();
            block.id = generateBlockID();
            block.opcode = 'motion_yposition';
            return block;
        }],
        ['direction', (node: type.Expression, parser: CodeParser): Block => {
            const block = new Block();
            block.id = generateBlockID();
            block.opcode = 'motion_direction';
            return block;
        }]
    ])]
]);

export {
    codeRules
};
