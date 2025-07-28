import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatusBadge, PriorityBadge, TypeBadge } from "./StatusBadge";
import { useBacklog } from "@/context/BacklogContext";
import { BacklogGroup, BacklogItem } from "@/types/backlog";
import { ChevronDown, ChevronRight, MessageSquare, Calendar, Target, ArrowRight, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface BacklogTableProps {
  onItemClick: (item: BacklogItem) => void;
}

export function BacklogTable({ onItemClick }: BacklogTableProps) {
  const { groups, setGroups, moveItemToGroup } = useBacklog();
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(groups.filter(g => !g.collapsed).map(g => g.id))
  );

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getInitials = (name?: string) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleMoveToSprint = (item: BacklogItem, e: React.MouseEvent) => {
    e.stopPropagation();
    moveItemToGroup(item.id, 'current-sprint', 'doing');
    toast.success(`"${item.title}" movida para Sprint Atual`);
  };

  const handleCompleteTask = (item: BacklogItem, e: React.MouseEvent) => {
    e.stopPropagation();
    moveItemToGroup(item.id, 'done', 'done');
    toast.success(`"${item.title}" marcada como concluída`);
  };

  const getActionButton = (item: BacklogItem) => {
    // Botão "Mover para Sprint" - aparece em Backlog de Suporte
    if (item.groupId === 'support-backlog') {
      return (
        <Button
          size="sm"
          variant="outline"
          onClick={(e) => handleMoveToSprint(item, e)}
          className="flex items-center gap-1 text-xs"
        >
          <ArrowRight className="h-3 w-3" />
          Mover para Sprint
        </Button>
      );
    }
    
    // Botão "Concluir Tarefa" - aparece em Sprint Atual
    if (item.groupId === 'current-sprint') {
      return (
        <Button
          size="sm"
          variant="outline"
          onClick={(e) => handleCompleteTask(item, e)}
          className="flex items-center gap-1 text-xs text-green-600 border-green-200 hover:bg-green-50"
        >
          <CheckCircle className="h-3 w-3" />
          Concluir
        </Button>
      );
    }
    
    return null;
  };

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[300px] font-semibold">Tarefa</TableHead>
            <TableHead className="w-[150px] font-semibold">Responsável</TableHead>
            <TableHead className="w-[130px] font-semibold">Status</TableHead>
            <TableHead className="w-[120px] font-semibold">Prioridade</TableHead>
            <TableHead className="w-[140px] font-semibold">Tipo</TableHead>
            <TableHead className="w-[120px] font-semibold">Data Entrega</TableHead>
            <TableHead className="w-[100px] font-semibold">Pontos</TableHead>
            <TableHead className="w-[150px] font-semibold">Épico</TableHead>
            <TableHead className="w-[150px] font-semibold">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {groups.map((group) => (
            <TableRowGroup
              key={group.id}
              group={group}
              isExpanded={expandedGroups.has(group.id)}
              onToggle={() => toggleGroup(group.id)}
              onItemClick={onItemClick}
              formatDate={formatDate}
              getInitials={getInitials}
              getActionButton={getActionButton}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

interface TableRowGroupProps {
  group: BacklogGroup;
  isExpanded: boolean;
  onToggle: () => void;
  onItemClick: (item: BacklogItem) => void;
  formatDate: (date?: string) => string;
  getInitials: (name?: string) => string;
  getActionButton: (item: BacklogItem) => React.ReactNode;
}

function TableRowGroup({ 
  group, 
  isExpanded, 
  onToggle, 
  onItemClick, 
  formatDate, 
  getInitials,
  getActionButton
}: TableRowGroupProps) {
  return (
    <>
      {/* Group Header Row */}
      <TableRow className="bg-muted/30 hover:bg-muted/50 border-l-4" style={{ borderLeftColor: group.color }}>
        <TableCell colSpan={9}>
          <Button
            variant="ghost"
            onClick={onToggle}
            className="flex items-center gap-2 p-0 h-auto font-semibold text-foreground hover:bg-transparent"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
            <div 
              className="h-3 w-3 rounded-full" 
              style={{ backgroundColor: group.color }}
            />
            {group.title}
            <Badge variant="secondary" className="ml-2">
              {group.items.length}
            </Badge>
          </Button>
        </TableCell>
      </TableRow>

      {/* Group Items */}
      {isExpanded && group.items.map((item) => (
        <TableRow 
          key={item.id} 
          className="hover:bg-muted/30 cursor-pointer transition-colors"
          onClick={() => onItemClick(item)}
        >
          <TableCell className="font-medium">
            <div className="space-y-1">
              <div className="font-medium text-foreground">{item.title}</div>
              {item.description && (
                <div className="text-sm text-muted-foreground line-clamp-2">
                  {item.description}
                </div>
              )}
            </div>
          </TableCell>
          
          <TableCell>
            {item.assignee ? (
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                    {getInitials(item.assignee)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">{item.assignee}</span>
              </div>
            ) : (
              <span className="text-muted-foreground text-sm">Não atribuído</span>
            )}
          </TableCell>
          
          <TableCell>
            <StatusBadge status={item.status} />
          </TableCell>
          
          <TableCell>
            <PriorityBadge priority={item.priority} />
          </TableCell>
          
          <TableCell>
            <TypeBadge type={item.type} />
          </TableCell>
          
          <TableCell>
            <div className="flex items-center gap-1 text-sm">
              <Calendar className="h-3 w-3 text-muted-foreground" />
              {formatDate(item.dueDate)}
            </div>
          </TableCell>
          
          <TableCell>
            <div className="flex items-center gap-1">
              <Target className="h-3 w-3 text-muted-foreground" />
              <span className="text-sm">{item.estimate || '-'}</span>
            </div>
          </TableCell>
          
          <TableCell>
            <span className="text-sm text-muted-foreground">{item.epic || '-'}</span>
          </TableCell>
          
          <TableCell>
            <div className="flex items-center gap-2">
              {item.comments.length > 0 && (
                <Badge variant="outline" className="text-xs">
                  <MessageSquare className="h-3 w-3 mr-1" />
                  {item.comments.length}
                </Badge>
              )}
              {getActionButton(item)}
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}