export interface Time {
  id: string;
  description: string;
  begin_date: string;
  end_date: string; // API real usa string vacío "" para tiempos activos, no null
  spent_time: number; // En horas (decimal), no segundos
}
