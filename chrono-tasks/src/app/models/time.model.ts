export interface Time {
  id: string;
  description: string;
  begin_date: string;
  end_date: string | null;
  spent_time: number;
}
