import React, { useState } from 'react';
import { AnimatorLayout } from '@/components/motion/AnimatorLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  User,
  Camera,
  Phone,
  Mail,
  Badge,
  Save,
  Edit
} from 'lucide-react';

export const AnimatorProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Mock animator profile data
  const [profile, setProfile] = useState({
    id: 'animator01',
    firstName: 'Jan',
    lastName: 'Novák',
    nickname: 'Jenda',
    email: 'jan.novak@dertour.cz',
    phone: '+420 123 456 789',
    bio: 'Zkušený animátor s více než 5 lety praxe. Specializuji se na vodní sporty a aktivity pro děti.',
    avatar: '/api/placeholder/150/150',
    hotel: 'Hotel Aurora',
    position: 'Senior Animátor',
    startDate: '2019-06-01',
    languages: ['Čeština', 'Angličtina', 'Němčina'],
    specializations: ['Vodní sporty', 'Dětské aktivity', 'Yoga', 'Aqua aerobik']
  });

  const handleSave = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Profil uložen",
        description: "Vaše údaje byly úspěšně aktualizovány.",
      });
      setIsEditing(false);
      setIsSaving(false);
    }, 1000);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form would go here in real app
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In real app, this would upload to server
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfile(prev => ({
          ...prev,
          avatar: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
      
      toast({
        title: "Fotografie nahrána",
        description: "Nezapomeňte uložit změny.",
      });
    }
  };

  return (
    <AnimatorLayout title="Profil animátora">
      <div className="space-y-6">
        {/* Profile Header */}
        <div className="activity-card p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img
                  src={profile.avatar}
                  alt="Profilová fotografie"
                  className="w-24 h-24 rounded-full object-cover border-4 border-primary"
                />
                {isEditing && (
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full cursor-pointer hover:bg-primary/90"
                  >
                    <Camera className="w-4 h-4" />
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {profile.firstName} {profile.lastName}
                </h2>
                <p className="text-primary font-medium">"{profile.nickname}"</p>
                <p className="text-muted-foreground">{profile.position}</p>
                <p className="text-sm text-muted-foreground">{profile.hotel}</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Upravit profil
                </Button>
              ) : (
                <>
                  <Button variant="outline" onClick={handleCancel}>
                    Zrušit
                  </Button>
                  <Button onClick={handleSave} disabled={isSaving}>
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? 'Ukládám...' : 'Uložit'}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="activity-card p-6">
          <div className="flex items-center mb-4">
            <User className="w-5 h-5 mr-2 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Osobní údaje</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">Jméno</Label>
              <Input
                id="firstName"
                value={profile.firstName}
                onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
                disabled={!isEditing}
              />
            </div>
            
            <div>
              <Label htmlFor="lastName">Příjmení</Label>
              <Input
                id="lastName"
                value={profile.lastName}
                onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
                disabled={!isEditing}
              />
            </div>
            
            <div>
              <Label htmlFor="nickname">Přezdívka</Label>
              <Input
                id="nickname"
                value={profile.nickname}
                onChange={(e) => setProfile(prev => ({ ...prev, nickname: e.target.value }))}
                disabled={!isEditing}
                placeholder="Jak vás znají účastníci"
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Telefon</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                  disabled={!isEditing}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="md:col-span-2">
              <Label htmlFor="email">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  value={profile.email}
                  disabled={true} // Email usually can't be changed
                  className="pl-10 bg-muted"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="activity-card p-6">
          <div className="flex items-center mb-4">
            <Badge className="w-5 h-5 mr-2 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">O mně</h3>
          </div>
          
          <div>
            <Label htmlFor="bio">Popis</Label>
            <Textarea
              id="bio"
              value={profile.bio}
              onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
              disabled={!isEditing}
              rows={4}
              placeholder="Napište něco o sobě, své zkušenosti a specializaci..."
            />
          </div>
        </div>

        {/* Work Information */}
        <div className="activity-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Pracovní informace</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Pozice</h4>
              <p className="text-muted-foreground">{profile.position}</p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Hotel</h4>
              <p className="text-muted-foreground">{profile.hotel}</p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Začátek práce</h4>
              <p className="text-muted-foreground">
                {new Date(profile.startDate).toLocaleDateString('cs-CZ', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">ID Animátora</h4>
              <p className="text-muted-foreground font-mono">{profile.id}</p>
            </div>
          </div>
        </div>

        {/* Skills and Languages */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="activity-card p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Jazyky</h3>
            <div className="flex flex-wrap gap-2">
              {profile.languages.map((language, index) => (
                <span
                  key={index}
                  className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                >
                  {language}
                </span>
              ))}
            </div>
          </div>
          
          <div className="activity-card p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Specializace</h3>
            <div className="flex flex-wrap gap-2">
              {profile.specializations.map((spec, index) => (
                <span
                  key={index}
                  className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AnimatorLayout>
  );
};