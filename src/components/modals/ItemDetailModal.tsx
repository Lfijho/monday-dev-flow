import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { StatusBadge, PriorityBadge, TypeBadge } from "../backlog/StatusBadge";
import { BacklogItem } from "@/types/backlog";
import { useBacklog } from "@/context/BacklogContext";
import { Calendar, MessageSquare, Target, Clock, Send } from "lucide-react";

interface ItemDetailModalProps {
  item: BacklogItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ItemDetailModal({ item, isOpen, onClose }: ItemDetailModalProps) {
  const { addComment } = useBacklog();
  const [newComment, setNewComment] = useState("");

  if (!item) return null;

  const handleAddComment = () => {
    if (newComment.trim()) {
      addComment(item.id, newComment.trim());
      setNewComment("");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold pr-6">
            {item.title}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2">Descrição</h3>
              <p className="text-muted-foreground leading-relaxed">
                {item.description || "Nenhuma descrição fornecida."}
              </p>
            </div>

            {/* Comments Section */}
            <div>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Comentários ({item.comments.length})
              </h3>
              
              {/* Add new comment */}
              <div className="mb-4 p-4 bg-muted/30 rounded-lg">
                <Textarea
                  placeholder="Adicione um comentário..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="mb-2"
                />
                <Button 
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  size="sm"
                >
                  <Send className="h-3 w-3 mr-1" />
                  Comentar
                </Button>
              </div>

              {/* Comments list */}
              <div className="space-y-3">
                {item.comments.length === 0 ? (
                  <p className="text-muted-foreground text-sm italic">
                    Nenhum comentário ainda. Seja o primeiro a comentar!
                  </p>
                ) : (
                  item.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3 p-3 bg-card rounded-lg border">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                          {getInitials(comment.author)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{comment.author}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-foreground">{comment.content}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Status and Priority */}
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-1 block">Status</label>
                <StatusBadge status={item.status} />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Prioridade</label>
                <PriorityBadge priority={item.priority} />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Tipo</label>
                <TypeBadge type={item.type} />
              </div>
            </div>

            <Separator />

            {/* Assignment */}
            <div>
              <label className="text-sm font-medium mb-2 block">Responsável</label>
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
            </div>

            <Separator />

            {/* Dates and Estimate */}
            <div className="space-y-3">
              {item.dueDate && (
                <div>
                  <label className="text-sm font-medium mb-1 block flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Data de Entrega
                  </label>
                  <p className="text-sm text-foreground">
                    {new Date(item.dueDate).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              )}
              
              {item.estimate && (
                <div>
                  <label className="text-sm font-medium mb-1 block flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    Estimativa
                  </label>
                  <p className="text-sm text-foreground">{item.estimate} pontos</p>
                </div>
              )}
              
              {item.epic && (
                <div>
                  <label className="text-sm font-medium mb-1 block">Épico</label>
                  <Badge variant="outline">{item.epic}</Badge>
                </div>
              )}
            </div>

            <Separator />

            {/* Timestamps */}
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>Criado: {formatDate(item.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>Atualizado: {formatDate(item.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}