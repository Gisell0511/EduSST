import React, { useState, useContext } from "react";
import { ProgressContext } from "../../contexts/ProgressContext";

/*
  Dinámica: lista de términos a la izquierda (draggables),
  listas de definiciones objetivo a la derecha (drop zones).
  Estructura simple, suficiente como demo de interacción.
*/

const initialPairs = [
  { id: 't1', term: 'Peligro', target: 'd1' },
  { id: 't2', term: 'Riesgo', target: 'd2' },
  { id: 't3', term: 'EPP', target: 'd3' }
];

const definitions = [
  { id: 'd1', text: 'Situación con potencial de daño a la salud' },
  { id: 'd2', text: 'Probabilidad y severidad de que ocurra el daño' },
  { id: 'd3', text: 'Equipo de protección personal' }
];

export default function DragDropQuiz(){
  const [items, setItems] = useState(shuffle(initialPairs));
  const [dropped, setDropped] = useState({});
  const [completed, setCompleted] = useState(false);
  const { addPoints } = useContext(ProgressContext);

  function onDragStart(e, id){ e.dataTransfer.setData('text/plain', id) }

  function onDrop(e, defId){
    const id = e.dataTransfer.getData('text/plain');
    setDropped(prev => ({...prev, [id]: defId}));
  }

  function onFinish(){
    // comprobaremos pares correctos
    let correct = 0;
    initialPairs.forEach(p => {
      if(dropped[p.id] === p.target) correct++;
    });
    const gained = correct * 10;
    if(gained) addPoints(gained);
    setCompleted(true);
  }

  return (
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:18}}>
      <div className="card">
        <div className="small muted">Términos</div>
        <div style={{display:'flex',flexDirection:'column',gap:10,marginTop:12}}>
          {items.map(it => (
            <div key={it.id} draggable={!completed} onDragStart={(e)=>onDragStart(e, it.id)} className="option" style={{opacity: dropped[it.id] ? 0.5 : 1}}>
              {it.term}
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="small muted">Definiciones</div>
        <div style={{display:'flex',flexDirection:'column',gap:12,marginTop:12}}>
          {definitions.map(d => (
            <div key={d.id} onDragOver={(e)=>e.preventDefault()} onDrop={(e)=>onDrop(e,d.id)} className="option" style={{minHeight:64,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <div style={{flex:1}}>{d.text}</div>
              <div style={{width:120,textAlign:'right',opacity:0.7}}>{Object.entries(dropped).find(([k,v])=>v===d.id)?.[0] || '---'}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{gridColumn:'1 / -1',display:'flex',justifyContent:'flex-end',gap:12}}>
        <button className="btn" onClick={onFinish} disabled={completed}>Finalizar</button>
      </div>

      {completed && <div style={{gridColumn:'1 / -1',marginTop:12}} className="small muted">Pares correctos agregados a puntos automáticamente.</div>}
    </div>
  );
}

function shuffle(arr){ return [...arr].sort(()=>Math.random()-0.5) }
