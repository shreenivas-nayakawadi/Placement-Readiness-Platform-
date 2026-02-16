import '../index.css'

interface TopBarProps {
    projectName: string;
    currentStep: number;
    totalSteps: number;
    status: 'Not Started' | 'In Progress' | 'Shipped';
}

export function TopBar({ projectName, currentStep, totalSteps, status }: TopBarProps) {
    return (
        <div className="top-bar">
            <div className="top-bar__project-name">{projectName}</div>
            <div className="top-bar__progress">
                Step {currentStep} / {totalSteps}
            </div>
            <div className="top-bar__status">{status}</div>
        </div>
    );
}
