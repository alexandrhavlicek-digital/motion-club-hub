import React, { useState } from 'react';
import { Header } from '@/components/motion/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMotionAuth } from '@/hooks/useMotionAuth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Shield } from 'lucide-react';

export const AnimatorLogin: React.FC = () => {
  const [animatorId, setAnimatorId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { loginAsAnimator } = useMotionAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!animatorId || !password) {
      toast({
        title: "Chyba",
        description: "Prosím vyplňte všechna pole.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const success = await loginAsAnimator(animatorId, password);
      if (success) {
        toast({
          title: "Přihlášení úspěšné",
          description: "Vítejte v animátorské sekci.",
        });
        navigate('/animator/dashboard');
      } else {
        toast({
          title: "Chyba přihlášení",
          description: "Neplatné přihlašovací údaje.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Chyba",
        description: "Došlo k chybě při přihlašování.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Mock SSO login
  const handleSSOLogin = async () => {
    setIsLoading(true);
    
    // Simulate SSO login delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const success = await loginAsAnimator('animator01', 'demo');
    if (success) {
      toast({
        title: "SSO Přihlášení úspěšné",
        description: "Přihlášeno přes Microsoft Active Directory.",
      });
      navigate('/animator/dashboard');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header title="Animátor - Přihlášení" />
      
      <div className="container mx-auto px-4 py-8 max-w-md">
        <div className="activity-card p-6">
          <div className="text-center mb-6">
            <Shield className="w-12 h-12 mx-auto text-primary mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Přihlášení animátora
            </h2>
            <p className="text-muted-foreground text-sm">
              Přístup pouze pro autorizované animátory
            </p>
          </div>

          {/* SSO Login Button */}
          <Button
            onClick={handleSSOLogin}
            disabled={isLoading}
            className="w-full mb-4"
            variant="default"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Přihlašuji přes SSO...
              </>
            ) : (
              'Přihlásit přes Microsoft AD (SSO)'
            )}
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                nebo manuálně
              </span>
            </div>
          </div>

          {/* Manual Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="animatorId">ID Animátora</Label>
              <Input
                id="animatorId"
                type="text"
                value={animatorId}
                onChange={(e) => setAnimatorId(e.target.value)}
                placeholder="animator01"
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="password">Heslo</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
              variant="outline"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Přihlašuji...
                </>
              ) : (
                'Manuální přihlášení'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              Demo přístup: ID "animator01", heslo "demo"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};