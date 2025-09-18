import { useState, useEffect } from 'react';
import { Plus, Monitor, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SistemaFormModal from '@/components/forms/SistemaFormModal';
import { mockSistemas, mockContratos } from '@/lib/mock-data';
import type { Sistema } from '@/types';
import { v4 as uuidv4 } from "uuid";

export default function SistemasPage() {
  const [sistemas, setSistemas] = useState<Sistema[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSistema, setEditingSistema] = useState<Sistema | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSistemas(mockSistemas);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleCreateSystem = () => {
    setEditingSistema(null);
    setShowForm(true);
  };

  const handleEditSystem = (sistema: Sistema) => {
    setEditingSistema(sistema);
    setShowForm(true);
  };

  
    const handleSubmitSystem = (data: Partial<Sistema>) => {
    if (editingSistema) {
        setSistemas(prev =>
        prev.map(c =>
            c.id === editingSistema.id ? { ...c, ...data } : c
        )
        );
    } else {
        const newSystem: Sistema = {
        ...data as Omit<Sistema, "id">,
        id: uuidv4(), // gera id único
        };
        setSistemas(prev => [...prev, newSystem]);
    }
    setShowForm(false);
    };

  const getSystemStatus = (sistemaId: string) => {
    const contrato = mockContratos.find(c => c.sistemaId === sistemaId);
    if (!contrato) return 'Sem Contrato';
    return contrato.status;
  };

  const getContractType = (sistemaId: string) => {
    const contrato = mockContratos.find(c => c.sistemaId === sistemaId);
    if (!contrato) return null;
    return contrato.tipo;
  };

  const sistemasAtivos = sistemas.filter(s => getSystemStatus(s.id) === 'Ativo').length;
  const sistemasExpirados = sistemas.filter(s => getSystemStatus(s.id) === 'Expirado').length;
  const sistemasSemContrato = sistemas.filter(s => getSystemStatus(s.id) === 'Sem Contrato').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient-brand flex items-center gap-2">
            <Monitor className="h-8 w-8 text-primary" />
            Sistemas
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie sistemas e suas configurações
          </p>
        </div>

        <Button onClick={handleCreateSystem} className="gap-2 bg-gradient-brand hover:opacity-90">
          <Plus className="h-4 w-4" />
          Novo Sistema
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Monitor className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{sistemas.length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total de Sistemas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{sistemasAtivos}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Sistemas Ativos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{sistemasExpirados}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Sistemas Expirados</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/20 rounded-lg">
                <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{sistemasSemContrato}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Sem Contrato</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Systems Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
                <CardHeader>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
                  </div>
                </CardContent>
              </Card>
            ))
          : sistemas.map((sistema) => {
              const status = getSystemStatus(sistema.id);
              const tipo = getContractType(sistema.id);
              
              return (
                <Card 
                  key={sistema.id} 
                  className="border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                  onClick={() => handleEditSystem(sistema)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg">
                          <Monitor className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg group-hover:text-purple-600 transition-colors">
                            {sistema.nome}
                          </CardTitle>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <Badge 
                          variant={
                            status === 'Ativo' ? 'default' : 
                            status === 'Expirado' ? 'destructive' : 'secondary'
                          }
                          className="text-xs"
                        >
                          {status}
                        </Badge>
                        {tipo && (
                          <Badge 
                            variant={tipo === 'Pago' ? 'outline' : 'secondary'}
                            className="text-xs"
                          >
                            {tipo}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardDescription className="mt-2">
                      {sistema.descricao}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex items-center gap-2">
                      {status === 'Ativo' && <CheckCircle className="h-4 w-4 text-green-500" />}
                      {status === 'Expirado' && <AlertCircle className="h-4 w-4 text-red-500" />}
                      {status === 'Sem Contrato' && <AlertCircle className="h-4 w-4 text-amber-500" />}
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {status === 'Ativo' && 'Sistema funcionando normalmente'}
                        {status === 'Expirado' && 'Contrato expirado - requer renovação'}
                        {status === 'Sem Contrato' && 'Sistema sem contrato ativo'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
      </div>

      {/* Modal */}
      <SistemaFormModal
        open={showForm}
        onOpenChange={setShowForm}
        sistema={editingSistema}
        onSubmit={handleSubmitSystem}
      />
    </div>
  );
}