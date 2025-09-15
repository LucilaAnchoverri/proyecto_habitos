import { useEffect, useState } from "react";

const Home = () => {

    const [habito, setHabito] = useState('');
    /* habito = almacena los valores - setHabito = funcion que llamamos para actualizar la variable*/

    // Estado para los habitos por hacer y los hechos
    const [toDoHabits, setToDoHabits] = useState<string[]>(() => {
        return JSON.parse(localStorage.getItem('toDoHabits') || '[]');
    });
    const [doneHabits, setDoneHabits] = useState<string[]>(() => {
        return JSON.parse(localStorage.getItem('doneHabits') || '[]');
    });

    function nuevoHabito () {
        if (habito.trim() === "") return; 
        setToDoHabits([...toDoHabits, habito]); //copia todos los habitos y agrega 1 al final
        setHabito("");
    }

    // Mover de To do a Done
    function marcarComoHecho(index: number) {
        const habitoHecho = toDoHabits[index];
        setToDoHabits(toDoHabits.filter((_, i) => i !== index));
        setDoneHabits([...doneHabits, habitoHecho]);
    }

      // Desmarcar hábito hecho (vuelve a To do)
    function desmarcarComoHecho(index: number) {
        const habitoPendiente = doneHabits[index];
        setDoneHabits(doneHabits.filter((_, i) => i !== index));
        setToDoHabits([...toDoHabits, habitoPendiente]);
    }

    useEffect(() => {
        localStorage.setItem('toDoHabits', JSON.stringify(toDoHabits));
        localStorage.setItem('doneHabits', JSON.stringify(doneHabits));
    }, [toDoHabits, doneHabits]);

    // Evita división por cero y calcula el porcentaje de hábitos completados
    const totalHabitos = toDoHabits.length + doneHabits.length;
    const habitosCompletados = doneHabits.length;
    const porcentajeCompletado = totalHabitos > 0 ? (habitosCompletados / totalHabitos) * 100 : 0;

   return (
   <main>
        <h1> My good habits</h1>
        <div className="new_habit">
            <input 
                type="text" 
                placeholder="Ingresa tu habito" 
                className="input_habit" 
                value={habito}
                onChange={(e) => setHabito(e.target.value)} // Actualiza "habito" cada vez que escribis
            />
            <button onClick={nuevoHabito}>new habit</button>
        </div>

        <h2>To do</h2>
        <div className="toDo_doneHabits">
            <ul >
                {toDoHabits.map((h, index) => (
                    <li className="habit_list" key={index}>
                        <input type="checkbox" 
                        onChange={() => marcarComoHecho(index)}
                        />
                        <span>{h}</span>
                    </li>
                ))
                
                }
            </ul>
        </div>
        <h2>Done!</h2>
        <div className="toDo_doneHabits">
            <ul>
                {doneHabits.map((h, index) => (
                    <li className="habit_list" key={index}>
                        <input type="checkbox" 
                        checked 
                        onChange={() => desmarcarComoHecho(index)}
                        />
                        <span>{h}</span>
                    </li>
                ))}
            </ul>
        </div>
        <h3> Porcentaje de habitos que completaste:</h3>
        <div className="circle_container">
              <svg className="svg_tag">
                <circle className="circle_bg" r="75" cx="50%" cy="50%"></circle>
                <circle className="circle" r="75" cx="50%" cy="50%"
                    style={{
                    strokeDasharray: 2 * Math.PI * 75, // Circunferencia del círculo
                    strokeDashoffset: 
                        2 * Math.PI * 75 - (2 * Math.PI * 75 * porcentajeCompletado) / 100,
                    }} // Relleno del círculo basado en el porcentaje
                ></circle>
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="circle_text">
                    {Math.round(porcentajeCompletado)}% 
                </text>
                </svg>

        </div>
   </main>
   );
};
export default Home;