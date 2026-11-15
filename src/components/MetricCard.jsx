import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';

export const MetricCard = ({ title, value, subtitle, icon, tagSeverity = 'info', tagValue }) => {
  return (
    <Card className="surface-card border-round-2xl h-full transition-transform transition-duration-150 hover:scale-102">
      <div className="flex justify-content-between align-items-start mb-2">
        <div>
          <span
            className="block text-xs uppercase mb-1 font-semibold"
            style={{
              color: '#0284c7',
              letterSpacing: '0.06em',
            }}
          >
            {title}
          </span>
          <div
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: '1.75rem',
              fontWeight: 800,
              color: '#0f172a',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
            }}
          >
            {value}
          </div>
        </div>
        <div
          className="flex align-items-center justify-content-center border-round-xl"
          style={{
            width: '3rem',
            height: '3rem',
            background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2) 0%, rgba(2, 132, 199, 0.15) 100%)',
            border: '1px solid rgba(186, 230, 253, 0.9)',
            boxShadow: '0 4px 12px rgba(2, 132, 199, 0.12), inset 0 1px 1px #fff',
          }}
        >
          <i className={`pi ${icon} text-xl`} style={{ color: '#0284c7' }} />
        </div>
      </div>
      <div className="flex align-items-center gap-2 mt-2">
        {tagValue && <Tag severity={tagSeverity} value={tagValue} />}
        <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>
          {subtitle}
        </span>
      </div>
    </Card>
  );
};
