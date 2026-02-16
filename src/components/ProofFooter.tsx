import '../index.css'
import { useState } from 'react'

interface ProofItem {
    id: string;
    label: string;
    checked: boolean;
}

export function ProofFooter() {
    const [items, setItems] = useState<ProofItem[]>([
        { id: 'ui-built', label: 'UI Built', checked: false },
        { id: 'logic-working', label: 'Logic Working', checked: false },
        { id: 'test-passed', label: 'Test Passed', checked: false },
        { id: 'deployed', label: 'Deployed', checked: false },
    ]);

    const toggleItem = (id: string) => {
        setItems((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, checked: !item.checked } : item
            )
        );
    };

    return (
        <div className="proof-footer">
            <h3 className="proof-footer__title">Proof Checklist</h3>
            <div className="proof-footer__checklist">
                {items.map((item) => (
                    <div key={item.id} className="proof-footer__item">
                        <input
                            type="checkbox"
                            className="proof-footer__checkbox"
                            checked={item.checked}
                            onChange={() => toggleItem(item.id)}
                        />
                        <span>{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
