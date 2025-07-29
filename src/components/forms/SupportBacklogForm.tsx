import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBacklog } from "@/context/BacklogContext";
import { IdeaSubmission } from "@/types/backlog";
import { toast } from "sonner";
import { Send, Upload, FileText, X } from "lucide-react";
import iiLexLogo from "/iilex.png";

interface SupportBacklogFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface SupportSubmission extends IdeaSubmission {
  ticketId?: string;
  link: string;
  evidenceFile?: File;
}

export function SupportBacklogForm({ onSuccess, onCancel }: SupportBacklogFormProps) {
  const { addItemFromSupportBacklog } = useBacklog();
  const [formData, setFormData] = useState<SupportSubmission>({
    title: "",
    description: "",
    department: "",
    impact: "medium",
    ticketId: "",
    link: "",
    evidenceFile: undefined
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Add item to support backlog group
      addItemFromSupportBacklog({
        title: formData.title,
        description: formData.description,
        department: formData.department,
        impact: formData.impact,
        ticketId: formData.ticketId,
        link: formData.link,
        evidenceFile: formData.evidenceFile
      });

      toast.success("Solicitação de backlog de suporte criada com sucesso!");
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        department: "",
        impact: "medium",
        ticketId: "",
        link: "",
        evidenceFile: undefined
      });
      
      onSuccess?.();
    } catch (error) {
      toast.error("Erro ao criar solicitação. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Arquivo muito grande. Máximo 10MB.");
        return;
      }
      setFormData(prev => ({ ...prev, evidenceFile: file }));
    }
  };

  const removeFile = () => {
    setFormData(prev => ({ ...prev, evidenceFile: undefined }));
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
            <Label htmlFor="title" className="text-sm font-medium">
              Nome da Tarefa *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Descreva o problema ou débito técnico"
              className="w-full"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="department" className="text-sm font-medium">
              Cliente *
            </Label>
            <Input
              id="department"
              value={formData.department}
              onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
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
              onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
              placeholder="https://exemplo.com"
              className="w-full"
              required
            />
            <p className="text-sm text-muted-foreground">
              Coloque aqui o link da tela que você acessou
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ticketId" className="text-sm font-medium">
              Número do chamado - Movidesk
            </Label>
            <Input
              id="ticketId"
              value={formData.ticketId}
              onChange={(e) => setFormData(prev => ({ ...prev, ticketId: e.target.value }))}
              placeholder="Ex: 4444"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="impact" className="text-sm font-medium">
              Nível de Impacto
            </Label>
            <Select 
              value={formData.impact} 
              onValueChange={(value: "low" | "medium" | "high") => 
                setFormData(prev => ({ ...prev, impact: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Baixo</SelectItem>
                <SelectItem value="medium">Médio</SelectItem>
                <SelectItem value="high">Alto</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Descrição Detalhada *
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descreva detalhadamente o problema, reprodução, impacto nos usuários..."
              rows={4}
              required
            />
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
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={removeFile}
                        className="mt-2"
                      >
                        <X className="h-4 w-4" />
                      </Button>
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
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.zip"
                />
              </label>
            </div>
            <p className="text-sm text-muted-foreground">
              Upload do arquivo de evidência.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
            )}
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
                  Criar Solicitação
                </div>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}