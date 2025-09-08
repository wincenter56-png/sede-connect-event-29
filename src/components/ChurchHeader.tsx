import { useState, useEffect } from "react";
import churchHero from "@/assets/church-hero.jpg";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface EventConfig {
  id: string;
  event_date: string | null;
  event_value: number | null;
  payment_info: string | null;
  banner_url: string | null;
}

export default function ChurchHeader() {
  const [eventConfig, setEventConfig] = useState<EventConfig | null>(null);

  useEffect(() => {
    loadEventConfig();
  }, []);

  const loadEventConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('event_config')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setEventConfig(data);
    } catch (error) {
      console.error('Error loading event config:', error);
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-holy">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={eventConfig?.banner_url || churchHero}
          alt={eventConfig?.banner_url ? "Banner do evento" : "Interior da igreja com luz dourada"}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/50 to-background/90" />
      </div>
      
      {/* Admin Button */}
      <div className="absolute top-4 right-4 z-10">
        <Link to="/login">
          <Button
            variant="ghost"
            size="icon"
            className="bg-card/80 backdrop-blur-sm hover:bg-card/90 border border-border/20"
            title="Acesso Administrativo"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </Link>
      </div>
      
      {/* Content */}
      <div className="relative container mx-auto px-4 py-16 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            <span className="bg-gradient-divine bg-clip-text text-transparent">
              Ministério
            </span>
            <br />
            <span className="text-foreground">
              Sede do Espírito
            </span>
          </h1>
          
          <div className="w-24 h-1 bg-gradient-celestial mx-auto rounded-full" />
          
          {/* Show event banner full screen instead of default text */}
          {eventConfig?.banner_url ? (
            <div className="mt-8">
              <img 
                src={eventConfig.banner_url} 
                alt="Banner do evento completo" 
                className="w-full max-w-2xl mx-auto rounded-2xl shadow-2xl border border-border/20"
              />
            </div>
          ) : (
            <>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Venha viver uma experiência transformadora de fé, comunhão e renovação espiritual
              </p>
              
              <div className="bg-holy/50 backdrop-blur-sm rounded-2xl p-6 border border-border/20 max-w-lg mx-auto">
                <h2 className="text-lg font-semibold text-celestial mb-2">
                  🗓️ Encontro Especial
                </h2>
                <p className="text-muted-foreground">
                  Um momento único para fortalecer sua jornada espiritual e conectar-se com nossa comunidade
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}