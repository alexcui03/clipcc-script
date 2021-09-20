import DefinitionManager from "./definition_manager";
import { loadArray } from "./util";

class BlockShadow {
    public type: string = '';
    public id: string = '';
    public value: any = null;
}

class BlockInput {
    // public name: string = '';
    public shadow: BlockShadow | null = null;
    public block: Block | null = null;
}

class BlockField {
    // public name: string = '';
    public id: string = '';
    public value: any = null;
}

class BlockStatement {
    // public name: string ='';
    public blocks: Block[] = [];
}

class Block {
    public opcode: string = '';
    public id: string = '';
    public x: number = 0;
    public y: number = 0;
    public line: number = 0;
    public fields = new Map<string, BlockField>();
    public inputs = new Map<string, BlockInput>();
    public statements = new Map<string, BlockStatement>();

    public loadFromXML(xml: any) {
        this.opcode = xml['@_type'];
        this.id = xml['@_id'];
        this.x = xml['@_x'] || 0;
        this.y = xml['@_y'] || 0;

        // parse fields
        const fields = loadArray(xml.field);
        for (const fieldXML of fields) {
            const field = new BlockField();
            field.id = fieldXML['@_id'];
            field.value = fieldXML['#text'];
            this.fields.set(fieldXML['@_name'], field);
        }

        // parse inputs
        const inputs = loadArray(xml.value);
        for (const inputXML of inputs) {
            const input = new BlockInput();

            if (inputXML.shadow) {
                input.shadow = new BlockShadow();
                input.shadow.id = inputXML.shadow['@_id'];
                input.shadow.type = inputXML.shadow['@_type'];
                input.shadow.value = inputXML.shadow.field['#text'];
            }

            if (inputXML.block) {
                input.block = new Block();
                input.block.loadFromXML(inputXML.block);
            }

            this.inputs.set(inputXML['@_name'], input);
        }

        // parse statements
        const statements = loadArray(xml.statement);
        for (const statementXML of statements) {
            const statement = new BlockStatement();

            let blockXML = statementXML;
            if (blockXML) {
                do {
                    const block = new Block();
                    block.loadFromXML(blockXML.block);
                    statement.blocks.push(block);
                    blockXML = blockXML.block.next;
                } while(blockXML);
            }

            this.statements.set(statementXML['@_name'], statement);
        }
    }

    public generateCode(definition: DefinitionManager, needSemicolon: boolean = false) {
        if (definition.get(this.opcode) && definition.get(this.opcode).toCode) {
            const params = new Map<string, string>();

            for (const [name, field] of this.fields) {
                params.set(name, String(field.value));
            }

            for (const [name, input] of this.inputs) {
                if (input.block) params.set(name, input.block.generateCode(definition, false));
                else if (input.shadow) params.set(name, String(input.shadow.value));
                else params.set(name, 'null');
            }

            for (const [name, statement] of this.statements) {
                params.set(name, statement.blocks.map(block => block.generateCode(definition, true)).join('\n'));
            }

            return definition.get(this.opcode).toCode(params);
        }
        else {
            const params: string[] = [];

            for (const [name, field] of this.fields) {
                params.push(String(field.value));
            }

            for (const [name, input] of this.inputs) {
                if (input.block) params.push(input.block.generateCode(definition, false));
                else if (input.shadow) params.push(String(input.shadow.value));
                else params.push('null');
            }

            for (const [name, statement] of this.statements) {
                const body = statement.blocks.map(block => block.generateCode(definition, true)).join('\n');
                params.push(`() => {\n${body}\n}`);
            }

            return `${this.opcode}(${[...params.values()].join(', ')})${needSemicolon ? ';' : ''}`;
        }
    }
}

export default Block;
export {
    BlockShadow,
    BlockInput,
    BlockField,
    BlockStatement
};
