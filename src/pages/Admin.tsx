import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, DollarSign, FileText, Image, Users, Save, LogOut, Home, Edit, Trash2, Plus } from "lucide-react";

interface EventConfig {
  id?: string;
  event_date: string;
  event_value: number;
  payment_info: string;
  banner_url: string;
}

interface Registration {
  id: string;
  name: string;
  phone: string;
  receipt_url: string | null;
  status: string;
  created_at: string;
}

export default function Admin() {
  const { toast } = useToast();
  const { isLoggedIn, isLoading: authLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [eventConfig, setEventConfig] = useState<EventConfig>({
    event_date: "",
    event_value: 0,
    payment_info: "taiseacordi@gmail.com",
    banner_url: "",
  });
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      navigate("/login");
      return;
    }
    
    if (isLoggedIn) {
      loadEventConfig();
      loadRegistrations();
    }
  }, [isLoggedIn, authLoading, navigate]);

  const loadEventConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('event_config')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        throw error;
      }

      if (data) {
        setEventConfig({
          id: data.id,
          event_date: data.event_date ? new Date(data.event_date).toISOString().slice(0, 16) : "",
          event_value: data.event_value || 0,
          payment_info: data.payment_info || "taiseacordi@gmail.com",
          banner_url: data.banner_url || "",
        });
      }
    } catch (error) {
      console.error('Error loading event config:', error);
    }
  };

  const loadRegistrations = async () => {
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRegistrations(data || []);
    } catch (error) {
      console.error('Error loading registrations:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar registros",
        variant: "destructive",
      });
    }
  };

  const saveEventConfig = async () => {
    setIsLoading(true);
    try {
      const configData = {
        event_date: eventConfig.event_date ? new Date(eventConfig.event_date).toISOString() : null,
        event_value: eventConfig.event_value,
        payment_info: eventConfig.payment_info,
        banner_url: eventConfig.banner_url,
      };

      if (eventConfig.id) {
        const { error } = await supabase
          .from('event_config')
          .update(configData)
          .eq('id', eventConfig.id);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('event_config')
          .insert([configData])
          .select()
          .single();

        if (error) throw error;
        setEventConfig(prev => ({ ...prev, id: data.id }));
      }

      setIsEditing(false);
      toast({
        title: "Sucesso!",
        description: "Configurações do evento salvas com sucesso",
      });
    } catch (error) {
      console.error('Error saving event config:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar configurações",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteEventConfig = async () => {
    if (!eventConfig.id) return;
    
    const confirmed = window.confirm("Tem certeza que deseja excluir a configuração do evento?");
    if (!confirmed) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('event_config')
        .delete()
        .eq('id', eventConfig.id);

      if (error) throw error;

      setEventConfig({
        event_date: "",
        event_value: 0,
        payment_info: "taiseacordi@gmail.com",
        banner_url: "",
      });

      toast({
        title: "Sucesso!",
        description: "Configuração do evento excluída com sucesso",
      });
    } catch (error) {
      console.error('Error deleting event config:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir configuração",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const startEditing = () => {
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    loadEventConfig(); // Reset form data
  };

  const updateRegistrationStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('registrations')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      setRegistrations(prev =>
        prev.map(reg => reg.id === id ? { ...reg, status } : reg)
      );

      toast({
        title: "Status atualizado",
        description: "Status da inscrição atualizado com sucesso",
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar status",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmado';
      case 'pending': return 'Pendente';
      case 'cancelled': return 'Cancelado';
      default: return 'Desconhecido';
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso",
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-holy flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-celestial mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return null; // Redirecionamento será feito pelo useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-holy p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Painel Administrativo
            </h1>
            <p className="text-muted-foreground">
              Gerencie as configurações do evento e visualize as inscrições
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Início
            </Button>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </Button>
          </div>
        </div>

        {/* Event Configuration */}
        <Card className="mb-8 shadow-xl border-0 bg-card/95 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xl">
                <FileText className="w-5 h-5" />
                Configurações do Evento
              </div>
              <div className="flex gap-2">
                {eventConfig.id && !isEditing && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={startEditing}
                      className="flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={deleteEventConfig}
                      className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      Excluir
                    </Button>
                  </>
                )}
                {!eventConfig.id && !isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Criar Evento
                  </Button>
                )}
              </div>
            </CardTitle>
            <CardDescription>
              {isEditing ? "Edite os detalhes do evento" : "Visualize ou gerencie as configurações do evento"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isEditing ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="event_date" className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Data do Evento
                    </Label>
                    <Input
                      id="event_date"
                      type="datetime-local"
                      value={eventConfig.event_date}
                      onChange={(e) => setEventConfig(prev => ({ ...prev, event_date: e.target.value }))}
                      className="border-border/50 focus:border-celestial/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="event_value" className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Valor do Evento (R$)
                    </Label>
                    <Input
                      id="event_value"
                      type="number"
                      step="0.01"
                      value={eventConfig.event_value}
                      onChange={(e) => setEventConfig(prev => ({ ...prev, event_value: parseFloat(e.target.value) || 0 }))}
                      className="border-border/50 focus:border-celestial/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payment_info" className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Informações de Pagamento
                  </Label>
                  <Textarea
                    id="payment_info"
                    value={eventConfig.payment_info}
                    onChange={(e) => setEventConfig(prev => ({ ...prev, payment_info: e.target.value }))}
                    className="border-border/50 focus:border-celestial/50"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="banner_url" className="flex items-center gap-2">
                    <Image className="w-4 h-4" />
                    URL do Banner
                  </Label>
                  <Input
                    id="banner_url"
                    type="url"
                    value={eventConfig.banner_url}
                    onChange={(e) => setEventConfig(prev => ({ ...prev, banner_url: e.target.value }))}
                    className="border-border/50 focus:border-celestial/50"
                    placeholder="https://example.com/banner.jpg"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={saveEventConfig}
                    disabled={isLoading}
                    className="bg-gradient-divine hover:opacity-90 text-celestial-foreground"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isLoading ? "Salvando..." : "Salvar Configurações"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={cancelEditing}
                    disabled={isLoading}
                  >
                    Cancelar
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                {eventConfig.id ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Data do Evento
                        </Label>
                        <div className="p-3 bg-muted/50 rounded-md">
                          {eventConfig.event_date ? 
                            new Date(eventConfig.event_date).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            }) : 
                            "Não definida"
                          }
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          Valor do Evento
                        </Label>
                        <div className="p-3 bg-muted/50 rounded-md">
                          {eventConfig.event_value ? 
                            `R$ ${eventConfig.event_value.toFixed(2).replace('.', ',')}` : 
                            "Não definido"
                          }
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Informações de Pagamento
                      </Label>
                      <div className="p-3 bg-muted/50 rounded-md">
                        {eventConfig.payment_info || "Não definidas"}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Image className="w-4 h-4" />
                        URL do Banner
                      </Label>
                      <div className="p-3 bg-muted/50 rounded-md break-all">
                        {eventConfig.banner_url || "Não definida"}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhuma configuração de evento encontrada</p>
                    <p className="text-sm">Clique em "Criar Evento" para começar</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Registrations Table */}
        <Card className="shadow-xl border-0 bg-card/95 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Users className="w-5 h-5" />
              Inscrições ({registrations.length})
            </CardTitle>
            <CardDescription>
              Lista de todas as pessoas cadastradas no evento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Data de Inscrição</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registrations.map((registration) => (
                    <TableRow key={registration.id}>
                      <TableCell className="font-medium">
                        {registration.name}
                      </TableCell>
                      <TableCell>{registration.phone}</TableCell>
                      <TableCell>
                        {new Date(registration.created_at).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </TableCell>
                      <TableCell>
                        <Badge className={`text-white ${getStatusColor(registration.status)}`}>
                          {getStatusLabel(registration.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateRegistrationStatus(registration.id, 'confirmed')}
                            className="text-green-600 border-green-600 hover:bg-green-50"
                          >
                            Confirmar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateRegistrationStatus(registration.id, 'cancelled')}
                            className="text-red-600 border-red-600 hover:bg-red-50"
                          >
                            Cancelar
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {registrations.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhuma inscrição encontrada
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}