import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/motion/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useMotionAuth } from '@/hooks/useMotionAuth';
import { Calendar, Users, MapPin, Smartphone } from 'lucide-react';
import derTourLogo from '@/assets/der-tour-logo.png';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, role, isLoading } = useMotionAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated && role === 'guest') {
      navigate('/program');
    }
  }, [isAuthenticated, role, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Načítám...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header title="Motion Klub" />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <img src={derTourLogo} alt="DERTOUR" className="h-12 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Vítejte v Motion klubu
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Objevte zábavné aktivity a programy během vaší dovolené. 
              Rezervujte si místa na sportovních aktivitách, wellness programech a rodinných událostech.
            </p>
          </div>
          
          <div className="space-y-4 max-w-md mx-auto">
            <Button 
              onClick={() => navigate('/login')}
              size="lg"
              className="w-full"
            >
              Přihlásit se jako host
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => navigate('/animator/login')}
              size="lg" 
              className="w-full"
            >
              Přihlášení animátorů
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <Calendar className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Aktuální program</h3>
              <p className="text-sm text-muted-foreground">
                Zobrazení aktivit podle vašeho pobytového období
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Snadné rezervace</h3>
              <p className="text-sm text-muted-foreground">
                Rezervace pro celou rodinu jedním kliknutím
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <MapPin className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Přehled míst</h3>
              <p className="text-sm text-muted-foreground">
                Informace o lokacích a kapacitách aktivit
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Smartphone className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Mobilní přístup</h3>
              <p className="text-sm text-muted-foreground">
                Optimalizováno pro mobily a tablety
              </p>
            </CardContent>
          </Card>
        </div>

        {/* QR Code Info */}
        <div className="bg-muted rounded-lg p-6 text-center">
          <h3 className="font-semibold mb-2">Rychlý přístup pomocí QR kódu</h3>
          <p className="text-sm text-muted-foreground">
            Naskenujte QR kód ve vašem hotelu pro přímé přihlášení do Motion klubu.
          </p>
        </div>
      </div>

      <footer className="bg-muted border-t border-border mt-16 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 DERTOUR Group. Všechna práva vyhrazena.
          </p>
          <div className="mt-2">
            <a 
              href="#" 
              className="text-sm text-primary hover:underline mr-4"
            >
              Stáhnout PDF program
            </a>
            <a 
              href="#" 
              className="text-sm text-primary hover:underline"
            >
              Kontakt
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
