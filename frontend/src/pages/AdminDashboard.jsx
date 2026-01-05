import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';
import {
  Calendar, Users, Home, DollarSign, Clock, LogOut, RefreshCw,
  CheckCircle, XCircle, AlertCircle, Edit, Trash2, Loader2, Phone, Mail, Filter, CalendarOff, Trash
} from 'lucide-react';
import { adminAPI } from '../services/api';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [monthFilter, setMonthFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [editingReservation, setEditingReservation] = useState(null);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);
  const [deletingCancelled, setDeletingCancelled] = useState(false);

  const adminEmail = localStorage.getItem('adminEmail');
  
  const months = [
    { value: '1', label: 'Enero' },
    { value: '2', label: 'Febrero' },
    { value: '3', label: 'Marzo' },
    { value: '4', label: 'Abril' },
    { value: '5', label: 'Mayo' },
    { value: '6', label: 'Junio' },
    { value: '7', label: 'Julio' },
    { value: '8', label: 'Agosto' },
    { value: '9', label: 'Septiembre' },
    { value: '10', label: 'Octubre' },
    { value: '11', label: 'Noviembre' },
    { value: '12', label: 'Diciembre' }
  ];
  
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    loadData();
  }, [navigate]);

  useEffect(() => {
    if (localStorage.getItem('adminToken')) {
      loadData();
    }
  }, [monthFilter, yearFilter]);

  const loadData = async () => {
    setLoading(true);
    try {
      const params = {};
      if (monthFilter !== 'all') params.month = parseInt(monthFilter);
      if (yearFilter !== 'all') params.year = parseInt(yearFilter);
      
      const [statsData, reservationsData] = await Promise.all([
        adminAPI.getStats(params.month, params.year),
        adminAPI.getReservations(null, null, params.month, params.year)
      ]);
      setStats(statsData);
      setReservations(reservationsData);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
      } else {
        toast.error('Error cargando datos');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    navigate('/admin/login');
  };

  const handleEditClick = (reservation) => {
    setEditingReservation(reservation);
    setEditData({
      status: reservation.status,
      notes: reservation.notes || '',
      num_guests: reservation.num_guests?.toString() || '',
      client_name: reservation.client?.name || '',
      client_phone: reservation.client?.phone || ''
    });
  };

  const handleSaveEdit = async () => {
    setSaving(true);
    try {
      const dataToSend = {
        ...editData,
        num_guests: editData.num_guests ? parseInt(editData.num_guests) : undefined
      };
      await adminAPI.updateReservation(editingReservation.id, dataToSend);
      toast.success('Reservación actualizada');
      setEditingReservation(null);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Error actualizando reservación');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('¿Estás seguro de cancelar esta reservación?')) return;
    try {
      await adminAPI.cancelReservation(id);
      toast.success('Reservación cancelada');
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Error cancelando reservación');
    }
  };

  const filteredReservations = reservations.filter(r => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (typeFilter !== 'all' && r.reservation_type !== typeFilter) return false;
    return true;
  });

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-amber-100 text-amber-800',
      confirmed: 'bg-emerald-100 text-emerald-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800'
    };
    const labels = {
      pending: 'Pendiente',
      confirmed: 'Confirmada',
      cancelled: 'Cancelada',
      completed: 'Completada'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100'}`}>
        {labels[status] || status}
      </span>
    );
  };

  const clearFilters = () => {
    setMonthFilter('all');
    setYearFilter('all');
    setStatusFilter('all');
    setTypeFilter('all');
  };

  if (loading && !stats) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-700" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Desktop Layout */}
          <div className="hidden md:flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-stone-800">Panel de Administración</h1>
              <p className="text-stone-600 text-sm">Cabañas AquaValle</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-stone-600 text-sm">{adminEmail}</span>
              <Button variant="outline" size="sm" onClick={() => navigate('/admin/blocks')}>
                <CalendarOff size={16} className="mr-1" /> Bloqueos
              </Button>
              <Button variant="outline" size="sm" onClick={loadData} disabled={loading}>
                <RefreshCw size={16} className={`mr-1 ${loading ? 'animate-spin' : ''}`} /> Actualizar
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut size={16} className="mr-1" /> Salir
              </Button>
            </div>
          </div>
          
          {/* Mobile Layout */}
          <div className="md:hidden">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h1 className="text-xl font-bold text-stone-800">Panel Admin</h1>
                <p className="text-stone-600 text-xs">{adminEmail}</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut size={16} />
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1" onClick={() => navigate('/admin/blocks')}>
                <CalendarOff size={16} className="mr-1" /> Bloqueos
              </Button>
              <Button variant="outline" size="sm" className="flex-1" onClick={loadData} disabled={loading}>
                <RefreshCw size={16} className={`mr-1 ${loading ? 'animate-spin' : ''}`} /> Actualizar
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Month/Year Filter */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-end gap-3 sm:gap-4">
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-stone-500" />
                <span className="font-medium text-stone-700 text-sm sm:text-base">Filtrar por período:</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3 sm:flex sm:gap-4">
                <div className="w-full sm:w-40">
                  <Label className="mb-1 block text-xs">Mes</Label>
                  <Select value={monthFilter} onValueChange={setMonthFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los meses</SelectItem>
                      {months.map(m => (
                        <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="w-full sm:w-32">
                  <Label className="mb-1 block text-xs">Año</Label>
                  <Select value={yearFilter} onValueChange={setYearFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      {years.map(y => (
                        <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center justify-between sm:justify-start gap-2 sm:ml-auto">
                {(monthFilter !== 'all' || yearFilter !== 'all') && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Limpiar filtros
                  </Button>
                )}
                
                {stats?.month_label && (
                  <span className="text-emerald-700 font-medium text-sm">
                    {stats.month_label}
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 mb-6 sm:mb-8">
            <Card>
              <CardContent className="pt-4 sm:pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-stone-600">Total Reservas</p>
                    <p className="text-2xl sm:text-3xl font-bold text-stone-800">{stats.total_reservations}</p>
                  </div>
                  <Calendar className="text-emerald-600 hidden sm:block" size={32} />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-4 sm:pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-stone-600">Pendientes</p>
                    <p className="text-2xl sm:text-3xl font-bold text-amber-600">{stats.pending_reservations}</p>
                  </div>
                  <Clock className="text-amber-600 hidden sm:block" size={32} />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-4 sm:pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-stone-600">Confirmadas</p>
                    <p className="text-2xl sm:text-3xl font-bold text-emerald-600">{stats.confirmed_reservations}</p>
                  </div>
                  <CheckCircle className="text-emerald-600 hidden sm:block" size={32} />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-4 sm:pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-stone-600">Ingresos</p>
                    <p className="text-xl sm:text-3xl font-bold text-stone-800">€{stats.total_revenue?.toFixed(0)}</p>
                  </div>
                  <DollarSign className="text-emerald-600 hidden sm:block" size={32} />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Status/Type Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:gap-4">
              <div className="w-full sm:w-48">
                <Label className="mb-2 block text-sm">Estado</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="pending">Pendientes</SelectItem>
                    <SelectItem value="confirmed">Confirmadas</SelectItem>
                    <SelectItem value="cancelled">Canceladas</SelectItem>
                    <SelectItem value="completed">Completadas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full sm:w-48">
                <Label className="mb-2 block text-sm">Tipo</Label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="hospedaje">Hospedaje</SelectItem>
                    <SelectItem value="fullday">Full Day</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reservations Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Reservaciones ({filteredReservations.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 text-sm font-medium text-stone-600">Cliente</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-stone-600">Tipo</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-stone-600">Fechas</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-stone-600">Habitaciones</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-stone-600">Total</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-stone-600">Estado</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-stone-600">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReservations.map((res) => (
                    <tr key={res.id} className="border-b hover:bg-stone-50">
                      <td className="py-3 px-2">
                        <div>
                          <p className="font-medium text-stone-800">{res.client?.name}</p>
                          <p className="text-xs text-stone-500 flex items-center gap-1">
                            <Phone size={12} /> {res.client?.phone}
                          </p>
                          {res.client?.email && (
                            <p className="text-xs text-stone-500 flex items-center gap-1">
                              <Mail size={12} /> {res.client?.email}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          res.reservation_type === 'hospedaje' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {res.reservation_type === 'hospedaje' ? 'Hospedaje' : 'Full Day'}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <p className="text-sm">{res.check_in_date}</p>
                        {res.check_out_date && res.check_out_date !== res.check_in_date && (
                          <p className="text-xs text-stone-500">hasta {res.check_out_date}</p>
                        )}
                      </td>
                      <td className="py-3 px-2">
                        {res.rooms?.length > 0 ? (
                          res.rooms.map((room, i) => (
                            <span key={i} className="block text-sm">{room}</span>
                          ))
                        ) : (
                          <span className="text-stone-400 text-sm">{res.num_guests} personas</span>
                        )}
                      </td>
                      <td className="py-3 px-2 font-medium">€{res.total_price}</td>
                      <td className="py-3 px-2">{getStatusBadge(res.status)}</td>
                      <td className="py-3 px-2">
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditClick(res)}
                          >
                            <Edit size={16} />
                          </Button>
                          {res.status !== 'cancelled' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleCancel(res.id)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
              {filteredReservations.map((res) => (
                <div key={res.id} className="border rounded-lg p-4 bg-white">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-medium text-stone-800">{res.client?.name}</p>
                      <p className="text-xs text-stone-500">{res.client?.phone}</p>
                    </div>
                    {getStatusBadge(res.status)}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                    <div>
                      <p className="text-stone-500 text-xs">Tipo</p>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        res.reservation_type === 'hospedaje' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {res.reservation_type === 'hospedaje' ? 'Hospedaje' : 'Full Day'}
                      </span>
                    </div>
                    <div>
                      <p className="text-stone-500 text-xs">Total</p>
                      <p className="font-bold text-stone-800">€{res.total_price}</p>
                    </div>
                    <div>
                      <p className="text-stone-500 text-xs">Fechas</p>
                      <p className="text-stone-800">{res.check_in_date}</p>
                      {res.check_out_date && res.check_out_date !== res.check_in_date && (
                        <p className="text-stone-500 text-xs">hasta {res.check_out_date}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-stone-500 text-xs">Habitación</p>
                      <p className="text-stone-800">
                        {res.rooms?.length > 0 ? res.rooms.join(', ') : `${res.num_guests} pers.`}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 border-t pt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleEditClick(res)}
                    >
                      <Edit size={14} className="mr-1" /> Editar
                    </Button>
                    {res.status !== 'cancelled' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleCancel(res.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
              
            {filteredReservations.length === 0 && (
              <div className="text-center py-8 text-stone-500">
                No hay reservaciones que coincidan con los filtros
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Edit Dialog */}
      <Dialog open={!!editingReservation} onOpenChange={() => setEditingReservation(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Reservación</DialogTitle>
          </DialogHeader>
          
          {editingReservation && (
            <div className="space-y-4">
              <div className="bg-stone-50 p-4 rounded-lg">
                <p className="text-sm text-stone-600">
                  {editingReservation.check_in_date} 
                  {editingReservation.check_out_date && ` - ${editingReservation.check_out_date}`}
                </p>
                <p className="text-sm text-stone-500">
                  {editingReservation.reservation_type === 'hospedaje' ? 'Hospedaje' : 'Full Day'}
                  {editingReservation.rooms?.length > 0 && ` - ${editingReservation.rooms.join(', ')}`}
                </p>
              </div>
              
              <div>
                <Label>Nombre del Cliente</Label>
                <Input
                  value={editData.client_name}
                  onChange={(e) => setEditData({...editData, client_name: e.target.value})}
                  placeholder="Nombre completo"
                />
              </div>
              
              <div>
                <Label>Teléfono</Label>
                <Input
                  value={editData.client_phone}
                  onChange={(e) => setEditData({...editData, client_phone: e.target.value})}
                  placeholder="+58..."
                />
              </div>
              
              {/* Solo mostrar campo de personas para Full Day */}
              {editingReservation.reservation_type === 'fullday' && (
                <div>
                  <Label>Número de Personas</Label>
                  <Input
                    type="number"
                    min="1"
                    max="20"
                    value={editData.num_guests}
                    onChange={(e) => setEditData({...editData, num_guests: e.target.value})}
                    placeholder="Cantidad de personas"
                  />
                  <p className="text-xs text-stone-500 mt-1">
                    El monto se recalculará automáticamente (€5 por persona)
                  </p>
                </div>
              )}
              
              {/* Mostrar info de capacidad para Hospedaje */}
              {editingReservation.reservation_type === 'hospedaje' && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Capacidad:</strong> {editingReservation.num_guests} personas
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    La capacidad de hospedaje es fija según las habitaciones seleccionadas
                  </p>
                </div>
              )}
              
              <div>
                <Label>Estado</Label>
                <Select value={editData.status} onValueChange={(v) => setEditData({...editData, status: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pendiente</SelectItem>
                    <SelectItem value="confirmed">Confirmada</SelectItem>
                    <SelectItem value="cancelled">Cancelada</SelectItem>
                    <SelectItem value="completed">Completada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Notas</Label>
                <Textarea
                  value={editData.notes}
                  onChange={(e) => setEditData({...editData, notes: e.target.value})}
                  placeholder="Notas adicionales..."
                  rows={3}
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingReservation(null)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveEdit} disabled={saving} className="bg-emerald-700 hover:bg-emerald-800">
              {saving ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
