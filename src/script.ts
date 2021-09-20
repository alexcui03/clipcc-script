import XML from 'fast-xml-parser';

class Script {
    constructor() {

    }

    public loadFromXML(xmlString: string): void {
        const xml = XML.parse(xmlString);
        console.log(xml);
    }
}

export default Script;
