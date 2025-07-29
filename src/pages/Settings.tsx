import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Users, Settings as SettingsIcon, ChevronRight } from "lucide-react";
import { TeamManagement } from "@/components/settings/TeamManagement";

type SettingsTab = 'teams' | 'general' | 'permissions';

const settingsMenuItems = [
  {
    key: 'teams' as SettingsTab,
    label: 'Gerenciamento de Equipes',
    icon: <Users className="h-4 w-4" />,
    description: 'Crie e gerencie equipes de trabalho'
  },
  {
    key: 'general' as SettingsTab,
    label: 'Configurações Gerais',
    icon: <SettingsIcon className="h-4 w-4" />,
    description: 'Configurações básicas do sistema'
  },
  {
    key: 'permissions' as SettingsTab,
    label: 'Permissões',
    icon: <SettingsIcon className="h-4 w-4" />,
    description: 'Gerencie permissões e acessos'
  }
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('teams');

  const renderContent = () => {
    switch (activeTab) {
      case 'teams':
        return <TeamManagement />;
      case 'general':
        return (
          <div className="flex items-center justify-center h-96 text-muted-foreground">
            <div className="text-center">
              <SettingsIcon className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Configurações Gerais</h3>
              <p>Em desenvolvimento</p>
            </div>
          </div>
        );
      case 'permissions':
        return (
          <div className="flex items-center justify-center h-96 text-muted-foreground">
            <div className="text-center">
              <SettingsIcon className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Permissões</h3>
              <p>Em desenvolvimento</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Menu lateral de configurações */}
      <div className="w-80 border-r border-border bg-card">
        <div className="p-6 border-b border-border">
          <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie as configurações da plataforma
          </p>
        </div>
        
        <div className="p-4 space-y-2">
          {settingsMenuItems.map((item) => (
            <Button
              key={item.key}
              variant="ghost"
              onClick={() => setActiveTab(item.key)}
              className={cn(
                "w-full justify-start h-auto p-4 hover:bg-accent transition-colors",
                activeTab === item.key && "bg-accent text-accent-foreground font-medium"
              )}
            >
              <div className="flex items-center gap-3 flex-1">
                {item.icon}
                <div className="text-left flex-1">
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs text-muted-foreground">{item.description}</div>
                </div>
                <ChevronRight className="h-4 w-4 opacity-50" />
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="flex-1 overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
}