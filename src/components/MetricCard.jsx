import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';

export const MetricCard = ({ title, value, subtitle, icon, tagSeverity = 'info', tagValue }) => {
  return (
    <Card className="surface-card border-round h-full transition-transform transition-duration-150 hover:scale-102">
      <div className="flex justify-content-between align-items-start mb-3">
        <div>
          <span
            className="block text-xs uppercase mb-2"
            style={{ fontFamily: "'Press Start 2P', monospace", color: '#00ffcc', fontSize: '0.62rem', letterSpacing: '1px' }}
          >
            {title}
          </span>
          <div
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: '1.25rem',
              color: '#ffe600',
              textShadow: '0 0 10px rgba(255, 230, 0, 0.4)',
              letterSpacing: '1px'
            }}
          >
            {value}
          </div>
        </div>
        <div
          className="flex align-items-center justify-content-center border-round"
          style={{
            width: '2.8rem',
            height: '2.8rem',
            background: 'rgba(255, 0, 127, 0.15)',
            border: '2px solid #ff007f',
            boxShadow: '0 0 10px rgba(255, 0, 127, 0.4)'
          }}
        >
          <i className={`pi ${icon} text-xl`} style={{ color: '#ff007f' }} />
        </div>
      </div>
      <div className="flex align-items-center gap-2 mt-2">
        {tagValue && <Tag severity={tagSeverity} value={tagValue} />}
        <span style={{ fontFamily: "'VT323', monospace", fontSize: '1.2rem', color: '#a89bc9' }}>
          {subtitle}
        </span>
      </div>
    </Card>
  );
};
