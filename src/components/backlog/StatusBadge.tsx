import { Badge } from "@/components/ui/badge";
import { TaskStatus, TaskPriority, TaskType } from "@/types/backlog";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: TaskStatus;
  className?: string;
}

interface PriorityBadgeProps {
  priority: TaskPriority;
  className?: string;
}

interface TypeBadgeProps {
  type: TaskType;
  className?: string;
}

const statusConfig = {
  todo: { label: 'A Fazer', bg: 'bg-status-todo', text: 'text-status-todo-foreground' },
  doing: { label: 'Em Progresso', bg: 'bg-status-doing', text: 'text-status-doing-foreground' },
  review: { label: 'Em Revisão', bg: 'bg-status-review', text: 'text-status-review-foreground' },
  done: { label: 'Concluído', bg: 'bg-status-done', text: 'text-status-done-foreground' },
};

const priorityConfig = {
  low: { label: 'Baixa', bg: 'bg-priority-low', text: 'text-priority-low-foreground' },
  medium: { label: 'Média', bg: 'bg-priority-medium', text: 'text-priority-medium-foreground' },
  high: { label: 'Alta', bg: 'bg-priority-high', text: 'text-priority-high-foreground' },
  critical: { label: 'Crítica', bg: 'bg-priority-critical', text: 'text-priority-critical-foreground' },
};

const typeConfig = {
  bug: { label: 'Bug', bg: 'bg-red-100', text: 'text-red-700' },
  feature: { label: 'Funcionalidade', bg: 'bg-blue-100', text: 'text-blue-700' },
  improvement: { label: 'Melhoria', bg: 'bg-green-100', text: 'text-green-700' },
  'technical-debt': { label: 'Débito Técnico', bg: 'bg-orange-100', text: 'text-orange-700' },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <Badge className={cn(config.bg, config.text, "border-0", className)}>
      {config.label}
    </Badge>
  );
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const config = priorityConfig[priority];
  
  return (
    <Badge className={cn(config.bg, config.text, "border-0", className)}>
      {config.label}
    </Badge>
  );
}

export function TypeBadge({ type, className }: TypeBadgeProps) {
  const config = typeConfig[type];
  
  return (
    <Badge className={cn(config.bg, config.text, "border-0", className)}>
      {config.label}
    </Badge>
  );
}