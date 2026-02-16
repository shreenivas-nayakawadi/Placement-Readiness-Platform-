import '../index.css'

interface ContextHeaderProps {
    title: string;
    subtitle: string;
}

export function ContextHeader({ title, subtitle }: ContextHeaderProps) {
    return (
        <div className="context-header">
            <h1 className="context-header__title">{title}</h1>
            <p className="context-header__subtitle">{subtitle}</p>
        </div>
    );
}
