import { useState, useEffect, useRef } from "react";

const uid = () => Math.random().toString(36).slice(2, 7);

const BG = "#07090f"; const PANEL = "#0d1117"; const BORDER = "#1a2234";
const ACC = "#e8a020"; const DIM = "#3a4a60"; const MUT = "#556070"; const TXT = "#cdd5e0";
const GRN = "#2ecc8a"; const BLU = "#3b9eff"; const PNK = "#e05a8a";
const PUR = "#9b7fe8"; const ORG = "#e87a30"; const RED = "#e74c3c";

const LIFT_COLORS = { "Flujo Natural": BLU, "BES": PUR, "Bombeo Mecanico": ACC, "Gas Lift": GRN, "PCP": ORG };

const tubOD    = ["1.900in","2-3/8in","2-7/8in","3-1/2in","4-1/2in","5in","5-1/2in"];
const tubPeso  = ["4.6","6.4","8.6","9.2","10.4","12.7","15.5","17.0","20.0","23.0"];
const tubGrado = ["J-55","K-55","N-80","L-80","C-90","T-95","P-110","Q-125"];
const tubConex = ["EUE","NUE","BTC","LTC","VAM","TENARIS BLUE"];
const casOD    = ["4-1/2in","5in","5-1/2in","7in","7-5/8in","8-5/8in","9-5/8in","13-3/8in"];
const empTipo  = ["Recuperable","Permanente","Inflable","Doble"];
const empFab   = ["Baker Hughes W-3","Baker Hughes D","Halliburton RT","Schlumberger VSP","Weatherford"];
const mndTipo  = ["Mandril Gas Lift","Side Pocket","Camisa Deslizante","Niple Asentamiento","Blast Joint","Sub SSSV"];
const perfTipo = ["Canoneo TCP","Wireline","Intervalo Abierto OH","Liner Ranurado","Gravel Pack Screen"];
const liftOps  = ["Flujo Natural","BES","Bombeo Mecanico","Gas Lift","PCP"];
const besBomba = ["REDA GN-1600","REDA DN-1750","CENTRILIFT GC-2200","BORETS NK-1400","REDA P-47"];
const besMotor = ["REDA 375HP/540V","REDA 200HP/420V","CENTRILIFT 300HP/540V","BORETS 450HP/600V"];
const besSello = ["REDA TANDEM","CENTRILIFT LABYRINTH","BORETS MECHANICAL"];
const bmUnidad = ["C-320D-256-120","C-456D-365-144","C-640D-365-168","LUFKIN C-456","LUFKIN C-640"];
const bmVar    = ["5/8in","3/4in","7/8in","1in","1-1/8in","Fibra vidrio 1in"];

const SECTIONS = [
  { id:"info", label:"INFO", col:ACC },
  { id:"tub",  label:"TUBERIA", col:ACC },
  { id:"emp",  label:"EMPACAD.", col:PNK },
  { id:"mnd",  label:"MANDRILES", col:BLU },
  { id:"lift", label:"LEVANT.", col:GRN },
  { id:"int",  label:"INTERVALOS", col:GRN },
  { id:"sup",  label:"SUPERFICIE", col:BLU },
  { id:"diagrama", label:"DIAGRAMA", col:ACC },
];

// ─── Primitives ───────────────────────────────────────────────────────────────
function Field(props) {
  var label=props.label, value=props.value, onChange=props.onChange, opts=props.opts, ph=props.ph||"", type=props.type||"text";
  var base = { width:"100%", background:BG, border:"1px solid "+BORDER, borderRadius:5, color:TXT, padding:"8px 10px", fontSize:11, fontFamily:"monospace", boxSizing:"border-box" };
  return (
    <div style={{ marginBottom:10 }}>
      <div style={{ fontSize:8, color:MUT, letterSpacing:"1.5px", marginBottom:4 }}>{label}</div>
      {opts
        ? <select value={value||""} onChange={function(e){onChange(e.target.value);}} style={base}>
            <option value="">-- seleccionar --</option>
            {opts.map(function(o){ return <option key={o} value={o}>{o}</option>; })}
          </select>
        : <input value={value||""} onChange={function(e){onChange(e.target.value);}} placeholder={ph} type={type} style={base} />
      }
    </div>
  );
}

function G2(p) { return <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>{p.children}</div>; }
function SH(p) {
  var col=p.col||ACC;
  return <div style={{ fontSize:8, letterSpacing:"2px", color:col, margin:"14px 0 10px", display:"flex", alignItems:"center", gap:8 }}>
    <div style={{ flex:1, height:1, background:col+"40" }}/>{p.label}<div style={{ flex:1, height:1, background:col+"40" }}/>
  </div>;
}
function Card(p) {
  return <div style={{ background:PANEL, border:"1px solid "+(p.col||BORDER), borderRadius:10, padding:14, marginBottom:10 }}>{p.children}</div>;
}
function DelBtn(p) {
  return <button onClick={p.onDel} style={{ background:"none", border:"none", color:RED, cursor:"pointer", fontSize:18, padding:"0 4px" }}>x</button>;
}
function AddBtn(p) {
  return <button onClick={p.onClick} style={{ marginTop:6, padding:"9px 16px", background:"transparent", border:"1px dashed "+p.col+"60", borderRadius:7, color:p.col, fontSize:9, fontFamily:"monospace", letterSpacing:"1px", cursor:"pointer", width:"100%" }}>{p.label}</button>;
}
function Btn(p) {
  return <button onClick={p.onClick} style={{ padding:p.sm?"7px 12px":"10px 18px", background:p.col+"20", border:"1px solid "+p.col, borderRadius:7, color:p.col, fontSize:p.sm?8:10, fontFamily:"monospace", cursor:"pointer", fontWeight:"bold", letterSpacing:"0.5px" }}>{p.children}</button>;
}

// ─── TABS ─────────────────────────────────────────────────────────────────────
function TabInfo(p) {
  var d=p.d, set=p.set;
  function f(label, key, ph) {
    return <Field label={label} value={d[key]} onChange={function(v){set(function(x){var n=Object.assign({},x);n[key]=v;return n;});}} ph={ph||""} />;
  }
  return <div>
    <SH label="DATOS DEL POZO" col={ACC}/>
    {f("NOMBRE DEL POZO","nombre","Ej: OLT-1234")}
    <G2>{f("CAMPO","campo","Furrial / Hamaca")}{f("CUENCA","cuenca","Oriental / Maracaibo")}</G2>
    <G2>{f("PROFUNDIDAD TD (m)","td","2500")}{f("EMPRESA OPERADORA","op","PDVSA")}</G2>
    {f("TIPO DE ARENA / YACIMIENTO","arena","Arenisca / Caliza")}
  </div>;
}

function TabTuberia(p) {
  var rows=p.rows, setRows=p.setRows;
  function add(){setRows(function(a){return a.concat([{id:uid(),od:"",peso:"",grado:"",conex:"",desde:"0",hasta:""}]);});}
  function upd(id,k,v){setRows(function(a){return a.map(function(r){if(r.id===id){var n=Object.assign({},r);n[k]=v;return n;}return r;});});}
  function del(id){setRows(function(a){return a.filter(function(r){return r.id!==id;});});}
  return <div>
    <SH label="SARTA DE PRODUCCION" col={ACC}/>
    {rows.map(function(r,i){return <Card key={r.id} col={ACC+"50"}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
        <span style={{fontSize:9,color:ACC}}>TRAMO {i+1}</span><DelBtn onDel={function(){del(r.id);}}/>
      </div>
      <G2>
        <Field label="OD TUBERIA" value={r.od} onChange={function(v){upd(r.id,"od",v);}} opts={tubOD}/>
        <Field label="PESO #/ft" value={r.peso} onChange={function(v){upd(r.id,"peso",v);}} opts={tubPeso}/>
      </G2>
      <G2>
        <Field label="GRADO" value={r.grado} onChange={function(v){upd(r.id,"grado",v);}} opts={tubGrado}/>
        <Field label="CONEXION" value={r.conex} onChange={function(v){upd(r.id,"conex",v);}} opts={tubConex}/>
      </G2>
      <G2>
        <Field label="DESDE (m)" value={r.desde} onChange={function(v){upd(r.id,"desde",v);}} ph="0" type="number"/>
        <Field label="HASTA/TOF (m)" value={r.hasta} onChange={function(v){upd(r.id,"hasta",v);}} ph="2500" type="number"/>
      </G2>
    </Card>;})}
    <AddBtn onClick={add} col={ACC} label="+ Agregar tramo de tuberia"/>
  </div>;
}

function TabEmpacadoras(p) {
  var rows=p.rows, setRows=p.setRows;
  function add(){setRows(function(a){return a.concat([{id:uid(),tipo:"",prof:"",od:"",pmax:"",tmax:"",fab:""}]);});}
  function upd(id,k,v){setRows(function(a){return a.map(function(r){if(r.id===id){var n=Object.assign({},r);n[k]=v;return n;}return r;});});}
  function del(id){setRows(function(a){return a.filter(function(r){return r.id!==id;});});}
  return <div>
    <SH label="EMPACADORAS" col={PNK}/>
    {rows.map(function(r,i){return <Card key={r.id} col={PNK+"50"}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
        <span style={{fontSize:9,color:PNK}}>EMPACADORA {i+1}</span><DelBtn onDel={function(){del(r.id);}}/>
      </div>
      <G2>
        <Field label="TIPO" value={r.tipo} onChange={function(v){upd(r.id,"tipo",v);}} opts={empTipo}/>
        <Field label="PROFUNDIDAD (m)" value={r.prof} onChange={function(v){upd(r.id,"prof",v);}} ph="m" type="number"/>
      </G2>
      <G2>
        <Field label="OD CASING" value={r.od} onChange={function(v){upd(r.id,"od",v);}} opts={casOD}/>
        <Field label="FABRICANTE" value={r.fab} onChange={function(v){upd(r.id,"fab",v);}} opts={empFab}/>
      </G2>
      <G2>
        <Field label="PRES MAX (psi)" value={r.pmax} onChange={function(v){upd(r.id,"pmax",v);}} ph="psi" type="number"/>
        <Field label="TEMP MAX (F)" value={r.tmax} onChange={function(v){upd(r.id,"tmax",v);}} ph="F" type="number"/>
      </G2>
    </Card>;})}
    <AddBtn onClick={add} col={PNK} label="+ Agregar empacadora"/>
  </div>;
}

function TabMandriles(p) {
  var rows=p.rows, setRows=p.setRows;
  function add(){setRows(function(a){return a.concat([{id:uid(),tipo:"",prof:"",od:"",fab:"",presAp:"",presCi:""}]);});}
  function upd(id,k,v){setRows(function(a){return a.map(function(r){if(r.id===id){var n=Object.assign({},r);n[k]=v;return n;}return r;});});}
  function del(id){setRows(function(a){return a.filter(function(r){return r.id!==id;});});}
  return <div>
    <SH label="MANDRILES Y ACCESORIOS" col={BLU}/>
    {rows.map(function(r,i){return <Card key={r.id} col={BLU+"50"}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
        <span style={{fontSize:9,color:BLU}}>ACCESORIO {i+1}</span><DelBtn onDel={function(){del(r.id);}}/>
      </div>
      <G2>
        <Field label="TIPO" value={r.tipo} onChange={function(v){upd(r.id,"tipo",v);}} opts={mndTipo}/>
        <Field label="PROFUNDIDAD (m)" value={r.prof} onChange={function(v){upd(r.id,"prof",v);}} ph="m" type="number"/>
      </G2>
      <G2>
        <Field label="OD TUBERIA" value={r.od} onChange={function(v){upd(r.id,"od",v);}} opts={tubOD}/>
        <Field label="FABRICANTE" value={r.fab} onChange={function(v){upd(r.id,"fab",v);}} ph="CAMCO / Otis"/>
      </G2>
      <G2>
        <Field label="PRES APERTURA (psi)" value={r.presAp} onChange={function(v){upd(r.id,"presAp",v);}} ph="psi" type="number"/>
        <Field label="PRES CIERRE (psi)" value={r.presCi} onChange={function(v){upd(r.id,"presCi",v);}} ph="psi" type="number"/>
      </G2>
    </Card>;})}
    <AddBtn onClick={add} col={BLU} label="+ Agregar mandril / accesorio"/>
  </div>;
}

function TabLift(p) {
  var lift=p.lift, setLift=p.setLift;
  function set(k,v){setLift(function(x){var n=Object.assign({},x);n[k]=v;return n;});}
  var tipo=lift.tipo||"Flujo Natural";
  var col=LIFT_COLORS[tipo]||BLU;
  return <div>
    <SH label="SISTEMA DE LEVANTAMIENTO" col={col}/>
    <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:16}}>
      {liftOps.map(function(t){
        var on=tipo===t, tc=LIFT_COLORS[t]||BLU;
        return <button key={t} onClick={function(){setLift({tipo:t});}}
          style={{padding:"8px 14px",background:on?tc+"20":"transparent",border:"1px solid "+(on?tc:BORDER),borderRadius:20,color:on?tc:MUT,fontSize:9,fontFamily:"monospace",cursor:"pointer"}}>{t}</button>;
      })}
    </div>
    {tipo==="BES" && <Card col={PUR+"50"}>
      <SH label="CONFIGURACION BES" col={PUR}/>
      <G2>
        <Field label="BOMBA" value={lift.bomba} onChange={function(v){set("bomba",v);}} opts={besBomba}/>
        <Field label="ETAPAS" value={lift.etapas} onChange={function(v){set("etapas",v);}} ph="#" type="number"/>
      </G2>
      <G2>
        <Field label="MOTOR" value={lift.motor} onChange={function(v){set("motor",v);}} opts={besMotor}/>
        <Field label="SELLO" value={lift.sello} onChange={function(v){set("sello",v);}} opts={besSello}/>
      </G2>
      <G2>
        <Field label="FRECUENCIA (Hz)" value={lift.freq} onChange={function(v){set("freq",v);}} ph="60" type="number"/>
        <Field label="PROF MOTOR (m)" value={lift.profMotor} onChange={function(v){set("profMotor",v);}} ph="m" type="number"/>
      </G2>
      <G2>
        <Field label="CAUDAL DISENO (bpd)" value={lift.caudal} onChange={function(v){set("caudal",v);}} ph="bpd" type="number"/>
        <Field label="PROVEEDOR" value={lift.marca} onChange={function(v){set("marca",v);}} ph="REDA / CENTRILIFT"/>
      </G2>
    </Card>}
    {tipo==="Bombeo Mecanico" && <Card col={ACC+"50"}>
      <SH label="BOMBEO MECANICO" col={ACC}/>
      <Field label="UNIDAD DE BOMBEO" value={lift.unidad} onChange={function(v){set("unidad",v);}} opts={bmUnidad}/>
      <G2>
        <Field label="SPM" value={lift.spm} onChange={function(v){set("spm",v);}} ph="spm" type="number"/>
        <Field label="CARRERA (in)" value={lift.carrera} onChange={function(v){set("carrera",v);}} ph="in" type="number"/>
      </G2>
      <Field label="VARILLA" value={lift.varilla} onChange={function(v){set("varilla",v);}} opts={bmVar}/>
      <G2>
        <Field label="BOMBA FONDO OD" value={lift.bombaFondo} onChange={function(v){set("bombaFondo",v);}} ph="1-1/2in"/>
        <Field label="PROF BOMBA (m)" value={lift.profBomba} onChange={function(v){set("profBomba",v);}} ph="m" type="number"/>
      </G2>
    </Card>}
    {tipo==="Gas Lift" && <Card col={GRN+"50"}>
      <SH label="GAS LIFT" col={GRN}/>
      <G2>
        <Field label="TIPO GL" value={lift.tipoGL} onChange={function(v){set("tipoGL",v);}} opts={["Continuo","Intermitente","Chamber Lift"]}/>
        <Field label="N VALVULAS" value={lift.nVal} onChange={function(v){set("nVal",v);}} ph="#" type="number"/>
      </G2>
      <G2>
        <Field label="CAUDAL GAS MScfd" value={lift.caudalGas} onChange={function(v){set("caudalGas",v);}} ph="MScfd" type="number"/>
        <Field label="PRES LINEA psi" value={lift.presLinea} onChange={function(v){set("presLinea",v);}} ph="psi" type="number"/>
      </G2>
      <Field label="PUNTO INYECCION (m)" value={lift.puntoIny} onChange={function(v){set("puntoIny",v);}} ph="m" type="number"/>
    </Card>}
    {tipo==="PCP" && <Card col={ORG+"50"}>
      <SH label="BOMBA PCP" col={ORG}/>
      <G2>
        <Field label="MARCA" value={lift.marca} onChange={function(v){set("marca",v);}} ph="Robbins and Myers"/>
        <Field label="RPM" value={lift.rpm} onChange={function(v){set("rpm",v);}} ph="rpm" type="number"/>
      </G2>
      <G2>
        <Field label="DESPLAZ bpd/rpm" value={lift.desplaz} onChange={function(v){set("desplaz",v);}} ph="bpd/rpm" type="number"/>
        <Field label="PROF BOMBA (m)" value={lift.profBomba} onChange={function(v){set("profBomba",v);}} ph="m" type="number"/>
      </G2>
    </Card>}
    {tipo==="Flujo Natural" && <Card col={BLU+"50"}>
      <div style={{textAlign:"center",padding:"10px 0"}}>
        <div style={{fontSize:24,marginBottom:6}}>~</div>
        <div style={{fontSize:10,color:BLU}}>Sin levantamiento artificial</div>
      </div>
      <G2>
        <Field label="PRES ESTATICA psi" value={lift.presEst} onChange={function(v){set("presEst",v);}} ph="psi" type="number"/>
        <Field label="PRES FLUYENTE psi" value={lift.presFluy} onChange={function(v){set("presFluy",v);}} ph="psi" type="number"/>
      </G2>
    </Card>}
  </div>;
}

function TabIntervalos(p) {
  var rows=p.rows, setRows=p.setRows;
  function add(){setRows(function(a){return a.concat([{id:uid(),arena:"",tope:"",base:"",tipo:"",spf:"",presEst:"",temp:"",qo:"",qw:"",qg:""}]);});}
  function upd(id,k,v){setRows(function(a){return a.map(function(r){if(r.id===id){var n=Object.assign({},r);n[k]=v;return n;}return r;});});}
  function del(id){setRows(function(a){return a.filter(function(r){return r.id!==id;});});}
  return <div>
    <SH label="INTERVALOS PERFORADOS / ABIERTOS" col={GRN}/>
    {rows.map(function(r,i){return <Card key={r.id} col={GRN+"50"}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
        <span style={{fontSize:9,color:GRN}}>INTERVALO {i+1}</span><DelBtn onDel={function(){del(r.id);}}/>
      </div>
      <Field label="ARENA / FORMACION" value={r.arena} onChange={function(v){upd(r.id,"arena",v);}} ph="Ej: LL-03 / Oficina 3"/>
      <G2>
        <Field label="TOPE (m)" value={r.tope} onChange={function(v){upd(r.id,"tope",v);}} ph="m" type="number"/>
        <Field label="BASE (m)" value={r.base} onChange={function(v){upd(r.id,"base",v);}} ph="m" type="number"/>
      </G2>
      <Field label="TIPO COMPLETACION" value={r.tipo} onChange={function(v){upd(r.id,"tipo",v);}} opts={perfTipo}/>
      <G2>
        <Field label="DISPAROS spf" value={r.spf} onChange={function(v){upd(r.id,"spf",v);}} ph="4" type="number"/>
        <Field label="PRES ESTATICA psi" value={r.presEst} onChange={function(v){upd(r.id,"presEst",v);}} ph="psi" type="number"/>
      </G2>
      <G2>
        <Field label="TEMP F" value={r.temp} onChange={function(v){upd(r.id,"temp",v);}} ph="F" type="number"/>
        <Field label="Qo bpd" value={r.qo} onChange={function(v){upd(r.id,"qo",v);}} ph="bpd" type="number"/>
      </G2>
      <G2>
        <Field label="Qw bpd" value={r.qw} onChange={function(v){upd(r.id,"qw",v);}} ph="bpd" type="number"/>
        <Field label="Qg MScfd" value={r.qg} onChange={function(v){upd(r.id,"qg",v);}} ph="MScfd" type="number"/>
      </G2>
    </Card>;})}
    <AddBtn onClick={add} col={GRN} label="+ Agregar intervalo"/>
  </div>;
}

function TabSuperficie(p) {
  var sup=p.sup, setSup=p.setSup;
  function tog(k){setSup(function(x){var n=Object.assign({},x);n[k]=!x[k];return n;});}
  function set(k,v){setSup(function(x){var n=Object.assign({},x);n[k]=v;return n;});}
  var items=[
    {k:"arbol",label:"Arbol Navidad"},{k:"cabezal",label:"Cabezal Pozo"},
    {k:"choke",label:"Estrangulador"},{k:"manoms",label:"Manometros TP/TR"},
    {k:"sep",label:"Separador"},{k:"flowline",label:"Linea de Flujo"},
  ];
  return <div>
    <SH label="COMPONENTES DE SUPERFICIE" col={BLU}/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
      {items.map(function(it){
        var on=sup[it.k];
        return <button key={it.k} onClick={function(){tog(it.k);}}
          style={{padding:"12px 8px",background:on?BLU+"18":"transparent",border:"1px solid "+(on?BLU:BORDER),borderRadius:8,color:on?BLU:MUT,cursor:"pointer",fontFamily:"monospace",display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
          <span style={{fontSize:8,textAlign:"center",lineHeight:1.4}}>{it.label}</span>
          {on&&<span style={{fontSize:7,color:GRN}}>ACTIVO</span>}
        </button>;
      })}
    </div>
    {sup.arbol&&<Card col={BLU+"50"}>
      <SH label="ARBOL DE NAVIDAD" col={BLU}/>
      <G2>
        <Field label="TIPO" value={sup.arbolTipo} onChange={function(v){set("arbolTipo",v);}} opts={["Convencional","Compacto","Subsea","HP/HT"]}/>
        <Field label="PRES TRABAJO psi" value={sup.arbolPres} onChange={function(v){set("arbolPres",v);}} ph="psi" type="number"/>
      </G2>
      <G2>
        <Field label="TEMP TRABAJO F" value={sup.arbolTemp} onChange={function(v){set("arbolTemp",v);}} ph="F" type="number"/>
        <Field label="FABRICANTE" value={sup.arbolFab} onChange={function(v){set("arbolFab",v);}} opts={["Cameron","Vetco Gray","FMC Technologies"]}/>
      </G2>
    </Card>}
    {sup.choke&&<Card col={PUR+"50"}>
      <SH label="ESTRANGULADOR CHOKE" col={PUR}/>
      <G2>
        <Field label="TIPO" value={sup.chokeTipo} onChange={function(v){set("chokeTipo",v);}} opts={["Fijo","Ajustable","Automatico"]}/>
        <Field label="APERTURA 64avos" value={sup.chokeAp} onChange={function(v){set("chokeAp",v);}} ph="64avos" type="number"/>
      </G2>
      <G2>
        <Field label="PRES ENTRADA psi" value={sup.chokePin} onChange={function(v){set("chokePin",v);}} ph="psi" type="number"/>
        <Field label="PRES SALIDA psi" value={sup.chokePout} onChange={function(v){set("chokePout",v);}} ph="psi" type="number"/>
      </G2>
    </Card>}
    {sup.sep&&<Card col={GRN+"50"}>
      <SH label="SEPARADOR" col={GRN}/>
      <G2>
        <Field label="TIPO" value={sup.sepTipo} onChange={function(v){set("sepTipo",v);}} opts={["Bifasico","Trifasico","Test Separator"]}/>
        <Field label="PRES OPER psi" value={sup.sepPres} onChange={function(v){set("sepPres",v);}} ph="psi" type="number"/>
      </G2>
      <G2>
        <Field label="TEMP OPER F" value={sup.sepTemp} onChange={function(v){set("sepTemp",v);}} ph="F" type="number"/>
        <Field label="CAP LIQUIDO bpd" value={sup.sepQLiq} onChange={function(v){set("sepQLiq",v);}} ph="bpd" type="number"/>
      </G2>
    </Card>}
    <SH label="CONDICIONES CABEZA DE POZO" col={ACC}/>
    <G2>
      <Field label="PRES CABEZA psi" value={sup.presCab} onChange={function(v){set("presCab",v);}} ph="psi" type="number"/>
      <Field label="TEMP CABEZA F" value={sup.tempCab} onChange={function(v){set("tempCab",v);}} ph="F" type="number"/>
    </G2>
    <G2>
      <Field label="PRES LINEA psi" value={sup.presLine} onChange={function(v){set("presLine",v);}} ph="psi" type="number"/>
      <Field label="TEMP LINEA F" value={sup.tempLine} onChange={function(v){set("tempLine",v);}} ph="F" type="number"/>
    </G2>
  </div>;
}

// ─── SVG ─────────────────────────────────────────────────────────────────────
function DiagramaSVG(p) {
  var info=p.info, tuberias=p.tuberias, empacadoras=p.empacadoras, mandriles=p.mandriles, lift=p.lift, intervalos=p.intervalos, sup=p.sup;
  var W=320, H=680, cx=W/2;
  var maxD=1500;
  empacadoras.forEach(function(v){if(+v.prof>maxD)maxD=+v.prof;});
  intervalos.forEach(function(v){if(+v.base>maxD)maxD=+v.base;});
  if(+lift.profBomba>maxD)maxD=+lift.profBomba;
  if(+lift.profMotor>maxD)maxD=+lift.profMotor;
  if(+info.td>maxD)maxD=+info.td;
  function dy(d){return 110+(+d/maxD)*540;}
  var lc=LIFT_COLORS[lift.tipo]||BLU;
  var pCols=[GRN,ACC,PNK,BLU,ORG,PUR];
  return (
    <svg width={W} height={H} style={{display:"block",background:BG}}>
      <rect width={W} height={H} fill={BG}/>
      <rect x={0} y={110} width={W} height={540} fill="#0b1020"/>
      <rect x={0} y={300} width={W} height={180} fill="#071508" opacity={0.6}/>
      <line x1={0} y1={110} x2={W} y2={110} stroke="#5a4a2a" strokeWidth={2} strokeDasharray="6,4"/>
      <text x={8} y={106} fill="#5a4a2a" fontSize={7} fontFamily="monospace">SUPERFICIE</text>
      <text x={8} y={148} fill={DIM} fontSize={6.5} fontFamily="monospace">Fm. Superficial</text>
      <text x={8} y={335} fill="#0f3018" fontSize={6.5} fontFamily="monospace">* Yacimiento</text>
      {[0.25,0.5,0.75,1].map(function(f,i){
        var y=dy(maxD*f);
        return <g key={i}><line x1={0} y1={y} x2={7} y2={y} stroke={DIM} strokeWidth={1}/><text x={9} y={y+3} fill={DIM} fontSize={6} fontFamily="monospace">{Math.round(maxD*f)}m</text></g>;
      })}
      {[[44,5,260],[32,4,350],[22,3.5,H-60]].map(function(a,i){
        return <g key={i}>
          <rect x={cx-a[0]} y={110} width={a[1]} height={a[2]-110} fill="#141c2c" stroke={DIM} strokeWidth={0.8}/>
          <rect x={cx+a[0]-a[1]} y={110} width={a[1]} height={a[2]-110} fill="#141c2c" stroke={DIM} strokeWidth={0.8}/>
        </g>;
      })}
      {tuberias.length===0
        ?<rect x={cx-7} y={110} width={14} height={540} fill="#050c14" stroke={ACC} strokeWidth={1.5}/>
        :tuberias.map(function(t,i){
          var od=parseFloat(t.od)||2.875, w=Math.max(od*3.6,7);
          var y1=i===0?110:dy(+(tuberias[i-1].hasta)||0), y2=dy(+t.hasta||maxD*0.6);
          var col=[ACC,BLU,GRN,PNK][i%4];
          return <g key={t.id}>
            <rect x={cx-w} y={y1} width={w*2} height={y2-y1} fill="#050c14" stroke={col} strokeWidth={1.5}/>
            <text x={cx-w-3} y={(y1+y2)/2+3} fill={col} fontSize={6} textAnchor="end" fontFamily="monospace">{t.od}</text>
          </g>;
        })}
      {empacadoras.map(function(e,i){
        var y=dy(+e.prof||400), col=[PNK,ACC,GRN,BLU][i%4];
        return <g key={e.id}>
          <polygon points={(cx-22)+","+y+" "+(cx+22)+","+y+" "+(cx+16)+","+(y+13)+" "+(cx-16)+","+(y+13)} fill={col} stroke={BG} strokeWidth={1.5}/>
          <text x={cx+28} y={y+9} fill={col} fontSize={6.5} fontFamily="monospace">{(e.tipo||"EMP").slice(0,11)}</text>
          <text x={cx+28} y={y+17} fill={MUT} fontSize={5.5} fontFamily="monospace">{e.prof}m</text>
        </g>;
      })}
      {mandriles.map(function(m,i){
        var y=dy(+m.prof||300);
        return <g key={m.id}>
          <rect x={cx-13} y={y-7} width={26} height={14} rx={3} fill="#0c1a2e" stroke={BLU} strokeWidth={1.2}/>
          <text x={cx} y={y+4} fill={BLU} fontSize={6} textAnchor="middle" fontFamily="monospace">{(m.tipo||"MDL").split(" ").map(function(w){return w[0]||"";}).join("").slice(0,4)}</text>
          <text x={cx-20} y={y+18} fill={MUT} fontSize={5.5} fontFamily="monospace">{m.prof}m</text>
        </g>;
      })}
      {intervalos.map(function(iv,i){
        var yT=dy(+iv.tope||500), yB=dy(+iv.base||550), h=Math.max(yB-yT,18);
        var col=pCols[i%pCols.length], rows=Math.max(2,Math.floor(h/14));
        var perfs=[];
        for(var r=0;r<rows;r++){var py=yT+(r+0.5)*(h/rows);perfs.push(<g key={r}><line x1={cx-8} y1={py} x2={cx-26} y2={py} stroke={col} strokeWidth={2}/><circle cx={cx-28} cy={py} r={2} fill={col}/><line x1={cx+8} y1={py} x2={cx+26} y2={py} stroke={col} strokeWidth={2}/><circle cx={cx+28} cy={py} r={2} fill={col}/></g>);}
        return <g key={iv.id}>{perfs}
          <text x={cx+36} y={yT+h/2+3} fill={col} fontSize={7} fontFamily="monospace">{iv.arena||("Int."+(i+1))}</text>
          <text x={cx} y={yT+h/2+4} fill={col} fontSize={11} textAnchor="middle" opacity={0.8}>^</text>
        </g>;
      })}
      {lift.tipo==="BES"&&lift.profMotor?<g><rect x={cx-9} y={dy(+lift.profMotor)-28} width={18} height={32} rx={2} fill="#150e2e" stroke={PUR} strokeWidth={1.5}/><text x={cx+15} y={dy(+lift.profMotor)-12} fill={PUR} fontSize={6} fontFamily="monospace">BES</text></g>:null}
      {lift.tipo==="PCP"&&lift.profBomba?<g><rect x={cx-8} y={dy(+lift.profBomba)-22} width={16} height={26} rx={2} fill="#1a0800" stroke={ORG} strokeWidth={1.5}/><text x={cx+14} y={dy(+lift.profBomba)-9} fill={ORG} fontSize={6} fontFamily="monospace">PCP</text></g>:null}
      <rect x={cx-17} y={86} width={34} height={26} rx={2} fill="#111828" stroke={DIM} strokeWidth={1.5}/>
      {sup.arbol?<g>
        <rect x={cx-12} y={52} width={24} height={36} rx={2} fill="#0a1a30" stroke={BLU} strokeWidth={1.5}/>
        <rect x={cx-30} y={60} width={18} height={8} rx={1} fill="#0a1a30" stroke={BLU} strokeWidth={1}/>
        <rect x={cx+12} y={60} width={18} height={8} rx={1} fill="#0a1a30" stroke={BLU} strokeWidth={1}/>
        <circle cx={cx-21} cy={64} r={3.5} fill="#0f3a90" stroke={BLU} strokeWidth={1}/>
        <circle cx={cx+21} cy={64} r={3.5} fill="#0f3a90" stroke={BLU} strokeWidth={1}/>
        <rect x={cx-4} y={34} width={8} height={20} fill="#0a1a30" stroke={BLU} strokeWidth={1}/>
        <text x={cx} y={29} fill={BLU} fontSize={7} textAnchor="middle" fontFamily="monospace">XMT</text>
      </g>:null}
      {lift.tipo==="Bombeo Mecanico"?<g>
        <line x1={cx} y1={86} x2={cx} y2={20} stroke={ACC} strokeWidth={2.5}/>
        <line x1={cx} y1={20} x2={cx+55} y2={40} stroke={ACC} strokeWidth={2.5}/>
        <line x1={cx} y1={20} x2={cx-36} y2={34} stroke={ACC} strokeWidth={2}/>
        <rect x={cx+38} y={34} width={26} height={12} rx={2} fill="#200d00" stroke={ACC} strokeWidth={1.5}/>
        <text x={cx} y={13} fill={ACC} fontSize={6.5} textAnchor="middle" fontFamily="monospace">B/M</text>
      </g>:null}
      {sup.choke?<g>
        <rect x={cx-66} y={57} width={20} height={12} rx={3} fill="#160820" stroke={PUR} strokeWidth={1.2}/>
        <line x1={cx-46} y1={63} x2={cx-30} y2={63} stroke={PUR} strokeWidth={1.5}/>
        <text x={cx-56} y={52} fill={PUR} fontSize={6} textAnchor="middle" fontFamily="monospace">CHK</text>
      </g>:null}
      {sup.sep?<g>
        <ellipse cx={cx+76} cy={64} rx={16} ry={26} fill="#041010" stroke={GRN} strokeWidth={1.5}/>
        <line x1={cx+30} y1={62} x2={cx+60} y2={62} stroke={GRN} strokeWidth={1.5} strokeDasharray="3,2"/>
        <text x={cx+76} y={110} fill={GRN} fontSize={6} textAnchor="middle" fontFamily="monospace">SEP</text>
      </g>:null}
      {sup.manoms?<g>
        <circle cx={cx-18} cy={94} r={4} fill="none" stroke={ACC} strokeWidth={1}/>
        <text x={cx-18} y={103} fill={ACC} fontSize={5} textAnchor="middle" fontFamily="monospace">TP</text>
        <circle cx={cx+18} cy={94} r={4} fill="none" stroke={MUT} strokeWidth={1}/>
        <text x={cx+18} y={103} fill={MUT} fontSize={5} textAnchor="middle" fontFamily="monospace">TR</text>
      </g>:null}
    </svg>
  );
}

// ─── LISTA DE POZOS (DB) ──────────────────────────────────────────────────────
function ListaPozos(p) {
  var pozos=p.pozos, onLoad=p.onLoad, onDelete=p.onDelete, onNew=p.onNew;
  return <div>
    <SH label="BASE DE DATOS - POZOS GUARDADOS" col={ACC}/>
    {pozos.length===0
      ?<div style={{textAlign:"center",padding:"30px 0",color:MUT,fontSize:10}}>
        No hay pozos guardados.<br/>Crea uno nuevo para comenzar.
       </div>
      :pozos.map(function(pozo){
        return <Card key={pozo.id} col={ACC+"40"}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div style={{flex:1}}>
              <div style={{fontSize:13,color:ACC,fontWeight:"bold",marginBottom:3}}>{pozo.info.nombre||"Sin nombre"}</div>
              <div style={{fontSize:9,color:MUT}}>{[pozo.info.campo,pozo.info.cuenca,pozo.info.td?"TD "+pozo.info.td+"m":""].filter(Boolean).join(" / ")}</div>
              <div style={{fontSize:8,color:DIM,marginTop:4}}>
                {pozo.tuberias.length} tramos | {pozo.empacadoras.length} empacadoras | {pozo.intervalos.length} intervalos | {pozo.lift.tipo}
              </div>
              <div style={{fontSize:7,color:DIM,marginTop:2}}>Guardado: {pozo.fecha}</div>
            </div>
            <div style={{display:"flex",gap:6,marginLeft:8,flexShrink:0}}>
              <Btn onClick={function(){onLoad(pozo);}} col={GRN} sm>Cargar</Btn>
              <Btn onClick={function(){onDelete(pozo.id);}} col={RED} sm>Borrar</Btn>
            </div>
          </div>
        </Card>;
      })}
    <AddBtn onClick={onNew} col={ACC} label="+ Nuevo pozo"/>
  </div>;
}

// ─── PDF EXPORT ───────────────────────────────────────────────────────────────
function exportPDF(info, svgRef) {
  try {
    var svgEl = svgRef.current;
    if(!svgEl) { alert("Primero abre el diagrama"); return; }
    var svgData = new XMLSerializer().serializeToString(svgEl);
    var svgBlob = new Blob([svgData], {type:"image/svg+xml;charset=utf-8"});
    var url = URL.createObjectURL(svgBlob);
    var img = new Image();
    img.onload = function() {
      var canvas = document.createElement("canvas");
      canvas.width = 320 * 3; canvas.height = 680 * 3;
      var ctx = canvas.getContext("2d");
      ctx.fillStyle = "#07090f";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      var pdfW = 595, pdfH = 842;
      var imgW = 320, imgH = 680;
      var scale = Math.min((pdfW - 80) / imgW, (pdfH - 120) / imgH);
      var dw = imgW * scale, dh = imgH * scale;
      var ox = (pdfW - dw) / 2, oy = 80;
      var dataUrl = canvas.toDataURL("image/png", 1.0);
      var pdf = [
        "%PDF-1.4",
        "1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj",
        "2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj",
        "3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 "+pdfW+" "+pdfH+"]",
        "/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>/XObject<</Im1 6 0 R>>>>>>endobj"
      ];
      var nombre = info.nombre || "Pozo";
      var campo = info.campo || "";
      var fecha = new Date().toLocaleDateString();
      var streamContent = "BT /F1 14 Tf 40 "+(pdfH-40)+" Td (DIAGRAMA MECANICO DE COMPLETACION) Tj ET\n";
      streamContent += "BT /F1 10 Tf 40 "+(pdfH-58)+" Td (Pozo: "+nombre+"   Campo: "+campo+"   Fecha: "+fecha+") Tj ET\n";
      streamContent += "q "+dw+" 0 0 "+dh+" "+ox+" "+(pdfH-oy-dh)+" cm /Im1 Do Q\n";
      var b64 = dataUrl.split(",")[1];
      var imgBytes = atob(b64);
      var imgLen = imgBytes.length;
      pdf.push("4 0 obj<</Length "+(streamContent.length)+">>stream\n"+streamContent+"\nendstream endobj");
      pdf.push("5 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj");
      pdf.push("6 0 obj<</Type/XObject/Subtype/Image/Width "+(canvas.width)+"/Height "+(canvas.height)+"/ColorSpace/DeviceRGB/BitsPerComponent 8/Filter/DCTDecode/Length "+imgLen+">>stream");
      var allParts = pdf.join("\n")+"\n";
      var finalBlob = new Blob([allParts, imgBytes, "\nendstream endobj\n%%EOF"], {type:"application/pdf"});
      var a = document.createElement("a");
      a.href = URL.createObjectURL(finalBlob);
      a.download = "Completacion_"+(nombre.replace(/\s+/g,"_")||"pozo")+".pdf";
      a.click();
    };
    img.src = url;
  } catch(e) {
    var svgEl2 = svgRef.current;
    if(!svgEl2) return;
    var svgData2 = new XMLSerializer().serializeToString(svgEl2);
    var blob = new Blob([svgData2], {type:"image/svg+xml"});
    var a2 = document.createElement("a");
    a2.href = URL.createObjectURL(blob);
    a2.download = "Completacion_"+(info.nombre||"pozo").replace(/\s+/g,"_")+".svg";
    a2.click();
  }
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
var EMPTY = function() { return { info:{}, tuberias:[], empacadoras:[], mandriles:[], lift:{tipo:"Flujo Natural"}, intervalos:[], sup:{arbol:true,cabezal:true} }; };

export default function App() {
  var [view, setView] = useState("lista");
  var [sec, setSec] = useState("info");
  var [pozos, setPozos] = useState([]);
  var [current, setCurrent] = useState(EMPTY());
  var [toast, setToast] = useState("");
  var svgRef = useRef(null);

  var info=current.info, tuberias=current.tuberias, emps=current.empacadoras, mnds=current.mandriles, lift=current.lift, ints=current.intervalos, sup=current.sup;
  function setInfo(fn){setCurrent(function(c){return Object.assign({},c,{info:fn(c.info)});});}
  function setTub(fn){setCurrent(function(c){return Object.assign({},c,{tuberias:fn(c.tuberias)});});}
  function setEmp(fn){setCurrent(function(c){return Object.assign({},c,{empacadoras:fn(c.empacadoras)});});}
  function setMnd(fn){setCurrent(function(c){return Object.assign({},c,{mandriles:fn(c.mandriles)});});}
  function setLift(fn){setCurrent(function(c){return Object.assign({},c,{lift:typeof fn==="function"?fn(c.lift):fn});});}
  function setInts(fn){setCurrent(function(c){return Object.assign({},c,{intervalos:fn(c.intervalos)});});}
  function setSup(fn){setCurrent(function(c){return Object.assign({},c,{sup:fn(c.sup)});});}

  useEffect(function(){
    window.storage.list("pozo:").then(function(r){
      if(!r||!r.keys||r.keys.length===0) return;
      var loaded=[];
      var pending=r.keys.length;
      r.keys.forEach(function(k){
        window.storage.get(k).then(function(res){
          if(res){try{loaded.push(JSON.parse(res.value));}catch(e){}}
          pending--;
          if(pending===0) setPozos(loaded.sort(function(a,b){return b.ts-a.ts;}));
        }).catch(function(){pending--;});
      });
    }).catch(function(){});
  },[]);

  function showToast(msg){setToast(msg);setTimeout(function(){setToast("");},2500);}

  function guardar(){
    var nombre=info.nombre||"Sin nombre";
    var id=current.id||uid();
    var pozo=Object.assign({},current,{id:id,fecha:new Date().toLocaleDateString(),ts:Date.now()});
    window.storage.set("pozo:"+id, JSON.stringify(pozo)).then(function(){
      setCurrent(function(c){return Object.assign({},c,{id:id});});
      setPozos(function(ps){
        var filtered=ps.filter(function(p){return p.id!==id;});
        return [pozo].concat(filtered);
      });
      showToast("Pozo guardado: "+nombre);
    }).catch(function(){showToast("Error al guardar");});
  }

  function cargar(pozo){setCurrent(pozo);setView("editor");setSec("info");showToast("Cargado: "+(pozo.info.nombre||""));}

  function borrar(id){
    window.storage.delete("pozo:"+id).then(function(){
      setPozos(function(ps){return ps.filter(function(p){return p.id!==id;});});
      showToast("Pozo eliminado");
    }).catch(function(){showToast("Error al eliminar");});
  }

  var counts={ info:0, tub:tuberias.length, emp:emps.length, mnd:mnds.length, lift:lift.tipo!=="Flujo Natural"?1:0, int:ints.length, sup:Object.values(sup).filter(Boolean).length, diagrama:0 };

  return (
    <div style={{maxWidth:460,margin:"0 auto",minHeight:"100vh",background:BG,color:TXT,fontFamily:"'Courier New',monospace",display:"flex",flexDirection:"column"}}>

      {toast&&<div style={{position:"fixed",top:16,left:"50%",transform:"translateX(-50%)",background:GRN+"20",border:"1px solid "+GRN,color:GRN,padding:"8px 18px",borderRadius:20,fontSize:10,zIndex:100,fontFamily:"monospace",boxShadow:"0 4px 20px #0008"}}>{toast}</div>}

      <div style={{padding:"10px 14px 8px",background:PANEL,borderBottom:"1px solid "+BORDER,position:"sticky",top:0,zIndex:20}}>
        <div style={{fontSize:7.5,color:ACC,letterSpacing:"3px",marginBottom:2}}>PDVSA - COMPLETACION DE POZOS</div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{fontSize:14,fontWeight:"bold",color:"#f0f4f8"}}>{view==="lista"?"BASE DE DATOS":"CONSTRUCTOR"}</div>
          <div style={{display:"flex",gap:6}}>
            {view==="editor"&&<Btn onClick={guardar} col={GRN} sm>GUARDAR</Btn>}
            {view==="editor"&&<Btn onClick={function(){setView("lista");}} col={MUT} sm>LISTA</Btn>}
            {view==="lista"&&<Btn onClick={function(){setCurrent(EMPTY());setView("editor");setSec("info");}} col={ACC} sm>NUEVO</Btn>}
          </div>
        </div>
        {view==="editor"&&info.nombre&&<div style={{fontSize:8.5,color:MUT,marginTop:2}}>{"> "+info.nombre+(info.campo?" / "+info.campo:"")}</div>}
      </div>

      {view==="lista"&&(
        <div style={{flex:1,overflowY:"auto",padding:"14px"}}>
          <ListaPozos pozos={pozos} onLoad={cargar} onDelete={borrar} onNew={function(){setCurrent(EMPTY());setView("editor");setSec("info");}}/>
        </div>
      )}

      {view==="editor"&&<>
        <div style={{overflowX:"auto",display:"flex",padding:"8px 10px",gap:5,background:"#090d14",borderBottom:"1px solid "+BORDER,scrollbarWidth:"none"}}>
          {SECTIONS.map(function(s){
            var on=sec===s.id, cnt=counts[s.id];
            return <button key={s.id} onClick={function(){setSec(s.id);}}
              style={{flexShrink:0,padding:"7px 10px",background:on?s.col+"18":"transparent",border:"1px solid "+(on?s.col:BORDER),borderRadius:7,color:on?s.col:MUT,fontSize:8,letterSpacing:"0.5px",cursor:"pointer",fontFamily:"monospace",whiteSpace:"nowrap",display:"flex",alignItems:"center",gap:4}}>
              {s.label}{cnt>0&&<span style={{padding:"1px 5px",background:s.col+"30",borderRadius:10,fontSize:7,color:s.col}}>{cnt}</span>}
            </button>;
          })}
        </div>

        <div style={{flex:1,overflowY:"auto",padding:"14px"}}>
          {sec==="info"     &&<TabInfo        d={info}       set={setInfo}/>}
          {sec==="tub"      &&<TabTuberia     rows={tuberias} setRows={setTub}/>}
          {sec==="emp"      &&<TabEmpacadoras rows={emps}     setRows={setEmp}/>}
          {sec==="mnd"      &&<TabMandriles   rows={mnds}     setRows={setMnd}/>}
          {sec==="lift"     &&<TabLift        lift={lift}     setLift={setLift}/>}
          {sec==="int"      &&<TabIntervalos  rows={ints}     setRows={setInts}/>}
          {sec==="sup"      &&<TabSuperficie  sup={sup}       setSup={setSup}/>}
          {sec==="diagrama" &&<div>
            <div style={{padding:"12px 14px",background:PANEL,border:"1px solid "+BORDER,borderRadius:8,marginBottom:12}}>
              <div style={{fontSize:15,color:ACC,fontWeight:"bold",marginBottom:4}}>{info.nombre||"-- Sin nombre --"}</div>
              <div style={{fontSize:9,color:MUT}}>{[info.campo,info.cuenca,info.td?"TD "+info.td+"m":""].filter(Boolean).join(" / ")}</div>
              <div style={{marginTop:8,display:"flex",gap:5,flexWrap:"wrap"}}>
                {tuberias.length>0&&<span style={{padding:"2px 8px",background:ACC+"18",border:"1px solid "+ACC+"40",borderRadius:20,fontSize:8,color:ACC}}>{tuberias.length} tramos tub.</span>}
                {emps.length>0&&<span style={{padding:"2px 8px",background:PNK+"18",border:"1px solid "+PNK+"40",borderRadius:20,fontSize:8,color:PNK}}>{emps.length} empacadoras</span>}
                {mnds.length>0&&<span style={{padding:"2px 8px",background:BLU+"18",border:"1px solid "+BLU+"40",borderRadius:20,fontSize:8,color:BLU}}>{mnds.length} mandriles</span>}
                {ints.length>0&&<span style={{padding:"2px 8px",background:GRN+"18",border:"1px solid "+GRN+"40",borderRadius:20,fontSize:8,color:GRN}}>{ints.length} intervalos</span>}
                <span style={{padding:"2px 8px",background:GRN+"18",border:"1px solid "+GRN+"40",borderRadius:20,fontSize:8,color:GRN}}>{lift.tipo}</span>
              </div>
            </div>
            <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
              <Btn onClick={guardar} col={GRN}>GUARDAR EN BD</Btn>
              <Btn onClick={function(){exportPDF(info,svgRef);}} col={ACC}>EXPORTAR PDF/SVG</Btn>
            </div>
            <div style={{background:PANEL,border:"1px solid "+ACC+"25",borderRadius:12,overflow:"hidden",display:"flex",justifyContent:"center"}}>
              <div ref={svgRef}>
                <DiagramaSVG info={info} tuberias={tuberias} empacadoras={emps} mandriles={mnds} lift={lift} intervalos={ints} sup={sup}/>
              </div>
            </div>
            <div style={{marginTop:10,display:"flex",gap:5,flexWrap:"wrap"}}>
              {[["#3a4a60","Revestimiento"],[ACC,"Tuberia"],[PNK,"Empacadora"],[BLU,"Mandril"],[GRN,"Intervalo"]].map(function(l){
                return <div key={l[1]} style={{display:"flex",alignItems:"center",gap:4,background:PANEL,border:"1px solid "+BORDER,borderRadius:20,padding:"3px 8px"}}>
                  <div style={{width:6,height:6,borderRadius:"50%",background:l[0]}}/><span style={{fontSize:8,color:MUT}}>{l[1]}</span>
                </div>;
              })}
            </div>
          </div>}
        </div>

        <div style={{padding:"9px 14px 13px",background:PANEL,borderTop:"1px solid "+BORDER,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontSize:7,color:BORDER}}>PDVSA - ING. COMPLETACION</span>
          <button onClick={function(){setSec("diagrama");}} style={{padding:"8px 16px",background:ACC+"20",border:"1px solid "+ACC,borderRadius:7,color:ACC,fontSize:9,fontFamily:"monospace",cursor:"pointer",fontWeight:"bold"}}>VER DIAGRAMA</button>
        </div>
      </>}
    </div>
  );
}
