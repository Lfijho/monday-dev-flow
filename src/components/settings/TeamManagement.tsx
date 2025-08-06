import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Users, Search, Trash2, Edit2, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Team, CreateTeamData } from "@/types/team";
import { CreateTeamModal } from "./CreateTeamModal";
import { AddMemberModal } from "./AddMemberModal";
import { useToast } from "@/hooks/use-toast";

// Mock data - será substituído por dados reais posteriormente
const mockTeams: Team[] = [
  {
    id: "1",
    name: "Desenvolvimento Frontend",
    description: "Equipe responsável pelo desenvolvimento da interface do usuário",
    members: [
      {
        id: "1",
        userId: "user1",
        userName: "João Silva",
        userEmail: "joao@empresa.com",
        role: "admin",
        joinedAt: "2024-01-15"
      },
      {
        id: "2",
        userId: "user2",
        userName: "Maria Santos",
        userEmail: "maria@empresa.com",
        role: "member",
        joinedAt: "2024-01-20"
      }
    ],
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20"
  },
  {
    id: "2",
    name: "QA & Testes",
    description: "Equipe responsável pela qualidade e testes da aplicação",
    members: [
      {
        id: "3",
        userId: "user3",
        userName: "Pedro Costa",
        userEmail: "pedro@empresa.com",
        role: "admin",
        joinedAt: "2024-01-10"
      }
    ],
    createdAt: "2024-01-10",
    updatedAt: "2024-01-10"
  }
];

export function TeamManagement() {
  const [teams, setTeams] = useState<Team[]>(mockTeams);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [editingTeamName, setEditingTeamName] = useState(false);
  const [editedName, setEditedName] = useState("");
  const { toast } = useToast();

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateTeam = (data: CreateTeamData) => {
    const newTeam: Team = {
      id: `team_${Date.now()}`,
      name: data.name,
      description: data.description,
      members: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setTeams(prev => [...prev, newTeam]);
    setSelectedTeam(newTeam);
    setIsCreateModalOpen(false);
    
    toast({
      title: "Equipe criada",
      description: `A equipe "${data.name}" foi criada com sucesso.`
    });
  };

  const handleRemoveMember = (memberId: string) => {
    if (!selectedTeam) return;

    const updatedTeam = {
      ...selectedTeam,
      members: selectedTeam.members.filter(member => member.id !== memberId),
      updatedAt: new Date().toISOString()
    };

    setTeams(prev => prev.map(team => 
      team.id === selectedTeam.id ? updatedTeam : team
    ));
    setSelectedTeam(updatedTeam);

    toast({
      title: "Membro removido",
      description: "O membro foi removido da equipe."
    });
  };

  const handleEditTeamName = () => {
    if (!selectedTeam) return;

    const updatedTeam = {
      ...selectedTeam,
      name: editedName,
      updatedAt: new Date().toISOString()
    };

    setTeams(prev => prev.map(team => 
      team.id === selectedTeam.id ? updatedTeam : team
    ));
    setSelectedTeam(updatedTeam);
    setEditingTeamName(false);

    toast({
      title: "Nome atualizado",
      description: "O nome da equipe foi atualizado com sucesso."
    });
  };

  const startEditingName = () => {
    if (selectedTeam) {
      setEditedName(selectedTeam.name);
      setEditingTeamName(true);
    }
  };

  return (
    <div className="flex h-full">
      {/* Painel Esquerdo - Lista de Equipes */}
      <div className="w-80 border-r border-border bg-card">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Equipes</h2>
            <Badge variant="secondary">{teams.length}</Badge>
          </div>
          
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:opacity-90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Criar Nova Equipe
          </Button>
        </div>

        <div className="p-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar equipes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="space-y-2">
            {filteredTeams.map((team) => (
              <Button
                key={team.id}
                variant="ghost"
                onClick={() => setSelectedTeam(team)}
                className={cn(
                  "w-full justify-start h-auto p-4 hover:bg-accent transition-colors",
                  selectedTeam?.id === team.id && "bg-accent text-accent-foreground"
                )}
              >
                <div className="flex items-center gap-3 flex-1 text-left">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{team.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {team.members.length} {team.members.length === 1 ? 'membro' : 'membros'}
                    </div>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Painel Direito - Detalhes da Equipe */}
      <div className="flex-1 bg-background">
        {selectedTeam ? (
          <div className="p-6 h-full overflow-auto">
            {/* Cabeçalho da equipe */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                {editingTeamName ? (
                  <div className="flex items-center gap-2 flex-1">
                    <Input
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="text-2xl font-bold h-auto py-1 px-2"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleEditTeamName();
                        if (e.key === 'Escape') setEditingTeamName(false);
                      }}
                      autoFocus
                    />
                    <Button size="sm" onClick={handleEditTeamName}>
                      Salvar
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setEditingTeamName(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold">{selectedTeam.name}</h1>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={startEditingName}
                      className="h-8 w-8 p-0"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              
              {selectedTeam.description && (
                <p className="text-muted-foreground">{selectedTeam.description}</p>
              )}
            </div>

            <Separator className="mb-6" />

            {/* Seção de membros */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Membros da Equipe
                  <Badge variant="secondary">{selectedTeam.members.length}</Badge>
                </h2>
                
                <Button 
                  onClick={() => setIsAddMemberModalOpen(true)}
                  size="sm"
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:opacity-90"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Adicionar Membro
                </Button>
              </div>

              {selectedTeam.members.length > 0 ? (
                <div className="space-y-3">
                  {selectedTeam.members.map((member) => (
                    <Card key={member.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                            <span className="text-sm font-medium text-white">
                              {member.userName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium">{member.userName}</div>
                            <div className="text-sm text-muted-foreground">{member.userEmail}</div>
                          </div>
                          <Badge variant={member.role === 'admin' ? 'default' : 'secondary'}>
                            {member.role === 'admin' ? 'Administrador' : 'Membro'}
                          </Badge>
                        </div>
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemoveMember(member.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">Nenhum membro na equipe</h3>
                  <p className="text-muted-foreground mb-4">
                    Adicione membros para começar a colaborar nesta equipe.
                  </p>
                  <Button 
                    onClick={() => setIsAddMemberModalOpen(true)}
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:opacity-90"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Adicionar Primeiro Membro
                  </Button>
                </Card>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <Users className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Selecione uma equipe</h3>
              <p>Escolha uma equipe da lista para ver os detalhes ou crie uma nova.</p>
            </div>
          </div>
        )}
      </div>

      {/* Modais */}
      <CreateTeamModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onCreateTeam={handleCreateTeam}
      />

      {selectedTeam && (
        <AddMemberModal
          open={isAddMemberModalOpen}
          onOpenChange={setIsAddMemberModalOpen}
          team={selectedTeam}
          onAddMember={(member) => {
            const updatedTeam = {
              ...selectedTeam,
              members: [...selectedTeam.members, {
                id: `member_${Date.now()}`,
                userId: member.userId,
                userName: member.userName,
                userEmail: member.userEmail,
                role: 'member' as const,
                joinedAt: new Date().toISOString()
              }],
              updatedAt: new Date().toISOString()
            };

            setTeams(prev => prev.map(team => 
              team.id === selectedTeam.id ? updatedTeam : team
            ));
            setSelectedTeam(updatedTeam);
            setIsAddMemberModalOpen(false);

            toast({
              title: "Membro adicionado",
              description: `${member.userName} foi adicionado à equipe.`
            });
          }}
        />
      )}
    </div>
  );
}