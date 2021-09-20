import Block from "./block";

enum ParamType { FIELD, INPUT }
enum BlockType { HEAD, END, BODY, CALLABLE, STATEMENT }
enum ValueType { FIELD, NUMBER, STRING, ANY }

interface BlockParamPrototype {
    name: string;
    type: ParamType;
    valueType: ValueType;
}

interface BlockPrototype {
    opcode: string;
    type: BlockType;
    params: BlockParamPrototype[];
    toCode?: (params: Map<string, string>) => string;
}

export default BlockPrototype;
export {
    BlockType,
    ParamType,
    ValueType,
    BlockParamPrototype
};
