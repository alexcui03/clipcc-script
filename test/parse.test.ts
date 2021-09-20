import DefinitionManager from '../src/definition_manager';
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
            <block type="data_variable" id="5z5j,U_Q/%5dtRs9dhz^">
              <field name="VARIABLE" id="=aNDjbFFd/gOP0N.a\`3V" variabletype="">a</field>
            </block>
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
<block type="event_whenthisspriteclicked" id="^|hY3,dY5S,+Ji6mOf%z" x="68" y="413">
  <next>
    <block type="motion_movesteps" id="bTWB1ue2th@aPmHlR;Xc">
      <value name="STEPS">
        <shadow type="math_number" id=":Ef[.m*L}|(\`By8%RLCV">
          <field name="NUM">10</field>
        </shadow>
        <block type="operator_add" id="Sd7m}9Y(Xq]~.$R!B^0Y">
          <value name="NUM1">
            <shadow type="math_number" id="H5!=k*|lDLao^z]h@)w{">
              <field name="NUM">2</field>
            </shadow>
            <block type="data_variable" id="/[)UF)!Z#7f=*A{)N\`K1">
              <field name="VARIABLE" id="=aNDjbFFd/gOP0N.a\`3V" variabletype="">a</field>
            </block>
          </value>
          <value name="NUM2">
            <shadow type="math_number" id="2/QQ}m,I63JIHp[Rx@*d">
              <field name="NUM">4</field>
            </shadow>
          </value>
        </block>
      </value>
    </block>
  </next>
</block>
</xml>`;

const definition = new DefinitionManager();

const script = new Script();
script.loadFromXML(xml);
console.log(script.generateCode(definition));
