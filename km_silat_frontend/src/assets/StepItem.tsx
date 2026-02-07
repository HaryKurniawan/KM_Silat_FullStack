// import { Link } from 'react-router-dom';
// import type { RoadmapItem } from '../data/roadmaps';
// import { ChevronRight } from 'lucide-react';
// import './StepItem.css';

// interface StepItemProps {
//     item: RoadmapItem;
//     category: string;
//     index: number;
//     isLast: boolean;
//     accentColor: string;
// }

// export const StepItem = ({ item, category, index, isLast, accentColor }: StepItemProps) => {
//     return (
//         <Link
//             to={`/${category}/${item.id}`}
//             className="step-item"
//             style={{ animationDelay: `${index * 0.08}s` }}
//         >
//             {!isLast && <div className="step-timeline-line" />}

//             <div className="step-timeline-dot">
//                 <div className="step-point" style={{ '--step-accent': accentColor || 'var(--text-primary)' } as React.CSSProperties}></div>
//             </div>

//             <div className="step-content">
//                 <div className="step-header">
//                     <span className="step-label">{item.label}</span>
//                 </div>
//                 <h3 className="step-title">{item.title}</h3>
//                 <p className="step-description">{item.description}</p>
//             </div>

//             <div className="step-arrow">
//                 <ChevronRight size={20} />
//             </div>
//         </Link>
//     );
// };
