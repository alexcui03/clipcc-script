import Block from "./block";

enum ParamType { FIELD, INPUT, STATEMENT }
enum BlockType { HEAD, END, BODY, CALLABLE, STATEMENT }
enum ValueType { FIELD, NUMBER, STRING, ANY, STATEMENT }

interface BlockParamPrototype {
    name: string;
    type: ParamType;
    valueType: ValueType;
}

interface BlockPrototype {
    opcode: string;
    type: BlockType;
    params: BlockParamPrototype[];
    memberName?: string;
    toCode?: (params: Map<string, string>) => string;
}

export default BlockPrototype;
export {
    BlockType,
    ParamType,
    ValueType,
    BlockParamPrototype
};
