import React from 'react';

function DashboardCard({ title, subtitle, actions, children, className = '', hidden = false }) {
  return (
    <section className={`dashboard-card ${hidden ? 'is-hidden' : ''} ${className}`.trim()}>
      <div className="dashboard-card__header">
        <div>
          <h2>{title}</h2>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
        {actions ? <div className="dashboard-card__actions">{actions}</div> : null}
      </div>
      {children}
    </section>
  );
}

export default React.memo(DashboardCard);
