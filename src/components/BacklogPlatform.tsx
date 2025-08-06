import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sidebar } from "./layout/Sidebar";
import { BacklogTable } from "./backlog/BacklogTable";
import { KanbanView } from "./backlog/KanbanView";
import { IdeaSubmissionForm } from "./forms/IdeaSubmissionForm";
import { SupportBacklogForm } from "./forms/SupportBacklogForm";
import { ItemDetailModal } from "./modals/ItemDetailModal";
import { BacklogProvider, useBacklog } from "@/context/BacklogContext";
import { BacklogItem } from "@/types/backlog";
import { Calendar, BarChart3 } from "lucide-react";

function BacklogPlatformContent() {
  const { currentView } = useBacklog();
  const [isIdeaFormOpen, setIsIdeaFormOpen] = useState(false);
  const [isSupportFormOpen, setIsSupportFormOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<BacklogItem | null>(null);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'table':
        return <BacklogTable onItemClick={setSelectedItem} />;
      case 'kanban':
        return <KanbanView onItemClick={setSelectedItem} />;
      case 'calendar':
        return (
          <div className="flex items-center justify-center h-96 text-muted-foreground">
            <div className="text-center">
              <Calendar className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Visão Calendário</h3>
              <p>Em desenvolvimento - Aqui serão exibidas as tarefas em formato de calendário </p>
            </div>
          </div>
        );
      default:
        return <BacklogTable onItemClick={setSelectedItem} />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar 
        onOpenIdeaForm={() => setIsIdeaFormOpen(true)}
        onOpenSupportForm={() => setIsSupportFormOpen(true)}
        onOpenFilters={() => setIsFiltersOpen(true)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-card border-b border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {currentView === 'table' && 'Visão Tabela'}
                {currentView === 'kanban' && 'Quadro Kanban'}
                {currentView === 'calendar' && 'Calendário'}
              </h1>
              <p className="text-muted-foreground mt-1">
                Gerencie seu backlog de desenvolvimento de forma visual e colaborativa
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={() => setIsSupportFormOpen(true)}
                variant="outline"
                className="border-orange-200 text-orange-600 hover:bg-orange-50"
              >
                Backlog Suporte
              </Button>
              <Button 
                onClick={() => setIsIdeaFormOpen(true)}
                className="bg-gradient-to-r from-monday-blue to-monday-purple hover:opacity-90"
              >
                Nova Ideia
              </Button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">
          {renderCurrentView()}
        </div>
      </div>

      {/* Idea Submission Modal */}
      <Dialog open={isIdeaFormOpen} onOpenChange={setIsIdeaFormOpen}>
        <DialogContent className="max-w-2xl">
          <IdeaSubmissionForm onClose={() => setIsIdeaFormOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Support Backlog Modal */}
      <Dialog open={isSupportFormOpen} onOpenChange={setIsSupportFormOpen}>
        <DialogContent className="max-w-2xl">
          <SupportBacklogForm 
            onSuccess={() => setIsSupportFormOpen(false)}
            onCancel={() => setIsSupportFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Item Detail Modal */}
      <ItemDetailModal
        item={selectedItem}
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
      />

      {/* Filters Modal (placeholder) */}
      <Dialog open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
        <DialogContent>
          <div className="text-center py-8">
            <h3 className="text-lg font-medium mb-2">Filtros Avançados</h3>
            <p className="text-muted-foreground">
              Sistema de filtros em desenvolvimento
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function BacklogPlatform() {
  return (
    <BacklogProvider>
      <BacklogPlatformContent />
    </BacklogProvider>
  );
}