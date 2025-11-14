export function verificarVencimentos(tarefas) {
  const hoje = new Date();
  const vencidas = [];
  const proximas = [];

  tarefas.forEach(tarefa => {
    const dataTarefa = new Date(tarefa.data);

    if (dataTarefa < hoje) {
      vencidas.push(tarefa);
    } else {
      const diff = dataTarefa - hoje;
      const dias = diff / (1000 * 60 * 60 * 24);

      if (dias <= 1) {
        proximas.push(tarefa);
      }
    }
  });

  return { vencidas, proximas };
}
