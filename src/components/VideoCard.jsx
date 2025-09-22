import React from "react";

export default function VideoCard({video}){
  return (
    <div className="card" style={{padding:12}}>
      <div style={{fontWeight:700,color:"var(--pca-blue)"}}>{video.title}</div>
      <div className="small muted" style={{marginBottom:8}}>{video.description}</div>
      <div style={{position:'relative',paddingTop:'56%'}}>
        <iframe title={video.title} src={`https://www.youtube.com/embed/${video.youtubeId}`} style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',border:0,borderRadius:8}} allowFullScreen />
      </div>
      <a href={video.url} target="_blank" rel="noreferrer" style={{marginTop:8,display:'inline-block'}} className="small muted">Abrir en YouTube</a>
    </div>
  );
}
