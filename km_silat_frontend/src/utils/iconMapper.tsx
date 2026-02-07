
import { Drama, Users, UserPlus, Star, Trophy, Target, Zap, Activity, Info, AlertCircle } from 'lucide-react';

export const getIconByKey = (iconName: string, size: number = 24, className?: string) => {
    switch (iconName.toLowerCase()) {
        case 'drama': return <Drama size={size} className={className} />;
        case 'users': return <Users size={size} className={className} />;
        case 'userplus': return <UserPlus size={size} className={className} />;
        case 'star': return <Star size={size} className={className} />;
        case 'trophy': return <Trophy size={size} className={className} />;
        case 'target': return <Target size={size} className={className} />;
        case 'zap': return <Zap size={size} className={className} />;
        case 'activity': return <Activity size={size} className={className} />;
        case 'info': return <Info size={size} className={className} />;
        case 'art': return <Drama size={size} className={className} />; // Map 'art' to Drama
        case 'double': return <Users size={size} className={className} />; // Map 'double' to Users
        case 'team': return <UserPlus size={size} className={className} />; // Map 'team' to UserPlus
        case 'technique': return <Zap size={size} className={className} />;
        case 'physical': return <Activity size={size} className={className} />;
        case 'tanding': return <Target size={size} className={className} />;
        case 'tampil': return <Drama size={size} className={className} />;
        default: return <AlertCircle size={size} className={className} />;
    }
};

export const getIcon = getIconByKey;
