import { loadArray } from "./util";

class Block {
    public opcode: string = '';
    public id: string = '';
    public x: number = 0;
    public y: number = 0;
    public line: number = 0;
    public fields = new Map<string, BlockField>();
    public inputs = new Map<string, BlockInput>();

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
    }

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
