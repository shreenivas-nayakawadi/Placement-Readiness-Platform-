import '../index.css'

interface SecondaryPanelProps {
    stepTitle: string;
    stepExplanation: string;
    prompt: string;
    onCopy: () => void;
    onBuildInLovable: () => void;
    onItWorked: () => void;
    onError: () => void;
    onAddScreenshot: () => void;
}

export function SecondaryPanel({
    stepTitle,
    stepExplanation,
    prompt,
    onCopy,
    onBuildInLovable,
    onItWorked,
    onError,
    onAddScreenshot,
}: SecondaryPanelProps) {
    return (
        <div className="secondary-panel">
            <div className="secondary-panel__section">
                <h3 className="secondary-panel__title">{stepTitle}</h3>
                <p style={{ fontSize: '14px', lineHeight: '1.5' }}>{stepExplanation}</p>
            </div>

            <div className="secondary-panel__section">
                <h3 className="secondary-panel__title">Prompt</h3>
                <div className="secondary-panel__prompt">{prompt}</div>
                <div className="secondary-panel__actions">
                    <button className="btn btn-primary" onClick={onCopy}>
                        Copy
                    </button>
                    <button className="btn btn-secondary" onClick={onBuildInLovable}>
                        Build in Lovable
                    </button>
                    <button className="btn btn-secondary" onClick={onItWorked}>
                        It Worked
                    </button>
                    <button className="btn btn-secondary" onClick={onError}>
                        Error
                    </button>
                    <button className="btn btn-secondary" onClick={onAddScreenshot}>
                        Add Screenshot
                    </button>
                </div>
            </div>
        </div>
    );
}
