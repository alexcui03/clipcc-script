import Script from '../src/script';

const xml: string = `<xml xmlns="http://www.w3.org/1999/xhtml">
<variables>
  <variable type="" id="=aNDjbFFd/gOP0N.a\`3V" islocal="false" iscloud="false">a</variable>
</variables>
<block type="event_whenflagclicked" id="^PPKc;|t+J;x!@R3;C.#" x="77" y="144">
  <next>
    <block type="data_setvariableto" id="Co/Ze?bD#u,a=p\`(aIfL">
      <field name="VARIABLE" id="=aNDjbFFd/gOP0N.a\`3V" variabletype="">a</field>
      <value name="VALUE">
        <shadow type="text" id="/az6K=O}}ZAp23vAte7V">
          <field name="TEXT">0</field>
        </shadow>
      </value>
      <next>
        <block type="data_changevariableby" id="LPD$9]2fBk.cL~sdL_M(">
          <field name="VARIABLE" id="=aNDjbFFd/gOP0N.a\`3V" variabletype="">a</field>
          <value name="VALUE">
            <shadow type="math_number" id="_j@iHUlL%J/F4n-1@hJ.">
              <field name="NUM">1</field>
            </shadow>
          </value>
          <next>
            <block type="data_changevariableby" id="AQif8RmVnEUV/!2Zm+Zs">
              <field name="VARIABLE" id="=aNDjbFFd/gOP0N.a\`3V" variabletype="">a</field>
              <value name="VALUE">
                <shadow type="math_number" id="4O3;k,@:YZyps%45RpK3">
                  <field name="NUM">1</field>
                </shadow>
              </value>
            </block>
          </next>
        </block>
      </next>
    </block>
  </next>
</block>
</xml>`;

const script = new Script();
script.loadFromXML(xml);
console.log(script.generateCode());
