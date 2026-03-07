import styles from './NavTree.styles.module.css';

export interface NavLinkItem {
  type: 'link';
  id: string;
  label: string;
}

export interface NavGroupItem {
  type: 'group';
  id: string;
  label: string;
  overviewId: string;
  children: Array<{ id: string; label: string }>;
}

export type NavItem = NavLinkItem | NavGroupItem;

interface NavTreeProps {
  activeId: string;
  expandedGroups: Record<string, boolean>;
  items: NavItem[];
  onToggleGroup: (groupId: string) => void;
}

export function NavTree({
  activeId,
  expandedGroups,
  items,
  onToggleGroup
}: NavTreeProps) {
  return (
    <ul id="nav-list">
      {items.map((item) =>
        item.type === 'link' ? (
          <li key={item.id}>
            <a
              className={`nav-link ${activeId === item.id ? 'active' : ''}`}
              href={`#${item.id}`}
              data-nav={item.id}
            >
              {item.label}
            </a>
          </li>
        ) : (
          <li key={item.id}>
            <div className="nav-group">
              <div className={`nav-group-summary ${styles.groupSummary}`}>
                <a
                  className={`nav-link ${styles.groupLink} ${
                    activeId === item.overviewId ? 'active' : ''
                  }`}
                  href={`#${item.overviewId}`}
                  data-nav={item.overviewId}
                >
                  {item.label}
                </a>
                <button
                  type="button"
                  className={styles.toggleButton}
                  aria-expanded={expandedGroups[item.id]}
                  aria-controls={`group-${item.id}`}
                  onClick={() => onToggleGroup(item.id)}
                >
                  {expandedGroups[item.id] ? '−' : '+'}
                </button>
              </div>
              <ul
                id={`group-${item.id}`}
                className="nav-sub-list"
                hidden={!expandedGroups[item.id]}
              >
                {item.children.map((child) => (
                  <li key={child.id}>
                    <a
                      className={`nav-link nav-link-sub ${
                        activeId === child.id ? 'active' : ''
                      }`}
                      href={`#${child.id}`}
                      data-nav={child.id}
                    >
                      {child.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        )
      )}
    </ul>
  );
}
