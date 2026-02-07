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
        <div className="content-page-header">
            <Link to={backTo} className="content-header-back">
                <ChevronLeft size={24} />
            </Link>

            {(title || subtitle) && (
                <div className="content-header-text">
                    {title && <h1 className="content-header-title">{title}</h1>}
                    {subtitle && <p className="content-header-subtitle">{subtitle}</p>}
                </div>
            )}

            {icon && (
                <div className="content-header-icon">
                    {icon}
                </div>
            )}
        </div>
    );
};