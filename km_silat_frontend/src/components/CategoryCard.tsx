import { Link } from 'react-router-dom';
import './CategoryCard.css';

interface CategoryCardProps {
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    to: string;
}

export const CategoryCard = ({ title, subtitle, icon, to }: CategoryCardProps) => {
    return (
        <Link to={to} className="category-card">
            <span className="category-card-icon">{icon}</span>
            <h3 className="category-card-title">{title}</h3>
            <p className="category-card-subtitle">{subtitle}</p>
        </Link>
    );
};
