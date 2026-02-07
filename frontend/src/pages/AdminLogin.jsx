import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Lock, Mail, Loader2, AlertCircle, KeyRound, ArrowLeft, CheckCircle } from 'lucide-react';
import { adminAPI } from '../services/api';
import { toast } from 'sonner';

export const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryStep, setRecoveryStep] = useState(1);
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [recoveryLoading, setRecoveryLoading] = useState(false);
  const [emailHint, setEmailHint] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await adminAPI.login(email, password);
      localStorage.setItem('adminToken', response.access_token);
      localStorage.setItem('adminEmail', response.admin_email);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestReset = async () => {
    setRecoveryLoading(true);
    setError('');
    try {
      const response = await adminAPI.requestPasswordReset();
      setEmailHint(response.email_hint);
      setRecoveryStep(2);
      toast.success('Código enviado al email del administrador');
    } catch (err) {
      setError(err.response?.data?.detail || 'Error enviando código');
    } finally {
      setRecoveryLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    setRecoveryLoading(true);
    setError('');
    try {
      await adminAPI.resetPassword(resetCode, newPassword);
      toast.success('Contraseña actualizada exitosamente');
      setShowRecovery(false);
      setRecoveryStep(1);
      setResetCode('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.detail || 'Error actualizando contraseña');
    } finally {
      setRecoveryLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setShowRecovery(false);
    setRecoveryStep(1);
    setError('');
    setResetCode('');
    setNewPassword('');
    setConfirmPassword('');
  };

  if (showRecovery) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-100 to-emerald-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
              <KeyRound className="text-amber-700" size={32} />
            </div>
            <CardTitle className="text-2xl font-bold text-stone-800">Recuperar Contraseña</CardTitle>
            <p className="text-stone-600">Cabañas AquaValle</p>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 mb-4">
                <AlertCircle size={18} /><span>{error}</span>
              </div>
            )}
            
            {recoveryStep === 1 ? (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg text-sm">
                  Se enviará un código de recuperación al email del administrador registrado.
                </div>
                <Button onClick={handleRequestReset} className="w-full bg-amber-600 hover:bg-amber-700 text-white" disabled={recoveryLoading}>
                  {recoveryLoading ? <><Loader2 className="animate-spin mr-2" size={18} />Enviando...</> : <><Mail className="mr-2" size={18} />Enviar Código</>}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
                  <CheckCircle size={18} className="mt-0.5" />
                  <div><p className="font-medium">Código enviado</p><p>Revisa: {emailHint}</p></div>
                </div>
                
                <div className="space-y-2">
                  <Label>Código de Recuperación</Label>
                  <Input type="text" placeholder="123456" value={resetCode} onChange={(e) => setResetCode(e.target.value.replace(/\D/g, '').slice(0, 6))} className="text-center text-2xl tracking-widest font-mono" maxLength={6} required />
                </div>
                
                <div className="space-y-2">
                  <Label>Nueva Contraseña</Label>
                  <Input type="password" placeholder="Mínimo 6 caracteres" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                </div>
                
                <div className="space-y-2">
                  <Label>Confirmar Contraseña</Label>
                  <Input type="password" placeholder="Repite la contraseña" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                </div>
                
                <Button type="submit" className="w-full bg-emerald-700 hover:bg-emerald-800 text-white" disabled={recoveryLoading || resetCode.length !== 6}>
                  {recoveryLoading ? <><Loader2 className="animate-spin mr-2" size={18} />Actualizando...</> : 'Cambiar Contraseña'}
                </Button>
                
                <Button type="button" variant="ghost" className="w-full" onClick={handleRequestReset} disabled={recoveryLoading}>
                  Reenviar código
                </Button>
              </form>
            )}
            
            <div className="mt-6 text-center border-t pt-4">
              <button onClick={handleBackToLogin} className="text-stone-500 hover:text-stone-700 text-sm flex items-center justify-center gap-1 mx-auto">
                <ArrowLeft size={16} />Volver al login
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 to-emerald-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
            <Lock className="text-emerald-700" size={32} />
          </div>
          <CardTitle className="text-2xl font-bold text-stone-800">Panel de Administración</CardTitle>
          <p className="text-stone-600">Cabañas AquaValle</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                <AlertCircle size={18} /><span>{error}</span>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-stone-400" size={18} />
                <Input id="email" type="email" placeholder="admin@aquavalle.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" required />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-stone-400" size={18} />
                <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10" required />
              </div>
            </div>
            
            <Button type="submit" className="w-full bg-emerald-700 hover:bg-emerald-800 text-white" disabled={loading}>
              {loading ? <><Loader2 className="animate-spin mr-2" size={18} />Iniciando sesión...</> : 'Iniciar Sesión'}
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <button onClick={() => setShowRecovery(true)} className="text-emerald-700 hover:text-emerald-800 text-sm font-medium">
              ¿Olvidaste tu contraseña?
            </button>
          </div>
          
          <div className="mt-4 text-center border-t pt-4">
            <a href="/" className="text-stone-500 hover:text-stone-700 text-sm">← Volver al sitio</a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};