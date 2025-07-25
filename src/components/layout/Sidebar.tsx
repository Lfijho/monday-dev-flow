import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  LayoutGrid, 
  Table2, 
  Calendar, 
  BarChart3, 
  Plus,
  Filter,
  Search
} from "lucide-react";
import { useBacklog } from "@/context/BacklogContext";
import { ViewMode } from "@/types/backlog";

const viewModes: { key: ViewMode; label: string; icon: React.ReactNode }[] = [
  { key: 'table', label: 'Tabela', icon: <Table2 className="h-4 w-4" /> },
  { key: 'kanban', label: 'Kanban', icon: <LayoutGrid className="h-4 w-4" /> },
  { key: 'calendar', label: 'Calendário', icon: <Calendar className="h-4 w-4" /> },
  { key: 'timeline', label: 'Timeline', icon: <BarChart3 className="h-4 w-4" /> },
];

interface SidebarProps {
  onOpenIdeaForm: () => void;
  onOpenFilters: () => void;
}

export function Sidebar({ onOpenIdeaForm, onOpenFilters }: SidebarProps) {
  const { currentView, setCurrentView } = useBacklog();

  return (
    <div className="w-64 bg-card border-r border-border h-full flex flex-col">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-2 mb-6">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-monday-blue to-monday-purple flex items-center justify-center">
            <LayoutGrid className="h-4 w-4 text-white" />
          </div>
          <h1 className="text-xl font-bold text-foreground">BacklogPro</h1>
        </div>
        
        <div className="space-y-2">
          <Button 
            onClick={onOpenIdeaForm}
            className="w-full bg-gradient-to-r from-monday-blue to-monday-purple hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Ideia
          </Button>
          
          <Button 
            variant="outline" 
            onClick={onOpenFilters}
            className="w-full"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
        </div>
      </div>

      <div className="p-6 flex-1">
        <h2 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
          Visualizações
        </h2>
        
        <div className="space-y-1">
          {viewModes.map((mode) => (
            <Button
              key={mode.key}
              variant="ghost"
              onClick={() => setCurrentView(mode.key)}
              className={cn(
                "w-full justify-start hover:bg-accent transition-colors",
                currentView === mode.key && "bg-accent text-accent-foreground font-medium"
              )}
            >
              {mode.icon}
              <span className="ml-2">{mode.label}</span>
            </Button>
          ))}
        </div>

        <div className="mt-8">
          <h2 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
            Ações Rápidas
          </h2>
          
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start">
              <Search className="h-4 w-4 mr-2" />
              Buscar Itens
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}