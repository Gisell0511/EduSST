import React from "react";
import DragDropQuiz from "../components/Quiz/DragDropQuiz";

export default function QuizPage(){
  return (
    <section className="card">
      <div className="section-title">Quizzes interactivos</div>
      <p className="small muted">Prueba: arrastra el término a su definición correcta</p>

      <div style={{marginTop:18}}>
        <DragDropQuiz />
      </div>
    </section>
  );
}
