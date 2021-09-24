import acorn = require('acorn');
import Script from './script';
import estree from 'estree';
import Block, { BlockInput, BlockShadow, BlockStatement } from './block';
import { generateBlockID } from './util';
import BlockSet from './block_set';

// @todo: cross-line optimization
enum CodeStatementType {
    AssignmentToMember,
    BinaryOperatorExpression,
    MemberList
}

class CodeStatement {
    public type: CodeStatementType;
    public data: (CodeStatement | string | number | boolean)[];
}

class CodeParser {
    public option: acorn.Options;
    public script: Script;

    constructor(script: Script) {
        this.option = {
            ecmaVersion: 2020,
            sourceType: 'module'
        };
        this.script = script;
    }

    public loadFullCode(code: string): void {
        const ast = acorn.parse(code, this.option);
        
        this.script.clear();

        const program = <estree.Program><unknown>ast;
        for (const node of program.body) {
            switch (node.type) {
                case 'ImportDeclaration': {
                    this.parseImportDeclaration(node);
                    break;
                }
                case 'ClassDeclaration': {
                    this.parseClassDeclaration(node);
                    break;
                }
                default: {
                    throw 'Unexpected Statement';
                }
            }
        }
    }

    private parseImportDeclaration(node: estree.ImportDeclaration): void {
        // @todo
    }

    private parseClassDeclaration(node: estree.ClassDeclaration): void {
        // get class name
        const className = node.id.name;

        // check super class name
        // can only be Stage or Sprite
        if (node.superClass.type !== 'Identifier') {
            throw 'Invalid Super Class';
        }
        const superClassName = node.superClass.name;
        if (!(superClassName == 'Stage' || superClassName == 'Sprite')) {
            throw 'Unknown Super Class';
        }

        // parse each method/property
        for (const item of node.body.body) {
            if (item.type === 'MethodDefinition') {
                const methodName = (<estree.Identifier>item.key).name;
                const blockSet = new BlockSet();
                blockSet.bodyBlocks = this.parseBlockStatement(item.value.body);
                blockSet.topBlock = new Block();
                if (methodName === 'whenGreenFlag') {
                    blockSet.topBlock.opcode = 'event_whenflagclicked';
                    blockSet.topBlock.isTop = true;
                }
                else if (blockSet.bodyBlocks.length) {
                    blockSet.bodyBlocks[0].isTop = true;
                }
                let last = blockSet.topBlock;
                for (const block of blockSet.bodyBlocks) {
                    last.next = block;
                    last = block;
                }
                this.script.blockSets.push(blockSet);
            }
            else {
                throw 'Invalid Property Definition';
            }
        }
    }

    private parseBlockStatement(node: estree.BlockStatement): Block[] {
        const blocks: Block[] = [];
        for (const statement of node.body) {
            switch (statement.type) {
                case 'ExpressionStatement': {
                    blocks.push(this.parseExpressionStatement(statement));
                    break;
                }
                case 'WhileStatement': {
                    console.log(statement);

                    // while (xxx)
                    if (statement.test.type === 'Literal') {
                        const value = statement.test.value;
                        if (value) { // true, 1, etc...
                            const block = new Block();
                            block.id = generateBlockID();
                            block.opcode = 'control_forever';
                            if (statement.body.type === 'BlockStatement') {
                                const substack = new BlockStatement();
                                substack.blocks = this.parseBlockStatement(statement.body);
                                block.statements.set('SUBSTACK', substack);
                            }
                            else {
                                throw 'Wrong While';
                            }
                            blocks.push(block);
                        }
                        else {
                            throw 'Wrong While';
                        }
                    }
                    else {
                        let input = this.parseExpressionOrLiteralToInput(statement.test, false);
                        if (input.block.opcode === 'operator_not') {
                            input = input.block.inputs.get('OPERAND');
                        }
                        else {
                            const temp = new BlockInput();
                            temp.block = new Block();
                            temp.block.id = generateBlockID();
                            temp.block.opcode = 'operator_not';
                            temp.block.inputs.set('OPERAND', input);
                            input = temp;
                        }

                        const block = new Block();
                        block.id = generateBlockID();
                        block.opcode = 'control_repeat_until';
                        block.inputs.set('CONDITION', input);
                        if (statement.body.type === 'BlockStatement') {
                            const substack = new BlockStatement();
                            substack.blocks = this.parseBlockStatement(statement.body);
                            block.statements.set('SUBSTACK', substack);
                        }
                        else {
                            throw 'Wrong While';
                        }
                        blocks.push(block);
                    }
                    break;
                }
                default: {
                    console.log(statement);
                    throw 'Unknown Statement Type';
                }
            }
        }
        return blocks;
    }

    private parseExpressionStatement(node: estree.ExpressionStatement): Block {
        switch (node.expression.type) {
            case 'AssignmentExpression': {
                const operator = node.expression.operator; // only support =, +=
                if (!(operator === '=' || operator === '+=')) {
                    throw 'Invalid Opeator ' + operator;
                }

                const left = node.expression.left;
                const right = node.expression.right;
                if (left.type === 'MemberExpression') {
                    // console.log(node.expression);
                    if (left.object.type === 'ThisExpression') {
                        // this.xxx = xxx;
                        if (left.property.type === 'Identifier') {
                            // block: motion_setx
                            if (left.property.name === 'x') {
                                const block = new Block();
                                block.opcode = (operator === '=' ? 'motion_setx' : 'motion_changexby');
                                block.id = generateBlockID();
                                block.inputs.set('X', this.parseExpressionOrLiteralToInput(
                                    right, true, 'math_number', 'NUM'
                                ));
                                return block;
                            }
                            // block: motion_sety
                            else if (left.property.name === 'y') {
                                const block = new Block();
                                block.opcode = (operator === '=' ? 'motion_sety' : 'motion_changeyby');
                                block.id = generateBlockID();
                                block.inputs.set('Y', this.parseExpressionOrLiteralToInput(
                                    right, true, 'math_number', 'NUM'
                                ));
                                return block;
                            }
                        }
                    }
                    else if (left.object.type === 'MemberExpression') {
                        // this.xxx.xxx = xxx;
                        if (left.object.object.type === 'ThisExpression') [

                        ]
                        else {

                        }
                    }
                }
            }
            default: {
                throw 'Unknown Expression Statement Type';
            }
        }
    }
    
    private parseSetPropertyExpression(property: string, right: estree.Expression): Block {
        const block = new Block();
        return block;
    }

    private parseExpressionOrLiteralToInput(
        node: estree.Expression, shadow?: boolean, shadowType?: string, fieldName?: string
    ): BlockInput {
        const input = new BlockInput();
        if (node.type === 'Literal' && shadow) {
            input.shadow = new BlockShadow();
            input.shadow.fieldName = fieldName;
            input.shadow.id = generateBlockID();
            input.shadow.type = shadowType;
            input.shadow.value = node.value;
        }
        else {
            if (shadow) {
                input.shadow = new BlockShadow();
                input.shadow.fieldName = fieldName;
                input.shadow.id = generateBlockID();
                input.shadow.type = shadowType;
                input.shadow.value = '';
            }
            input.block = this.parseExpression(node);
        }
        return input;
    }

    private parseExpression(node: estree.Expression): Block {
        switch (node.type) {
            case 'BinaryExpression': {
                const operator = node.operator;

                const block = new Block();
                block.id = generateBlockID();
                if (operator === '+') {
                    // @todo: string add
                    block.opcode = 'operator_add';
                    block.inputs.set('NUM1', this.parseExpressionOrLiteralToInput(
                        node.left, true, 'math_number', 'NUM'
                    ));
                    block.inputs.set('NUM2', this.parseExpressionOrLiteralToInput(
                        node.right, true, 'math_number', 'NUM'
                    ));
                }
                else if (operator === '-' || operator === '*' || operator === '/') {
                    if (operator === '-') block.opcode = 'operator_substract';
                    else if (operator === '*') block.opcode = 'operator_multiply';
                    else if (operator === '/') block.opcode = 'operator_divide';
                    block.inputs.set('NUM1', this.parseExpressionOrLiteralToInput(
                        node.left, true, 'math_number', 'NUM'
                    ));
                    block.inputs.set('NUM2', this.parseExpressionOrLiteralToInput(
                        node.right, true, 'math_number', 'NUM'
                    ));
                }
                else if (operator === '<' || operator === '>' || operator === '==') {
                    if (operator === '<') block.opcode = 'operator_lt';
                    else if (operator === '>') block.opcode = 'operator_gt';
                    else if (operator === '==') block.opcode = 'operator_equals';
                    block.inputs.set('OPERAND1', this.parseExpressionOrLiteralToInput(
                        node.left, true, 'text', 'TEXT'
                    ));
                    block.inputs.set('OPERAND2', this.parseExpressionOrLiteralToInput(
                        node.right, true, 'text', 'TEXT'
                    ));
                }
                else {
                    throw 'Unknown Binary Expression';
                }
                return block;
            }
            case 'UnaryExpression': {
                const operator = node.operator;

                const block = new Block();
                block.id = generateBlockID();
                if (operator === '!') {
                    block.opcode = 'operator_not';
                    block.inputs.set('OPERAND', this.parseExpressionOrLiteralToInput(
                        node.argument, false
                    ));
                }
                else {
                    throw 'Unknown Unary Expression';
                }
                return block;
            }
            default: {
                console.log(node);
                throw 'Unknown Expression Type';
            }
        }
    }

    /*
    private parseMemberExpression(node: estree.MemberExpression): CodeStatement {
        const result = new CodeStatement();
        result.type = CodeStatementType.MemberList;
        
        let curNode = node;
        while (curNode.object.type === 'MemberExpression') {
            result.data.unshift((<estree.Identifier>curNode.object.property).name);
            curNode = curNode.object;
        }

        return result;
    }
    */
}

export default CodeParser;
