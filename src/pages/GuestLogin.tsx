import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Header } from '@/components/motion/Header';
import { useMotionAuth } from '@/hooks/useMotionAuth';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export const GuestLogin: React.FC = () => {
  const navigate = useNavigate();
  const { loginAsGuest } = useMotionAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    bnr: '',
    email: '',
    adultCount: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await loginAsGuest(
        formData.bnr, 
        formData.email, 
        formData.adultCount ? parseInt(formData.adultCount) : undefined
      );

      if (success) {
        toast({
          title: "Přihlášení úspěšné",
          description: "Vítejte v Motion klubu!",
        });
        navigate('/program');
      } else {
        toast({
          title: "Chyba přihlášení",
          description: "Zkontrolujte své údaje a zkuste to znovu.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Chyba",
        description: "Něco se pokazilo. Zkuste to znovu.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header title="Motion Klub" />
      
      <div className="container mx-auto px-4 py-8 max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-foreground">
              Přihlášení hosty
            </CardTitle>
            <p className="text-muted-foreground">
              Zadejte své údaje pro přístup k programu aktivit
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bnr">Číslo rezervace (BNR) *</Label>
                <Input
                  id="bnr"
                  type="text"
                  placeholder="např. 191754321"
                  value={formData.bnr}
                  onChange={(e) => handleInputChange('bnr', e.target.value)}
                  required
                  className="border-input-border focus:border-input-border-focus"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail objednatele *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="vas@email.cz"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  className="border-input-border focus:border-input-border-focus"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="adultCount">Počet dospělých v rezervaci (volitelné)</Label>
                <Input
                  id="adultCount"
                  type="number"
                  placeholder="2"
                  value={formData.adultCount}
                  onChange={(e) => handleInputChange('adultCount', e.target.value)}
                  min="1"
                  max="10"
                  className="border-input-border focus:border-input-border-focus"
                />
              </div>

              <div className="bg-muted p-3 rounded-md text-sm text-muted-foreground">
                <p>🛡️ Vaše data jsou chráněna pomocí reCAPTCHA</p>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !formData.bnr || !formData.email}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Ověřuji údaje...
                  </>
                ) : (
                  'Přihlásit se'
                )}
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t border-border text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Jste animátor?
              </p>
              <Button
                variant="outline"
                onClick={() => navigate('/animator/login')}
                className="w-full"
              >
                Přihlášení animátorů
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-xs text-muted-foreground">
          <p>© 2025 DERTOUR Group. Všechna práva vyhrazena.</p>
        </div>
      </div>
    </div>
  );
};