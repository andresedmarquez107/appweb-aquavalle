import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Checkbox } from '../components/ui/checkbox';
import { toast } from 'sonner';
import {
  Calendar, ArrowLeft, Plus, Trash2, Loader2, Home, Wrench, PartyPopper, Ban, Sun
} from 'lucide-react';
import { adminAPI, roomsAPI } from '../services/api';

export const AdminBlocks = () => {
  const navigate = useNavigate();
  const [blocks, setBlocks] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newBlock, setNewBlock] = useState({
    room_id: '',
    start_date: '',
    end_date: '',
    block_type: 'maintenance',
    reason: '',
    blocks_fullday: false
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    loadData();
  }, [navigate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [blocksData, roomsData] = await Promise.all([
        adminAPI.getBlocks(),
        roomsAPI.getAll()
      ]);
      setBlocks(blocksData);
      setRooms(roomsData);
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

  const handleCreateBlock = async () => {
    if (!newBlock.start_date || !newBlock.end_date) {
      toast.error('Por favor selecciona las fechas');
      return;
    }

    setSaving(true);
    try {
      await adminAPI.createBlock({
        room_id: newBlock.room_id || null,
        start_date: newBlock.start_date,
        end_date: newBlock.end_date,
        block_type: newBlock.block_type,
        reason: newBlock.reason || null,
        blocks_fullday: newBlock.blocks_fullday
      });
      toast.success('Bloqueo creado exitosamente');
      setShowCreateDialog(false);
      setNewBlock({
        room_id: '',
        start_date: '',
        end_date: '',
        block_type: 'maintenance',
        reason: '',
        blocks_fullday: false
      });
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Error creando bloqueo');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBlock = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este bloqueo?')) return;
    try {
      await adminAPI.deleteBlock(id);
      toast.success('Bloqueo eliminado');
      loadData();
    } catch (err) {
      toast.error('Error eliminando bloqueo');
    }
  };

  const getBlockTypeIcon = (type) => {
    switch (type) {
      case 'maintenance': return <Wrench size={16} className="text-amber-600" />;
      case 'private_event': return <PartyPopper size={16} className="text-purple-600" />;
      default: return <Ban size={16} className="text-red-600" />;
    }
  };

  const getBlockTypeLabel = (type) => {
    switch (type) {
      case 'maintenance': return 'Mantenimiento';
      case 'private_event': return 'Evento Privado';
      default: return 'Otro';
    }
  };

  const getBlockTypeBadge = (type) => {
    const styles = {
      maintenance: 'bg-amber-100 text-amber-800',
      private_event: 'bg-purple-100 text-purple-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${styles[type] || styles.other}`}>
        {getBlockTypeIcon(type)}
        {getBlockTypeLabel(type)}
      </span>
    );
  };

  if (loading) {
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
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/admin')}>
                <ArrowLeft size={18} className="mr-1" /> Volver
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-stone-800">Bloqueo de Fechas</h1>
                <p className="text-stone-600 text-sm">Gestionar disponibilidad de habitaciones</p>
              </div>
            </div>
            <Button onClick={() => setShowCreateDialog(true)} className="bg-emerald-700 hover:bg-emerald-800">
              <Plus size={18} className="mr-1" /> Nuevo Bloqueo
            </Button>
          </div>
          
          {/* Mobile Layout */}
          <div className="md:hidden">
            <div className="flex items-center gap-2 mb-3">
              <Button variant="ghost" size="sm" onClick={() => navigate('/admin')}>
                <ArrowLeft size={18} />
              </Button>
              <div>
                <h1 className="text-lg font-bold text-stone-800">Bloqueo de Fechas</h1>
                <p className="text-stone-500 text-xs">Gestionar disponibilidad</p>
              </div>
            </div>
            <Button onClick={() => setShowCreateDialog(true)} className="w-full bg-emerald-700 hover:bg-emerald-800">
              <Plus size={18} className="mr-1" /> Nuevo Bloqueo
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Info Card */}
        <Card className="mb-6 bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <p className="text-blue-800 text-sm">
              <strong>¿Cómo funciona?</strong> Los bloqueos impiden que los clientes reserven ciertas fechas. 
              Puedes bloquear una habitación específica o todas las habitaciones a la vez.
              Las fechas bloqueadas aparecerán como no disponibles en el calendario de reservas.
            </p>
          </CardContent>
        </Card>

        {/* Blocks List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar size={20} />
              Bloqueos Activos ({blocks.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {blocks.length === 0 ? (
              <div className="text-center py-8 text-stone-500">
                No hay bloqueos configurados
              </div>
            ) : (
              <div className="space-y-4">
                {blocks.map((block) => (
                  <div 
                    key={block.id} 
                    className="flex items-center justify-between p-4 bg-stone-50 rounded-lg border"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border">
                        <Home size={20} className="text-stone-600" />
                      </div>
                      <div>
                        <p className="font-medium text-stone-800">{block.room_name}</p>
                        <p className="text-sm text-stone-600">
                          {block.start_date} → {block.end_date}
                        </p>
                        {block.reason && (
                          <p className="text-xs text-stone-500 mt-1">"{block.reason}"</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {getBlockTypeBadge(block.block_type)}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteBlock(block.id)}
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Create Block Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Bloqueo</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>Habitación</Label>
              <Select 
                value={newBlock.room_id || 'all'} 
                onValueChange={(v) => setNewBlock({...newBlock, room_id: v === 'all' ? '' : v})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar habitación" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las habitaciones</SelectItem>
                  {rooms.map(room => (
                    <SelectItem key={room.id} value={room.id}>{room.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-stone-500 mt-1">
                Deja vacío para bloquear todas las habitaciones
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Fecha Inicio</Label>
                <Input
                  type="date"
                  value={newBlock.start_date}
                  onChange={(e) => setNewBlock({...newBlock, start_date: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <Label>Fecha Fin</Label>
                <Input
                  type="date"
                  value={newBlock.end_date}
                  onChange={(e) => setNewBlock({...newBlock, end_date: e.target.value})}
                  min={newBlock.start_date || new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
            
            <div>
              <Label>Tipo de Bloqueo</Label>
              <Select 
                value={newBlock.block_type} 
                onValueChange={(v) => setNewBlock({...newBlock, block_type: v})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="maintenance">
                    <span className="flex items-center gap-2">
                      <Wrench size={14} /> Mantenimiento
                    </span>
                  </SelectItem>
                  <SelectItem value="private_event">
                    <span className="flex items-center gap-2">
                      <PartyPopper size={14} /> Evento Privado
                    </span>
                  </SelectItem>
                  <SelectItem value="other">
                    <span className="flex items-center gap-2">
                      <Ban size={14} /> Otro
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Motivo (opcional)</Label>
              <Textarea
                value={newBlock.reason}
                onChange={(e) => setNewBlock({...newBlock, reason: e.target.value})}
                placeholder="Ej: Reparación de baño, cumpleaños familiar..."
                rows={2}
              />
            </div>
            
            {/* Checkbox para Full Day */}
            <div className="flex items-center space-x-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
              <Checkbox
                id="blocks_fullday"
                checked={newBlock.blocks_fullday}
                onCheckedChange={(checked) => setNewBlock({...newBlock, blocks_fullday: checked})}
              />
              <div className="flex-1">
                <Label htmlFor="blocks_fullday" className="text-amber-800 font-medium cursor-pointer flex items-center gap-2">
                  <Sun size={16} />
                  Bloquear también para Full Day
                </Label>
                <p className="text-xs text-amber-600 mt-1">
                  Marcando esta opción, las fechas también quedarán bloqueadas para el servicio de día completo
                </p>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleCreateBlock} 
              disabled={saving} 
              className="bg-emerald-700 hover:bg-emerald-800"
            >
              {saving ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
              Crear Bloqueo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
