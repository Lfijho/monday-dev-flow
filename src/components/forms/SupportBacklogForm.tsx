import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBacklog } from "@/context/BacklogContext";
import { IdeaSubmission } from "@/types/backlog";
import { toast } from "sonner";
import { Upload, X } from "lucide-react";

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
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-3 sm:p-4 lg:p-6">
        <div className="bg-card border rounded-lg shadow-sm">
          <div className="p-4 sm:p-6 border-b bg-muted/30">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <img 
                src="/iilex.png" 
                alt="iiLex" 
                className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">
                  Solicitação Backlog Suporte
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 break-words">
                  Enviar evidência conforme o padrão do link: 
                  <a 
                    href="https://docs.google.com/document/d/1RMnrG8T7zHdeO7n2EXiW1ketfZyRpzj2WaGK_i4U9is/edit?usp=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline ml-1"
                  >
                    Ver padrão de evidência
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Nome da Tarefa *
                </Label>
                <Input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Descreva o problema ou débito técnico"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department" className="text-sm font-medium">
                  Cliente
                </Label>
                <Input
                  id="department"
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                  placeholder="Se solicitação interna preencher com: INTERNO"
                />
                <p className="text-xs text-muted-foreground">
                  Se solicitação interna preencher com: INTERNO
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
                  placeholder="Coloque aqui o link da tela que você acessou"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Coloque aqui o link da tela que você acessou
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ticketId" className="text-sm font-medium">
                  Número do chamado - Movidesk
                </Label>
                <Input
                  id="ticketId"
                  type="text"
                  value={formData.ticketId}
                  onChange={(e) => setFormData(prev => ({ ...prev, ticketId: e.target.value }))}
                  placeholder="Ex: 4444"
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

              <div className="lg:col-span-2 space-y-2">
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

              <div className="lg:col-span-2 space-y-2">
                <Label className="text-sm font-medium">
                  Documento de Evidência
                  <a 
                    href="https://docs.google.com/document/d/1RMnrG8T7zHdeO7n2EXiW1ketfZyRpzj2WaGK_i4U9is/edit?usp=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline ml-1"
                  >
                     ( Ver padrão de evidência ) 
                  </a>
                </Label>
                <div className="border-2 border-dashed border-muted rounded-lg p-4">
                  {!formData.evidenceFile ? (
                    <div className="text-center">
                      <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                      <div className="text-sm text-muted-foreground mb-2">
                        Clique para selecionar um arquivo ou arraste aqui
                      </div>
                      <input
                        type="file"
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.zip"
                        className="hidden"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="inline-flex items-center px-3 py-2 border border-muted rounded-md text-sm font-medium text-muted-foreground hover:bg-muted cursor-pointer"
                      >
                        Selecionar Arquivo
                      </label>
                      <p className="text-xs text-muted-foreground mt-2">
                        Arquivos aceitos: PDF, DOC, DOCX, PNG, JPG, ZIP (máx. 10MB)
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                      <div className="flex items-center gap-2">
                        <Upload className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">{formData.evidenceFile.name}</span>
                        <span className="text-xs text-muted-foreground">
                          ({(formData.evidenceFile.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={removeFile}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-2 flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? "Enviando..." : "Criar Solicitação"}
                </Button>
                {onCancel && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}