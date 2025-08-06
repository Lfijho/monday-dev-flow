import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  LayoutGrid, 
  Table2, 
  Calendar, 
  BarChart3, 
  Plus,
  Filter,
  Search,
  LogOut,
  Settings
} from "lucide-react";
import { useBacklog } from "@/context/BacklogContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const viewModes = [
  { key: 'table', label: 'Tabela', icon: <Table2 className="h-4 w-4" /> },
  { key: 'kanban', label: 'Kanban', icon: <LayoutGrid className="h-4 w-4" /> },
  { key: 'calendar', label: 'Calendário', icon: <Calendar className="h-4 w-4" /> },
];

export function Sidebar({ onOpenIdeaForm, onOpenSupportForm, onOpenFilters }) {
  const { currentView, setCurrentView } = useBacklog();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso."
    });
  };

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
            onClick={onOpenSupportForm}
            variant="outline"
            className="w-full border-orange-200 text-orange-600 hover:bg-orange-50"
          >
            <Plus className="h-4 w-4 mr-2" />
            Backlog Suporte
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
            
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={() => navigate('/settings')}
            >
              <Settings className="h-4 w-4 mr-2" />
              Configurações
            </Button>

            <Button 
              variant="ghost" 
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      {/* User Info */}
      {user && (
        <div className="p-4 border-t border-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-medium text-primary">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}