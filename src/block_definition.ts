import Block from "./block";
import BlockPrototype, { BlockType, ParamType, ValueType } from "./block_prototype";

const blockPrototypes = new Map<string, BlockPrototype>([
    // Event
    ['event_whenflagclicked', {
        opcode: 'event_whenflagclicked',
        type: BlockType.HEAD,
        params: []
    }],

    // Operator
    ['operator_add', {
        opcode: 'operator_add',
        type: BlockType.CALLABLE,
        params: [
            { name: 'NUM1', type: ParamType.INPUT, valueType: ValueType.NUMBER },
            { name: 'NUM2', type: ParamType.INPUT, valueType: ValueType.NUMBER }
        ],
        toCode: (params: Map<string, string>): string => {
            return `${params.get('NUM1')} + ${params.get('NUM2')}`
        }
    }],

    // Data
    ['data_variable', {
        opcode: 'data_variable',
        type: BlockType.CALLABLE,
        params: [
            { name: 'VARIABLE', type: ParamType.FIELD, valueType: ValueType.FIELD }
        ],
        toCode: (params: Map<string, string>): string => {
            return params.get('VARIABLE');
        }
    }],
    ['data_setvariableto', {
        opcode: 'data_setvariableto',
        type: BlockType.BODY,
        params: [
            { name: 'VARIABLE', type: ParamType.FIELD, valueType: ValueType.FIELD },
            { name: 'VALUE', type: ParamType.INPUT, valueType: ValueType.ANY }
        ],
        toCode: (params: Map<string, string>): string => {
            return `${params.get('VARIABLE')} = ${params.get('VALUE')};`;
        }
    }],
    ['data_changevariableby', {
        opcode: 'data_changevariableby',
        type: BlockType.BODY,
        params: [
            { name: 'VARIABLE', type: ParamType.FIELD, valueType: ValueType.FIELD },
            { name: 'VALUE', type: ParamType.INPUT, valueType: ValueType.ANY }
        ],
        toCode: (params: Map<string, string>): string => {
            return `${params.get('VARIABLE')} += ${params.get('VALUE')};`;
        }
    }]
]);

export default blockPrototypes;
