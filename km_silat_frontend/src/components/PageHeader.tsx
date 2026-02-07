import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import './PageHeader.css';

interface PageHeaderProps {
    backTo: string;
    title?: string;
    subtitle?: string;
    icon?: React.ReactNode;
}

export const PageHeader = ({ backTo, title, subtitle, icon }: PageHeaderProps) => {
    return (
        <header className="page-header">
            <Link to={backTo} className="page-header-back">
                <ChevronLeft size={24} />
            </Link>

            {(title || subtitle) && (
                <div className="page-header-content">
                    {title && <h1 className="page-header-title">{title}</h1>}
                    {subtitle && <p className="page-header-subtitle">{subtitle}</p>}
                </div>
            )}

            {icon && (
                <div className="page-header-icon">
                    {icon}
                </div>
            )}
        </header>
    );
};
