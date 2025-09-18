import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Download, Upload, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import UsuariosTable from '@/components/tables/UsuariosTable';
import UsuarioFormModal from '@/components/forms/UsuarioFormModal';
import { mockUsuarios } from '@/lib/mock-data';
import type { Usuario } from '@/types';
import { v4 as uuidv4 } from "uuid";
import UsuariosTable from '@/components/tables/UsuariosTable';

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState<Usuario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState<Usuario | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setUsuarios(mockUsuarios);
      setFilteredUsuarios(mockUsuarios);
      setIsLoading(false);
    }, 10);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let filtered = usuarios;

    if (searchTerm) {
      filtered = filtered.filter(usuario =>
        usuario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usuario.sobrenome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usuario.cpf.includes(searchTerm) ||
        usuario.cargo.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedDepartment) {
      filtered = filtered.filter(usuario => usuario.departamento === selectedDepartment);
    }

    if (selectedStatus) {
      filtered = filtered.filter(usuario => usuario.status === selectedStatus);
    }

    setFilteredUsuarios(filtered);
  }, [usuarios, searchTerm, selectedDepartment, selectedStatus]);

  const handleCreateUser = () => {
    setEditingUsuario(null);
    setShowForm(true);
  };

  const handleEditUser = (usuario: Usuario) => {
    setEditingUsuario(usuario);
    setShowForm(true);
  };


    const handleSubmitUser = (data: Partial<Usuario>) => {
    if (editingUsuario) {
        setUsuarios(prev =>
        prev.map(c =>
            c.id === editingUsuario.id ? { ...c, ...data } : c
        )
        );
    } else {
        const newUser: Usuario = {
        ...data as Omit<Usuario, "id">,
        id: uuidv4(), // gera id único
        };
        setUsuarios(prev => [...prev, newUser]);
    }
    setShowForm(false);
    };

  const handleDeleteUser = (id: string) => {
    setUsuarios(prev => prev.filter(u => u.id !== id));
  };

  const departments = Array.from(new Set(usuarios.map(u => u.departamento)));
  const statusOptions = Array.from(new Set(usuarios.map(u => u.status)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient-brand flex items-center gap-2">
            <Users className="h-8 w-8 text-primary" />
            Usuários
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie usuários, departamentos e permissões
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Upload className="h-4 w-4" />
            Importar
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
          <Button onClick={handleCreateUser} className="gap-2 bg-gradient-brand hover:opacity-90">
            <Plus className="h-4 w-4" />
            Novo Usuário
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="border-0 bg-gradient-subtle dark:bg-gradient-to-br dark:from-card dark:to-muted/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{usuarios.length}</p>
                <p className="text-sm text-muted-foreground">Total de Usuários</p>
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
                <p className="text-2xl font-bold">
                  {usuarios.filter(u => u.status === 'Ativo').length}
                </p>
                <p className="text-sm text-muted-foreground">Ativos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-subtle dark:bg-gradient-to-br dark:from-card dark:to-muted/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-destructive/10 dark:bg-destructive/20 rounded-lg">
                <Users className="h-4 w-4 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {usuarios.filter(u => u.status === 'Inativo').length}
                </p>
                <p className="text-sm text-muted-foreground">Inativos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-subtle dark:bg-gradient-to-br dark:from-card dark:to-muted/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-secondary/10 dark:bg-secondary/20 rounded-lg">
                <Users className="h-4 w-4 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{departments.length}</p>
                <p className="text-sm text-muted-foreground">Departamentos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

  {/* Filters
      <Card className="border-0 bg-gradient-subtle dark:bg-gradient-to-br dark:from-card dark:to-muted/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
          <CardDescription>
            Use os filtros abaixo para encontrar usuários específicos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, CPF ou cargo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Departamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os departamentos</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full md:w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card> */}

      {/* Table */}
      <Card className="border-0 bg-gradient-subtle dark:bg-gradient-to-br dark:from-card dark:to-muted/20">
        <CardContent className="p-0">
          <UsuariosTable
            usuarios={filteredUsuarios}
            isLoading={isLoading}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
          />
        </CardContent>
      </Card>

      {/* Modal */}
      <UsuarioFormModal
        open={showForm}
        onOpenChange={setShowForm}
        usuario={editingUsuario}
        onSubmit={handleSubmitUser}
      />
    </div>
  );
}