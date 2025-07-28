import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useBacklog } from "@/context/BacklogContext";
import { useToast } from "@/hooks/use-toast";
import { HeadsetIcon, Send, Upload, FileText } from "lucide-react";
import iiLexLogo from "/iilex.png";

interface SupportRequestForm {
  taskName: string;
  client: string;
  link: string;
  evidenceFile: File | null;
}

interface IdeaSubmissionFormProps {
  onClose: () => void;
}

export function IdeaSubmissionForm({ onClose }: IdeaSubmissionFormProps) {
  const { addItemFromIdea } = useBacklog();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<SupportRequestForm>({
    taskName: '',
    client: '',
    link: '',
    evidenceFile: null
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData({ ...formData, evidenceFile: file });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.taskName || !formData.client || !formData.link) {
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
      
      // Converter para formato compatível com o sistema existente
      const ideaData = {
        title: formData.taskName,
        description: `Cliente: ${formData.client}\nLink: ${formData.link}\n${formData.evidenceFile ? `Arquivo: ${formData.evidenceFile.name}` : ''}`,
        department: 'suporte',
        impact: 'medium' as const
      };
      
      addItemFromIdea(ideaData);
      
      toast({
        title: "Solicitação enviada com sucesso! 🎉",
        description: "Sua solicitação foi adicionada ao backlog e será analisada pela equipe de suporte.",
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Erro ao enviar solicitação",
        description: "Ocorreu um erro ao processar sua solicitação. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg border-0">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center p-2">
            <img src={iiLexLogo} alt="iiLex" className="h-6 w-6 object-contain" />
          </div>
          <div>
            <CardTitle className="text-xl">Solicitação Backlog Suporte</CardTitle>
            <CardDescription className="text-white/80">
              Enviar evidência conforme o padrão do link: 
              <a 
                href="https://docs.google.com/document/d/1RMnrG8T7zHdeO7n2EXiW1ketfZyRpzj2WaGK_i4U9is/edit?usp=sharing" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-200 hover:text-white underline ml-1"
              >
                Ver documentação
              </a>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="taskName" className="text-sm font-medium">
              Nome da Tarefa *
            </Label>
            <Input
              id="taskName"
              value={formData.taskName}
              onChange={(e) => setFormData({ ...formData, taskName: e.target.value })}
              placeholder="Digite o nome da tarefa"
              className="w-full"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="client" className="text-sm font-medium">
              Cliente *
            </Label>
            <Input
              id="client"
              value={formData.client}
              onChange={(e) => setFormData({ ...formData, client: e.target.value })}
              placeholder="Nome do cliente"
              className="w-full"
              required
            />
            <p className="text-sm text-muted-foreground">
              Se solicitação interna preencher com: <strong>INTERNO</strong>
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="link" className="text-sm font-medium">
              Link *
            </Label>
            <Input
              id="link"
              type="url"
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              placeholder="https://exemplo.com"
              className="w-full"
              required
            />
            <p className="text-sm text-muted-foreground">
              Coloque aqui o link da tela que você acessou
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="evidenceFile" className="text-sm font-medium">
              Documento de Evidência
            </Label>
            <div className="flex items-center justify-center w-full">
              <label 
                htmlFor="evidenceFile" 
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/80 transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {formData.evidenceFile ? (
                    <>
                      <FileText className="w-8 h-8 mb-2 text-blue-500" />
                      <p className="text-sm font-medium text-foreground">
                        {formData.evidenceFile.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(formData.evidenceFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                      <p className="mb-2 text-sm text-muted-foreground">
                        <span className="font-semibold">Clique para fazer upload</span> ou arraste o arquivo
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG, PDF, DOC (MAX. 10MB)
                      </p>
                    </>
                  )}
                </div>
                <input 
                  id="evidenceFile" 
                  type="file" 
                  className="hidden" 
                  onChange={handleFileChange}
                  accept=".png,.jpg,.jpeg,.pdf,.doc,.docx"
                />
              </label>
            </div>
            <p className="text-sm text-muted-foreground">
              Upload do arquivo de evidência que futuramente será armazenado no Supabase
            </p>
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
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:opacity-90"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Enviando...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Enviar Solicitação
                </div>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}