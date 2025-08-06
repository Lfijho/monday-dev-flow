import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Team } from "@/types/team";
import { Search, UserPlus, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  team: Team;
  onAddMember: (member: { userId: string; userName: string; userEmail: string }) => void;
}

// Mock de usuários disponíveis - será substituído por dados reais posteriormente
const mockUsers = [
  { id: "user4", name: "Ana Oliveira", email: "ana@empresa.com" },
  { id: "user5", name: "Carlos Lima", email: "carlos@empresa.com" },
  { id: "user6", name: "Fernanda Costa", email: "fernanda@empresa.com" },
  { id: "user7", name: "Roberto Santos", email: "roberto@empresa.com" },
  { id: "user8", name: "Julia Almeida", email: "julia@empresa.com" },
];

export function AddMemberModal({ open, onOpenChange, team, onAddMember }: AddMemberModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<typeof mockUsers[0] | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filtrar usuários que já estão na equipe
  const teamMemberIds = team.members.map(member => member.userId);
  const availableUsers = mockUsers.filter(user => !teamMemberIds.includes(user.id));

  // Filtrar usuários baseado na busca
  const filteredUsers = availableUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async () => {
    if (!selectedUser) return;

    setIsSubmitting(true);
    
    try {
      await onAddMember({
        userId: selectedUser.id,
        userName: selectedUser.name,
        userEmail: selectedUser.email
      });
      
      // Reset state
      setSearchTerm("");
      setSelectedUser(null);
    } catch (error) {
      console.error("Erro ao adicionar membro:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSearchTerm("");
    setSelectedUser(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Adicionar Membro à {team.name}
          </DialogTitle>
          <DialogDescription>
            Selecione um usuário para adicionar à equipe. Apenas usuários cadastrados no sistema podem ser adicionados.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Campo de busca */}
          <div className="space-y-2">
            <Label htmlFor="search">Buscar usuário</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Digite nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Lista de usuários */}
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors hover:bg-accent",
                    selectedUser?.id === user.id && "bg-accent border-primary"
                  )}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                  </div>
                  {selectedUser?.id === user.id && (
                    <Badge variant="default">Selecionado</Badge>
                  )}
                </div>
              ))
            ) : searchTerm ? (
              <div className="text-center py-8 text-muted-foreground">
                <User className="h-8 w-8 mx-auto mb-2" />
                <p>Nenhum usuário encontrado</p>
                <p className="text-sm">Tente buscar por outro nome ou email</p>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <User className="h-8 w-8 mx-auto mb-2" />
                <p>Todos os usuários já estão na equipe</p>
                <p className="text-sm">Não há usuários disponíveis para adicionar</p>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!selectedUser || isSubmitting}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:opacity-90"
          >
            {isSubmitting ? "Adicionando..." : "Adicionar Membro"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}