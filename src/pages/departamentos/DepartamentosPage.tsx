import { useState, useEffect } from 'react';
import { Plus, Building, Users, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import DepartamentoFormModal from '@/components/forms/DepartamentoFormModal';
import { mockDepartamentos, mockUsuarios } from '@/lib/mock-data';
import type { Departamento } from '@/types';
import { v4 as uuidv4 } from "uuid";

export default function DepartamentosPage() {
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingDepartamento, setEditingDepartamento] = useState<Departamento | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDepartamentos(mockDepartamentos);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleCreateDepartment = () => {
    setEditingDepartamento(null);
    setShowForm(true);
  };

  const handleEditDepartment = (departamento: Departamento) => {
    setEditingDepartamento(departamento);
    setShowForm(true);
  };

  
    const handleSubmitDepartment = (data: Partial<Departamento>) => {
    if (editingDepartamento) {
        setDepartamentos(prev =>
        prev.map(c =>
            c.id === editingDepartamento.id ? { ...c, ...data } : c
        )
        );
    } else {
        const newDepartment: Departamento = {
        ...data as Omit<Departamento, "id">,
        id: uuidv4(), // gera id único
        };
        setDepartamentos(prev => [...prev, newDepartment]);
    }
    setShowForm(false);
    };

  const getUserCountByDepartment = (departmentName: string) => {
    return mockUsuarios.filter(u => u.departamento === departmentName).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient-brand flex items-center gap-2">
            <Building className="h-8 w-8 text-primary" />
            Departamentos
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie departamentos e cargos da empresa
          </p>
        </div>

        <Button onClick={handleCreateDepartment} className="gap-2 bg-gradient-brand hover:opacity-90">
          <Plus className="h-4 w-4" />
          Novo Departamento
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-0 bg-gradient-subtle dark:bg-gradient-to-br dark:from-card dark:to-muted/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg">
                <Building className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{departamentos.length}</p>
                <p className="text-sm text-muted-foreground">Total de Departamentos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-subtle dark:bg-gradient-to-br dark:from-card dark:to-muted/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-success/10 dark:bg-success/20 rounded-lg">
                <Users className="h-4 w-4 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockUsuarios.length}</p>
                <p className="text-sm text-muted-foreground">Total de Funcionários</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-subtle dark:bg-gradient-to-br dark:from-card dark:to-muted/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-secondary/10 dark:bg-secondary/20 rounded-lg">
                <Briefcase className="h-4 w-4 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {departamentos.reduce((acc, dept) => acc + dept.cargos.length, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Total de Cargos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Departments Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="border-0 bg-gradient-subtle dark:bg-gradient-to-br dark:from-card dark:to-muted/20">
                <CardHeader>
                  <div className="h-6 bg-muted rounded animate-pulse" />
                  <div className="h-4 bg-muted rounded animate-pulse" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded animate-pulse" />
                    <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                  </div>
                </CardContent>
              </Card>
            ))
          : departamentos.map((departamento) => (
              <Card 
                key={departamento.id} 
                className="border-0 bg-gradient-subtle dark:bg-gradient-to-br dark:from-card dark:to-muted/20 hover:shadow-brand-lg transition-all duration-300 cursor-pointer group"
                onClick={() => handleEditDepartment(departamento)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
                        <Building className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {departamento.nome}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Users className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {getUserCountByDepartment(departamento.nome)} funcionários
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <CardDescription className="mt-2">
                    {departamento.descricao}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-foreground mb-2">
                        Cargos ({departamento.cargos.length})
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {departamento.cargos.slice(0, 3).map((cargo) => (
                          <Badge key={cargo} variant="secondary" className="text-xs">
                            {cargo}
                          </Badge>
                        ))}
                        {departamento.cargos.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{departamento.cargos.length - 3} mais
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>

      {/* Modal */}
      <DepartamentoFormModal
        open={showForm}
        onOpenChange={setShowForm}
        departamento={editingDepartamento}
        onSubmit={handleSubmitDepartment}
      />
    </div>
  );
}