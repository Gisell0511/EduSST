import React from "react";
import VideoCard from "../components/VideoCard";
import videos from "../data/videos";

export default function SupportMaterials(){
  return (
    <section className="card">
      <div className="section-title">Material de apoyo</div>
      <p className="small muted">Lista de recursos seleccionados (YouTube)</p>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:12,marginTop:16}}>
        {videos.map(v => <VideoCard key={v.id} video={v} />)}
      </div>
    </section>
  );
}
