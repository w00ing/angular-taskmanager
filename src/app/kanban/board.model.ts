type TaskLabel = 'purple' | 'blue' | 'green' | 'yellow' | 'red' | 'gray';

export interface Task {
  description?: string;
  label?: TaskLabel;
}

export interface Board {
  id?: string;
  title?: string;
  priority?: number;
  tasks?: Task[];
}
