import { useState, useEffect } from "react";
import ChurchHeader from "@/components/ChurchHeader";
import RegistrationForm from "@/components/RegistrationForm";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, DollarSign, Info } from "lucide-react";

interface EventConfig {
  id: string;
  event_date: string | null;
  event_value: number | null;
  payment_info: string | null;
  banner_url: string | null;
}

const Index = () => {
  const [eventConfig, setEventConfig] = useState<EventConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEventConfig();
  }, []);

  const loadEventConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('event_config')
        .select('*')
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setEventConfig(data);
    } catch (error) {
      console.error('Error loading event config:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-holy">
      <ChurchHeader />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Event Information */}
          {eventConfig && !isLoading && (
            <section className="mb-12">
              <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border/20 shadow-xl">
                <div className="text-center mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 text-celestial">
                    Informações do Evento
                  </h2>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6">
                  {eventConfig.event_date && (
                    <div className="flex items-center gap-3 p-4 bg-divine/10 rounded-xl">
                      <Calendar className="w-6 h-6 text-celestial" />
                      <div>
                        <p className="text-sm text-muted-foreground">Data do Evento</p>
                        <p className="font-semibold text-foreground">
                          {new Date(eventConfig.event_date).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {eventConfig.event_value && (
                    <div className="flex items-center gap-3 p-4 bg-divine/10 rounded-xl">
                      <DollarSign className="w-6 h-6 text-celestial" />
                      <div>
                        <p className="text-sm text-muted-foreground">Valor</p>
                        <p className="font-semibold text-foreground">
                          R$ {eventConfig.event_value.toFixed(2).replace('.', ',')}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {eventConfig.payment_info && (
                    <div className="flex items-center gap-3 p-4 bg-divine/10 rounded-xl">
                      <Info className="w-6 h-6 text-celestial" />
                      <div>
                        <p className="text-sm text-muted-foreground">PIX</p>
                        <p className="font-semibold text-foreground break-all">
                          {eventConfig.payment_info}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                {eventConfig.banner_url && (
                  <div className="mt-6">
                    <img 
                      src={eventConfig.banner_url} 
                      alt="Banner do Evento" 
                      className="w-full h-48 object-cover rounded-xl"
                    />
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Registration Section */}
          <section className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
              Faça sua Inscrição
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Preencha o formulário abaixo com seus dados e envie o comprovante de pagamento. 
              Após a confirmação, você receberá todas as informações necessárias.
            </p>
          </section>

          {/* Form */}
          <RegistrationForm eventConfig={eventConfig} />

          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 text-center border border-border/20">
              <div className="w-12 h-12 bg-gradient-divine rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🙏</span>
              </div>
              <h3 className="font-semibold mb-2 text-celestial">Propósito</h3>
              <p className="text-sm text-muted-foreground">
                Crescimento espiritual e fortalecimento da fé em comunidade
              </p>
            </div>

            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 text-center border border-border/20">
              <div className="w-12 h-12 bg-gradient-divine rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="font-semibold mb-2 text-celestial">Comunhão</h3>
              <p className="text-sm text-muted-foreground">
                Momentos de fellowship e conexão com outros irmãos na fé
              </p>
            </div>

            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 text-center border border-border/20">
              <div className="w-12 h-12 bg-gradient-divine rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="font-semibold mb-2 text-celestial">Renovação</h3>
              <p className="text-sm text-muted-foreground">
                Uma oportunidade de renovar seu compromisso com Deus
              </p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="mt-16 text-center">
            <div className="bg-card/30 backdrop-blur-sm rounded-2xl p-8 border border-border/20">
              <h3 className="text-xl font-semibold mb-4 text-celestial">
                Dúvidas? Entre em Contato
              </h3>
              <p className="text-muted-foreground mb-4">
                Nossa equipe está pronta para ajudá-lo com qualquer dúvida sobre o encontro.
              </p>
              <p className="text-sm text-muted-foreground">
                "Porque onde estiverem dois ou três reunidos em meu nome, aí estou eu no meio deles." 
                <span className="block font-medium mt-1">- Mateus 18:20</span>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;