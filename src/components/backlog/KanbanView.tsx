import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatusBadge, PriorityBadge, TypeBadge } from "./StatusBadge";
import { useBacklog } from "@/context/BacklogContext";
import { BacklogItem, TaskStatus } from "@/types/backlog";
import { Calendar, MessageSquare, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface KanbanViewProps {
  onItemClick: (item: BacklogItem) => void;
}

const statusColumns: { status: TaskStatus; title: string; color: string }[] = [
  { status: 'todo', title: 'A Fazer', color: '#6366f1' },
  { status: 'doing', title: 'Em Progresso', color: '#f59e0b' },
  { status: 'review', title: 'Em Revisão', color: '#eab308' },
  { status: 'done', title: 'Concluído', color: '#10b981' },
];

export function KanbanView({ onItemClick }: KanbanViewProps) {
  const { groups, updateItemStatus } = useBacklog();
  const [draggedItem, setDraggedItem] = useState<BacklogItem | null>(null);

  // Flatten all items from all groups
  const allItems = groups.reduce((acc, group) => [...acc, ...group.items], [] as BacklogItem[]);

  const getItemsByStatus = (status: TaskStatus) => {
    return allItems.filter(item => item.status === status);
  };

  const handleDragStart = (e: React.DragEvent, item: BacklogItem) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    if (draggedItem && draggedItem.status !== status) {
      updateItemStatus(draggedItem.id, status);
    }
    setDraggedItem(null);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit' 
    });
  };

  const getInitials = (name?: string) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="flex gap-6 h-full overflow-x-auto pb-4">
      {statusColumns.map((column) => {
        const items = getItemsByStatus(column.status);
        
        return (
          <div
            key={column.status}
            className="flex-shrink-0 w-80"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.status)}
          >
            {/* Column Header */}
            <div className="mb-4 p-4 bg-card rounded-lg border border-border shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="h-3 w-3 rounded-full" 
                    style={{ backgroundColor: column.color }}
                  />
                  <h3 className="font-semibold text-foreground">{column.title}</h3>
                  <Badge variant="secondary">{items.length}</Badge>
                </div>
                <Button variant="ghost" size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Column Items */}
            <div className="space-y-3 min-h-[400px]">
              {items.map((item) => (
                <KanbanCard
                  key={item.id}
                  item={item}
                  onItemClick={onItemClick}
                  onDragStart={handleDragStart}
                  formatDate={formatDate}
                  getInitials={getInitials}
                  isDragging={draggedItem?.id === item.id}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

interface KanbanCardProps {
  item: BacklogItem;
  onItemClick: (item: BacklogItem) => void;
  onDragStart: (e: React.DragEvent, item: BacklogItem) => void;
  formatDate: (date?: string) => string | null;
  getInitials: (name?: string) => string;
  isDragging: boolean;
}

function KanbanCard({ 
  item, 
  onItemClick, 
  onDragStart, 
  formatDate, 
  getInitials, 
  isDragging 
}: KanbanCardProps) {
  return (
    <Card
      className={`cursor-pointer transition-all duration-200 hover:shadow-md border border-border ${
        isDragging ? 'opacity-50 rotate-2 scale-105' : ''
      }`}
      draggable
      onDragStart={(e) => onDragStart(e, item)}
      onClick={() => onItemClick(item)}
    >
      <CardContent className="p-4">
        {/* Priority indicator */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className="font-medium text-foreground text-sm mb-2 line-clamp-2">
              {item.title}
            </h4>
          </div>
          <PriorityBadge priority={item.priority} className="ml-2 text-xs" />
        </div>

        {/* Description */}
        {item.description && (
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
            {item.description}
          </p>
        )}

        {/* Type badge */}
        <div className="mb-3">
          <TypeBadge type={item.type} className="text-xs" />
        </div>

        {/* Meta information */}
        <div className="space-y-2">
          {/* Due date */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            {item.dueDate && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(item.dueDate)}
              </div>
            )}
            <div className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              {item.comments.length}
            </div>
          </div>
          {/* Assignee */}
          <div className="flex items-center justify-between">
            {item.assignee ? (
              <div className="flex items-center gap-2">
                <Avatar className="h-5 w-5">
                  <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                    {getInitials(item.assignee)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground truncate">
                  {item.assignee}
                </span>
              </div>
            ) : (
              <div className="h-5" />
            )}
          </div>
        </div>

        {/* Epic */}
        {item.epic && (
          <div className="mt-2 pt-2 border-t border-border">
            <span className="text-xs text-muted-foreground">
              📋 {item.epic}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}