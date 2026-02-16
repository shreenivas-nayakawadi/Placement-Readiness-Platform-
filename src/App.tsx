import { TopBar } from './components/TopBar'
import { ContextHeader } from './components/ContextHeader'
import { SecondaryPanel } from './components/SecondaryPanel'
import { ProofFooter } from './components/ProofFooter'
import './index.css'

function App() {
  const handleCopy = () => {
    navigator.clipboard.writeText(promptText);
    alert('Prompt copied to clipboard!');
  };

  const handleBuildInLovable = () => {
    alert('Opening Lovable...');
  };

  const handleItWorked = () => {
    alert('Great! Moving to next step.');
  };

  const handleError = () => {
    alert('Error reported. Please review the issue.');
  };

  const handleAddScreenshot = () => {
    alert('Screenshot feature coming soon.');
  };

  const promptText = `Create a premium SaaS design system called "KodNest Premium Build System".

This is not a student project. This must feel like a serious B2C product company.

DESIGN PHILOSOPHY:
- Calm, Intentional, Coherent, Confident
- Not flashy, not loud, not playful, not hackathon-style
- No gradients, no glassmorphism, no neon colors, no animation noise

COLOR SYSTEM:
- Background: #F7F6F3 (off-white)
- Primary text: #111111
- Accent: #8B0000 (deep red)
- Success: muted green
- Warning: muted amber
- Use maximum 4 colors across entire system

TYPOGRAPHY:
- Headings: Serif font, large, confident, generous spacing
- Body: Clean sans-serif, 16–18px, line-height 1.6–1.8, max 720px for text blocks
- No decorative fonts, no random sizes

SPACING SYSTEM (consistent scale):
8px, 16px, 24px, 40px, 64px
Never use random spacing like 13px, 27px, etc. Whitespace is part of design.

GLOBAL LAYOUT STRUCTURE:
Every page must follow: [Top Bar] → [Context Header] → [Primary Workspace + Secondary Panel] → [Proof Footer]

Everything must feel like one mind designed it. No visual drift.`;

  return (
    <div className="app-container">
      <TopBar
        projectName="Placement Readiness Platform"
        currentStep={1}
        totalSteps={9}
        status="In Progress"
      />

      <ContextHeader
        title="Setup Design System"
        subtitle="Create the premium SaaS design system before building any features."
      />

      <div className="workspace">
        <div className="primary-workspace">
          <div className="card">
            <h2>Design System Overview</h2>
            <p>
              The KodNest Premium Build System is a calm, intentional design system
              built for serious B2C products. Every component follows strict design
              principles to ensure visual coherence.
            </p>
          </div>

          <div className="card">
            <h3>Color Palette</h3>
            <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
              <div style={{
                width: '100px',
                height: '100px',
                backgroundColor: '#F7F6F3',
                border: '1px solid #111111'
              }}>
                <div style={{ padding: '8px', fontSize: '12px' }}>#F7F6F3</div>
              </div>
              <div style={{
                width: '100px',
                height: '100px',
                backgroundColor: '#111111',
                color: '#FFFFFF'
              }}>
                <div style={{ padding: '8px', fontSize: '12px' }}>#111111</div>
              </div>
              <div style={{
                width: '100px',
                height: '100px',
                backgroundColor: '#8B0000',
                color: '#FFFFFF'
              }}>
                <div style={{ padding: '8px', fontSize: '12px' }}>#8B0000</div>
              </div>
              <div style={{
                width: '100px',
                height: '100px',
                backgroundColor: '#6B6B6B',
                color: '#FFFFFF'
              }}>
                <div style={{ padding: '8px', fontSize: '12px' }}>#6B6B6B</div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3>Typography Scale</h3>
            <h1 style={{ marginTop: '16px' }}>Heading 1 - Playfair Display</h1>
            <h2>Heading 2 - Playfair Display</h2>
            <h3>Heading 3 - Playfair Display</h3>
            <p>Body text uses Inter with comfortable line height for readability.</p>
          </div>

          <div className="card">
            <h3>Spacing System</h3>
            <p>Consistent spacing scale: 8px, 16px, 24px, 40px, 64px</p>
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              <div style={{ width: '8px', height: '40px', backgroundColor: '#8B0000' }}></div>
              <div style={{ width: '16px', height: '40px', backgroundColor: '#8B0000' }}></div>
              <div style={{ width: '24px', height: '40px', backgroundColor: '#8B0000' }}></div>
              <div style={{ width: '40px', height: '40px', backgroundColor: '#8B0000' }}></div>
              <div style={{ width: '64px', height: '40px', backgroundColor: '#8B0000' }}></div>
            </div>
          </div>

          <div className="card">
            <h3>Components</h3>
            <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
              <button className="btn btn-primary">Primary Button</button>
              <button className="btn btn-secondary">Secondary Button</button>
            </div>
            <div style={{ marginTop: '16px' }}>
              <input className="input" placeholder="Input field example" />
            </div>
          </div>
        </div>

        <SecondaryPanel
          stepTitle="Step 1: Setup Design System"
          stepExplanation="Create the premium SaaS design system before building any features."
          prompt={promptText}
          onCopy={handleCopy}
          onBuildInLovable={handleBuildInLovable}
          onItWorked={handleItWorked}
          onError={handleError}
          onAddScreenshot={handleAddScreenshot}
        />
      </div>

      <ProofFooter />
    </div>
  );
}

export default App;
