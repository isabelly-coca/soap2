// src/utils/verificarVencimentos.js
export default function verificarVencimentos(tarefas) {
  if (!Array.isArray(tarefas)) return { vencidas: [], proximas: [] };

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const vencidas = [];
  const proximas = [];

  tarefas.forEach((tarefa) => {
    if (!tarefa.data) return;

    let dataTarefa = new Date(tarefa.data);

    // Se a data for inválida, tenta converter de DD/MM/YYYY para YYYY-MM-DD
    if (isNaN(dataTarefa)) {
      const partes = tarefa.data.split("/");
      if (partes.length === 3) {
        // ano, mês-1, dia
        dataTarefa = new Date(partes[2], partes[1] - 1, partes[0]);
      } else {
        return; // formato inválido
      }
    }

    dataTarefa.setHours(0, 0, 0, 0);

    const diffDias = Math.floor((dataTarefa - hoje) / (1000 * 60 * 60 * 24));

    if (diffDias < 0) {
      vencidas.push(tarefa);
    } else if (diffDias <= 3) {
      proximas.push(tarefa);
    }
  });

  return { vencidas, proximas };
}

