import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  CreditCard, 
  Shield,
  Edit,
  Camera,
  LogOut
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export function UserProfile() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    firstName: "Juan",
    lastName: "Pérez García",
    email: "juan.perez@email.com",
    phone: "+34 612 345 678",
    address: "Calle Principal 123",
    city: "Madrid",
    postalCode: "28001",
    country: "España",
    dateOfBirth: "15/03/1990",
    accountNumber: "**** **** **** 4582",
    idNumber: "12345678X"
  });

  const handleInputChange = (field: string, value: string) => {
    setUserData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header Card */}
      <Card className="p-6 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl">
                {userData.firstName[0]}{userData.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <Button 
              size="icon" 
              className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
              variant="secondary"
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-2xl">{userData.firstName} {userData.lastName}</h2>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <Shield className="h-3 w-3 mr-1" />
                Verificado
              </Badge>
            </div>
            <p className="text-gray-600 mb-2">{userData.email}</p>
            <p className="text-sm text-gray-500">Cliente desde Enero 2020</p>
          </div>

          <Button 
            variant={isEditing ? "default" : "outline"}
            onClick={() => setIsEditing(!isEditing)}
          >
            <Edit className="h-4 w-4 mr-2" />
            {isEditing ? "Guardar Cambios" : "Editar Perfil"}
          </Button>
        </div>
      </Card>

      {/* Personal Information */}
      <Card className="p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <User className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg">Información Personal</h3>
        </div>
        <Separator className="mb-6" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="firstName">Nombre</Label>
            <Input 
              id="firstName"
              value={userData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              disabled={!isEditing}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="lastName">Apellidos</Label>
            <Input 
              id="lastName"
              value={userData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              disabled={!isEditing}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="dateOfBirth">Fecha de Nacimiento</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                id="dateOfBirth"
                value={userData.dateOfBirth}
                onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                disabled={!isEditing}
                className="mt-1 pl-10"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="idNumber">DNI/NIE</Label>
            <Input 
              id="idNumber"
              value={userData.idNumber}
              onChange={(e) => handleInputChange("idNumber", e.target.value)}
              disabled={!isEditing}
              className="mt-1"
            />
          </div>
        </div>
      </Card>

      {/* Contact Information */}
      <Card className="p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Mail className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg">Información de Contacto</h3>
        </div>
        <Separator className="mb-6" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="email">Correo Electrónico</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                id="email"
                type="email"
                value={userData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                disabled={!isEditing}
                className="mt-1 pl-10"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="phone">Número de Teléfono</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                id="phone"
                type="tel"
                value={userData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                disabled={!isEditing}
                className="mt-1 pl-10"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Address Information */}
      <Card className="p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg">Dirección</h3>
        </div>
        <Separator className="mb-6" />

        <div className="space-y-6">
          <div>
            <Label htmlFor="address">Calle y Número</Label>
            <Input 
              id="address"
              value={userData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              disabled={!isEditing}
              className="mt-1"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="city">Ciudad</Label>
              <Input 
                id="city"
                value={userData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                disabled={!isEditing}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="postalCode">Código Postal</Label>
              <Input 
                id="postalCode"
                value={userData.postalCode}
                onChange={(e) => handleInputChange("postalCode", e.target.value)}
                disabled={!isEditing}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="country">País</Label>
              <Input 
                id="country"
                value={userData.country}
                onChange={(e) => handleInputChange("country", e.target.value)}
                disabled={!isEditing}
                className="mt-1"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Account Information */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg">Información de Cuenta</h3>
        </div>
        <Separator className="mb-6" />

        <div className="space-y-4">
          <div>
            <Label htmlFor="accountNumber">Número de Cuenta</Label>
            <Input 
              id="accountNumber"
              value={userData.accountNumber}
              disabled
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Por seguridad, no puedes modificar tu número de cuenta desde aquí
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-blue-900">Seguridad de tu Cuenta</p>
                <p className="text-xs text-blue-700 mt-1">
                  Tu información está protegida con encriptación de nivel bancario. 
                  Nunca compartiremos tus datos personales con terceros sin tu consentimiento.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Logout Section */}
      <Card className="p-6 mt-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-1">Cerrar Sesión</h3>
            <p className="text-sm text-gray-600">Sal de tu cuenta de forma segura</p>
          </div>
          <Button 
            variant="destructive"
            onClick={handleLogout}
            size="lg"
            className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-3"
          >
            <LogOut className="h-5 w-5 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </Card>
    </div>
  );
}
