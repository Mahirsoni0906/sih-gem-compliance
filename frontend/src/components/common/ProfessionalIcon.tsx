import React from 'react';
import {
  Sparkles,
  Award,
  ShieldCheck,
  ShieldAlert,
  Shield,
  Store,
  Landmark,
  Building2,
  Building,
  Rocket,
  Layers,
  Compass,
  Leaf,
  HeartHandshake,
  Scale,
  Gavel,
  GraduationCap,
  HelpCircle,
  Ticket,
  Bot,
  FileText,
  ClipboardList,
  BarChart3,
  Package,
  PackageCheck,
  CreditCard,
  Monitor,
  FileCheck,
  User,
  Users,
  Flame,
  Search,
  Clock,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  X,
  Menu,
  UploadCloud,
  RotateCw,
  Info,
  Link2,
  MessageSquare,
  HardHat,
  Key,
  Zap,
  Car,
  Utensils,
  Truck,
  Server,
  Printer,
  Wrench,
  Activity,
  Stethoscope,
  Laptop,
  Armchair,
  Cog,
  Globe,
  Star,
  Ban,
  Check,
  Lock,
  ChevronRight,
  Send,
  Eye,
  BadgeCheck,
} from 'lucide-react';

/**
 * Enterprise category & initiative icon badge renderer.
 * Replaces childish/kid-like emojis with sovereign, crisp SVG icons.
 */
export const EnterpriseIconBadge: React.FC<{
  type: string;
  className?: string;
  size?: number;
}> = ({ type, className = 'w-6 h-6', size }) => {
  const norm = (type || '').toLowerCase().trim();

  // Womaniya on GeM (Women Entrepreneurs)
  if (norm.includes('womaniya') || norm === '💃') {
    return <Sparkles className={className} size={size} />;
  }

  // Tribal & Khadi India (Heritage / Artisans)
  if (norm.includes('tribal') || norm.includes('khadi') || norm === '🏹') {
    return <Compass className={className} size={size} />;
  }

  // Saras Collection (Rural Artisans)
  if (norm.includes('saras') || norm === '🧺') {
    return <Store className={className} size={size} />;
  }

  // ODOP GeM Bazaar (One District One Product)
  if (norm.includes('odop') || norm === '🏺') {
    return <Landmark className={className} size={size} />;
  }

  // Startup Runway
  if (norm.includes('startup') || norm === '🚀') {
    return <Rocket className={className} size={size} />;
  }

  // Handloom & Textiles
  if (norm.includes('handloom') || norm.includes('textile') || norm === '🧵') {
    return <Layers className={className} size={size} />;
  }

  // Millet (Shree Anna)
  if (norm.includes('millet') || norm.includes('anna') || norm === '🌾') {
    return <Leaf className={className} size={size} />;
  }

  // Aatmanirbhar / Aabhaar
  if (norm.includes('aatmanirbhar') || norm.includes('aabhaar') || norm === '🇮🇳') {
    return <ShieldCheck className={className} size={size} />;
  }

  // Oxygen Gas / Medical
  if (norm.includes('oxygen') || norm.includes('medical') || norm === '🧪' || norm === '🩺') {
    return <Activity className={className} size={size} />;
  }

  // Computers & IT
  if (norm.includes('computer') || norm.includes('it') || norm === '🖥️' || norm === '💻') {
    return <Monitor className={className} size={size} />;
  }

  // Furniture
  if (norm.includes('furniture') || norm === '🪑') {
    return <Armchair className={className} size={size} />;
  }

  // Fire Safety
  if (norm.includes('fire') || norm === '🧯') {
    return <ShieldAlert className={className} size={size} />;
  }

  // Industrial / Valves / Maintenance
  if (norm.includes('valve') || norm.includes('industrial') || norm === '⚙️') {
    return <Cog className={className} size={size} />;
  }

  // Security / Police
  if (norm.includes('security') || norm === '👮‍♂️') {
    return <ShieldCheck className={className} size={size} />;
  }

  // Transport / Vehicles
  if (norm.includes('cab') || norm.includes('transport') || norm.includes('vehicle') || norm === '🚗' || norm === '🚕') {
    return <Car className={className} size={size} />;
  }

  // Manpower
  if (norm.includes('manpower') || norm === '👥') {
    return <Users className={className} size={size} />;
  }

  // Catering / Food
  if (norm.includes('catering') || norm.includes('hospitality') || norm === '🍽️' || norm === '🍲') {
    return <Utensils className={className} size={size} />;
  }

  // Freight / Logistics
  if (norm.includes('goods') || norm.includes('truck') || norm === '🚚') {
    return <Truck className={className} size={size} />;
  }

  // Drone
  if (norm.includes('drone') || norm === '🚁') {
    return <Send className={className} size={size} />;
  }

  // Facility Management
  if (norm.includes('facility') || norm === '🧹') {
    return <Building className={className} size={size} />;
  }

  // Default fallback
  return <Package className={className} size={size} />;
};

export {
  Sparkles,
  Award,
  ShieldCheck,
  ShieldAlert,
  Shield,
  Store,
  Landmark,
  Building2,
  Building,
  Rocket,
  Layers,
  Compass,
  Leaf,
  HeartHandshake,
  Scale,
  Gavel,
  GraduationCap,
  HelpCircle,
  Ticket,
  Bot,
  FileText,
  ClipboardList,
  BarChart3,
  Package,
  PackageCheck,
  CreditCard,
  Monitor,
  FileCheck,
  User,
  Users,
  Flame,
  Search,
  Clock,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  X,
  Menu,
  UploadCloud,
  RotateCw,
  Info,
  Link2,
  MessageSquare,
  HardHat,
  Key,
  Zap,
  Car,
  Utensils,
  Truck,
  Server,
  Printer,
  Wrench,
  Activity,
  Stethoscope,
  Laptop,
  Armchair,
  Cog,
  Globe,
  Star,
  Ban,
  Check,
  Lock,
  ChevronRight,
  Send,
  Eye,
  BadgeCheck,
};
