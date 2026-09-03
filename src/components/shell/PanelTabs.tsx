/**
 * Sub-tab strip for the four panels that carry one.
 *
 * v3 collapses thirteen flat panels into eight; these tabs are where the
 * absorbed sections went. They sit above the panel header so switching tabs
 * swaps the heading too, which keeps each tab reading as its own screen.
 */
import { border, brandFill, color, font } from '../../design/tokens'

interface PanelTabsProps<Tab extends string> {
  tabs: readonly Tab[]
  active: Tab
  onSelect: (tab: Tab) => void
  /** Names the group for assistive tech, e.g. "Leaderboard views". */
  label: string
}

export function PanelTabs<Tab extends string>({
  tabs,
  active,
  onSelect,
  label,
}: PanelTabsProps<Tab>) {
  return (
    <div
      role="tablist"
      aria-label={label}
      style={{
        display: 'flex',
        gap: 4,
        padding: '22px 44px 0',
        position: 'relative',
        // Above the panel's name overlay, so tabs stay clickable.
        zIndex: 3,
      }}
    >
      {tabs.map((tab) => {
        const on = tab === active
        return (
          <button
            key={tab}
            role="tab"
            aria-selected={on}
            onClick={() => onSelect(tab)}
            style={{
              border: `1px solid ${on ? border.accentStrong : border.strong}`,
              cursor: 'pointer',
              padding: '9px 16px',
              borderRadius: 999,
              background: on ? brandFill.medium : 'transparent',
              color: on ? color.textBright : color.textDim,
              font: `500 12px/1 ${font.sans}`,
              transition: 'all .3s',
            }}
          >
            {tab}
          </button>
        )
      })}
    </div>
  )
}

/** Wrapper for one tab's content — only the active tab is laid out. */
export function TabPanel({
  active,
  children,
}: {
  active: boolean
  children: React.ReactNode
}) {
  return (
    <div
      role="tabpanel"
      hidden={!active}
      style={{
        display: active ? 'flex' : 'none',
        flex: 1,
        minHeight: 0,
        flexDirection: 'column',
      }}
    >
      {children}
    </div>
  )
}
