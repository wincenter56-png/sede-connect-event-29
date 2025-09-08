import churchHero from "@/assets/church-hero.jpg";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function ChurchHeader() {
  return (
    <div className="relative overflow-hidden bg-gradient-holy">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={churchHero}
          alt="Interior da igreja com luz dourada"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background/90" />
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
        </div>
      </div>
    </div>
  );
}