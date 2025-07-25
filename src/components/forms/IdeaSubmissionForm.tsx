import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useBacklog } from "@/context/BacklogContext";
import { useToast } from "@/hooks/use-toast";
import { IdeaSubmission } from "@/types/backlog";
import { Lightbulb, Send } from "lucide-react";

interface IdeaSubmissionFormProps {
  onClose: () => void;
}

export function IdeaSubmissionForm({ onClose }: IdeaSubmissionFormProps) {
  const { addItemFromIdea } = useBacklog();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<IdeaSubmission>({
    title: '',
    description: '',
    department: '',
    impact: 'medium'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.department) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addItemFromIdea(formData);
      
      toast({
        title: "Ideia enviada com sucesso! 🎉",
        description: "Sua ideia foi adicionada ao backlog e será analisada pela equipe de desenvolvimento.",
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Erro ao enviar ideia",
        description: "Ocorreu um erro ao processar sua solicitação. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg border-0">
      <CardHeader className="bg-gradient-to-r from-monday-blue to-monday-purple text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
            <Lightbulb className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-xl">Nova Ideia de Produto</CardTitle>
            <CardDescription className="text-white/80">
              Compartilhe sua ideia para melhorar nosso produto
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Título da Ideia *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ex: Sistema de notificações em tempo real"
              className="w-full"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Descrição Detalhada *
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descreva qual problema sua ideia resolve e como ela funcionaria..."
              className="w-full min-h-[120px] resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department" className="text-sm font-medium">
                Departamento/Time *
              </Label>
              <Select 
                value={formData.department} 
                onValueChange={(value) => setFormData({ ...formData, department: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione seu departamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vendas">Vendas</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="produto">Produto</SelectItem>
                  <SelectItem value="engenharia">Engenharia</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="atendimento">Atendimento ao Cliente</SelectItem>
                  <SelectItem value="rh">Recursos Humanos</SelectItem>
                  <SelectItem value="financeiro">Financeiro</SelectItem>
                  <SelectItem value="operacoes">Operações</SelectItem>
                  <SelectItem value="outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="impact" className="text-sm font-medium">
                Nível de Impacto Percebido
              </Label>
              <Select 
                value={formData.impact} 
                onValueChange={(value: any) => setFormData({ ...formData, impact: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-priority-low-foreground"></div>
                      Baixo
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-priority-medium-foreground"></div>
                      Médio
                    </div>
                  </SelectItem>
                  <SelectItem value="high">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-priority-high-foreground"></div>
                      Alto
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-monday-blue to-monday-purple hover:opacity-90"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Enviando...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Enviar Ideia
                </div>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}