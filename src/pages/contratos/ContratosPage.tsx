import { useState, useEffect } from 'react';
import { Plus, FileText, AlertTriangle, CheckCircle, DollarSign, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ContratoFormModal from '@/components/forms/ContratoFormModal';
import ContratosTable from '@/components/tables/ContratoTable'
import { mockContratos } from '@/lib/mock-data';
import type { Contrato } from '@/types';
import { v4 as uuidv4 } from "uuid";

export default function ContratosPage() {
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingContrato, setEditingContrato] = useState<Contrato | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setContratos(mockContratos);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleCreateContract = () => {
    setEditingContrato(null);
    setShowForm(true);
  };

  const handleEditContract = (contrato: Contrato) => {
    setEditingContrato(contrato);
    setShowForm(true);
  };

  
    const handleSubmitContract = (data: Partial<Contrato>) => {
    if (editingContrato) {
        setContratos(prev =>
        prev.map(c =>
            c.id === editingContrato.id ? { ...c, ...data } : c
        )
        );
    } else {
        const newContract: Contrato = {
        ...data as Omit<Contrato, "id">,
        id: uuidv4(), // gera id único
        };
        setContratos(prev => [...prev, newContract]);
    }
    setShowForm(false);
    };

  const handleDeleteContract = (id: string) => {
    setContratos(prev => prev.filter(c => c.id !== id));
  };

  const contratosAtivos = contratos.filter(c => c.status === 'Ativo').length;
  const contratosExpirados = contratos.filter(c => c.status === 'Expirado').length;
  const contratosPagos = contratos.filter(c => c.tipo === 'Pago').length;
  const custoTotal = contratos
    .filter(c => c.status === 'Ativo' && c.tipo === 'Pago')
    .reduce((total, c) => total + (c.licencas * c.custoPorLicenca), 0);

  const isContractExpiringSoon = (dataFim: string) => {
    const endDate = new Date(dataFim);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient-brand flex items-center gap-2">
            <FileText className="h-8 w-8 text-primary" />
            Contratos
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie contratos de serviços e licenças
          </p>
        </div>

        <Button onClick={handleCreateContract} className="gap-2 bg-gradient-brand hover:opacity-90">
          <Plus className="h-4 w-4" />
          Novo Contrato
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{contratos.length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total de Contratos</p>
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
                <p className="text-2xl font-bold">{contratosAtivos}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Contratos Ativos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{contratosExpirados}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Contratos Expirados</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <DollarSign className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  R$ {custoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Custo Total Mensal</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Expiring Soon */}
        <Card className="border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-amber-600" />
              Expirando em Breve
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {contratos
                .filter(c => isContractExpiringSoon(c.dataFim) && c.status === 'Ativo')
                .slice(0, 3)
                .map((contrato) => {
                  const daysLeft = Math.ceil((new Date(contrato.dataFim).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
                  return (
                    <div key={contrato.id} className="flex items-center justify-between p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                      <div>
                        <p className="font-medium text-sm">{contrato.sistema}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{daysLeft} dias restantes</p>
                      </div>
                      <Badge variant="outline" className="border-amber-300 text-amber-700">
                        {daysLeft}d
                      </Badge>
                    </div>
                  );
                })}
              {contratos.filter(c => isContractExpiringSoon(c.dataFim) && c.status === 'Ativo').length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  Nenhum contrato expirando nos próximos 30 dias
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Contract Types */}
        <Card className="border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-purple-600" />
              Tipos de Contrato
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm">Pagos</span>
                </div>
                <Badge variant="outline">{contratosPagos}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Gratuitos</span>
                </div>
                <Badge variant="outline">{contratos.length - contratosPagos}</Badge>
              </div>
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total de Licenças</span>
                  <Badge variant="outline">
                    {contratos.reduce((total, c) => total + c.licencas, 0)}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Contratos Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {contratos
                .filter(c => c.status === 'Ativo')
                .slice(0, 3)
                .map((contrato) => (
                  <div key={contrato.id} className="flex items-center justify-between p-2 rounded-lg bg-green-50 dark:bg-green-900/20">
                    <div>
                      <p className="font-medium text-sm">{contrato.sistema}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {contrato.licencas} licenças
                        {contrato.tipo === 'Pago' && ` • R$ ${(contrato.licencas * contrato.custoPorLicenca).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês`}
                      </p>
                    </div>
                    <Badge variant="outline" className="border-green-300 text-green-700">
                      {contrato.tipo}
                    </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contracts Table */}
      <Card className="border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
        <CardHeader>
          <CardTitle>Lista de Contratos</CardTitle>
          <CardDescription>
            Gerencie todos os contratos de serviços da empresa
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ContratosTable
            contratos={contratos}
            isLoading={isLoading}
            onEdit={handleEditContract}
            onDelete={handleDeleteContract}
          />
        </CardContent>
      </Card>

      {/* Modal */}
      <ContratoFormModal
        open={showForm}
        onOpenChange={setShowForm}
        contrato={editingContrato}
        onSubmit={handleSubmitContract}
      />
    </div>
  );
}