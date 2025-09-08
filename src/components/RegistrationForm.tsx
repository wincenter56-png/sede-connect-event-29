import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Upload, Phone, User, CreditCard, Send } from "lucide-react";

interface FormData {
  name: string;
  phone: string;
  receipt: File | null;
}

interface EventConfig {
  id: string;
  event_date: string | null;
  event_value: number | null;
  payment_info: string | null;
  banner_url: string | null;
}

interface RegistrationFormProps {
  eventConfig: EventConfig | null;
}

export default function RegistrationForm({ eventConfig }: RegistrationFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    receipt: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const whatsappNumber = "5548996101891"; // Número do Ministério Sede do Espírito

  const handleInputChange = (field: keyof Omit<FormData, 'receipt'>, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, receipt: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.receipt) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos e anexe o comprovante.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simular upload do arquivo (em um app real, você faria upload para um servidor)
      const message = encodeURIComponent(
        `🙏 *INSCRIÇÃO CONFIRMADA - Encontro Ministério Sede do Espírito*\n\n` +
        `✨ *Dados do Inscrito:*\n` +
        `👤 Nome: ${formData.name}\n` +
        `📱 Telefone: ${formData.phone}\n\n` +
        `📎 *IMPORTANTE:* Anexe o comprovante de pagamento nesta conversa\n` +
        `💳 Pagamento feito via PIX: ${eventConfig?.payment_info || "taiseacordi@gmail.com"}\n` +
        `💰 Valor: R$ ${eventConfig?.event_value?.toFixed(2).replace('.', ',') || 'Consultar'}\n\n` +
        `Que Deus abençoe sua participação! 🕊️`
      );

      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
      
      // Abrir WhatsApp
      window.open(whatsappUrl, '_blank');
      
      toast({
        title: "Inscrição realizada com sucesso! 🙏",
        description: "Você será redirecionado para o WhatsApp. LEMBRE-SE: Anexe o comprovante de pagamento na conversa!",
        duration: 6000,
      });

      // Reset form
      setFormData({
        name: "",
        phone: "",
        receipt: null,
      });

    } catch (error) {
      toast({
        title: "Erro na inscrição",
        description: "Ocorreu um erro. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-xl border-0 bg-card/95 backdrop-blur">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-bold bg-gradient-divine bg-clip-text text-transparent">
          Inscrição do Encontro
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Preencha seus dados para participar deste momento especial
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium">
              <User className="w-4 h-4" />
              Nome Completo
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Seu nome completo"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="border-border/50 focus:border-celestial/50 transition-colors"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium">
              <Phone className="w-4 h-4" />
              Telefone
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="(11) 99999-9999"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="border-border/50 focus:border-celestial/50 transition-colors"
              required
            />
          </div>

          {/* PIX Information */}
          <div className="bg-holy/30 backdrop-blur-sm rounded-xl p-4 border border-celestial/20">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="w-5 h-5 text-celestial" />
              <h3 className="font-semibold text-celestial">Informações de Pagamento</h3>
            </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Faça o pagamento via PIX para a chave:
                </p>
                <div className="bg-card/50 rounded-lg p-3 border border-border/30">
                  <p className="font-mono text-sm font-medium text-center text-celestial break-all">
                    {eventConfig?.payment_info || "taiseacordi@gmail.com"}
                  </p>
                </div>
                {eventConfig?.event_value && (
                  <div className="bg-divine/10 rounded-lg p-3 border border-celestial/20">
                    <p className="text-sm font-medium text-center text-celestial">
                      Valor: R$ {eventConfig.event_value.toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                )}
              <p className="text-xs text-muted-foreground text-center">
                Após o pagamento, anexe o comprovante no campo abaixo
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="receipt" className="flex items-center gap-2 text-sm font-medium">
              <Upload className="w-4 h-4" />
              Comprovante de Pagamento
            </Label>
            <div className="relative">
              <Input
                id="receipt"
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="border-border/50 focus:border-celestial/50 transition-colors cursor-pointer"
                required
              />
              {formData.receipt && (
                <div className="flex items-center gap-2 text-xs text-celestial mt-2 bg-divine/10 p-2 rounded-md">
                  <span>✓</span>
                  <span>Arquivo selecionado: {formData.receipt.name}</span>
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-2 bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded border-l-2 border-yellow-400">
                📋 <strong>Importante:</strong> Após clicar em "Confirmar Inscrição", você será redirecionado ao WhatsApp. Lembre-se de anexar este comprovante na conversa!
              </p>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-divine hover:opacity-90 text-celestial-foreground font-medium py-6 transition-all duration-300 hover:scale-[1.02]"
          >
            {isSubmitting ? (
              "Processando..."
            ) : (
              <span className="flex items-center gap-2">
                <Send className="w-4 h-4" />
                Confirmar Inscrição
              </span>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}