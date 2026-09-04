/**
 * Profile — who you are in the program, and how you're tracking.
 *
 * The two tabs answer different questions: Profile is identity and standing,
 * Analytics is trajectory.
 */
import { border, brandFill, color, font, kicker } from '../../design/tokens'
import {
  CATEGORY_BREAKDOWN,
  KPIS,
  NEXT_TIER,
  TIER_LADDER,
  VIEWER,
  WEEKLY_POINTS,
  tierFor,
} from '../../data/program'
import { PANEL_TABS, type TabOf } from '../../domain/types'
import type { ProgramState } from '../../state/useProgramState'
import { PanelBody } from '../shell/Panel'
import { Button, Labelled, Meter, PanelHeading, Stat, TextArea, fieldStyle } from '../ui'
import { PanelTabs, TabPanel } from '../shell/PanelTabs'

/** Sparkline viewBox. */
const CHART = { width: 600, height: 200 }
/** Circumference of the profile ring at r=90. */
const RING = 565

/** Maps weekly points onto the sparkline's coordinate space. */
function sparklinePoints(values: number[]): string {
  const step = CHART.width / (values.length - 1)
  // Scaled so the peak sits just inside the top of the box.
  const scale = CHART.height / 75
  return values
    .map((value, i) => `${(i * step).toFixed(1)},${(CHART.height - 10 - value * scale).toFixed(1)}`)
    .join(' ')
}

export function ProfilePanel({ program }: { program: ProgramState }) {
  const tabs = PANEL_TABS.Profile
  const active: TabOf<'Profile'> = program.tabs.Profile ?? tabs[0]

  const line = sparklinePoints(WEEKLY_POINTS)
  const currentTier = tierFor(VIEWER.points)
  const ringDash = `${(VIEWER.points / NEXT_TIER.threshold) * RING} ${RING}`

  return (
    <>
      <PanelTabs
        tabs={tabs}
        active={active}
        onSelect={(tab) => program.selectTab('Profile', tab)}
        label="Profile views"
      />

      <TabPanel active={active === 'Profile'}>
        <PanelHeading index={8} section="YOU" title="Profile" underTabs />

        <PanelBody
          style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: 40,
            alignItems: 'start',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 18,
              width: 260,
            }}
          >
            <div style={{ position: 'relative', width: 200, height: 200 }}>
              <svg
                viewBox="0 0 200 200"
                style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}
                aria-hidden
              >
                <circle cx="100" cy="100" r="90" fill="none" stroke={border.soft} strokeWidth="6" />
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  fill="none"
                  stroke={color.brand}
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={ringDash}
                  style={{
                    filter: 'drop-shadow(0 0 8px rgba(77,155,255,.8))',
                    transition: 'stroke-dasharray 1s',
                  }}
                />
              </svg>
              <div
                style={{
                  position: 'absolute',
                  inset: 22,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle at 40% 35%,#2d8bf7,#0b2b5c)',
                  display: 'grid',
                  placeItems: 'center',
                  font: `600 48px/1 ${font.display}`,
                  color: '#fff',
                }}
              >
                {VIEWER.initials}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ font: `600 26px/1.1 ${font.sans}`, color: color.text }}>
                {VIEWER.name}
              </div>
              <div style={{ fontSize: 13, color: color.textDim, marginTop: 4 }}>
                {VIEWER.school} · {VIEWER.joined}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <span
                style={{
                  font: `500 10px/1 ${font.mono}`,
                  letterSpacing: '.16em',
                  padding: '7px 10px',
                  borderRadius: 4,
                  color: color.accent,
                  border: `1px solid ${border.accent}`,
                }}
              >
                {currentTier.name.toUpperCase()}
              </span>
              <span
                style={{
                  font: `500 10px/1 ${font.mono}`,
                  letterSpacing: '.16em',
                  padding: '7px 10px',
                  borderRadius: 4,
                  color: color.textDim,
                  border: `1px solid ${border.base}`,
                }}
              >
                {VIEWER.cohort}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
              {[
                { label: 'SPENDABLE', value: VIEWER.points, accent: true },
                { label: 'LIFETIME', value: VIEWER.points, accent: false },
                { label: 'TO CAPTAIN', value: NEXT_TIER.threshold - VIEWER.points, accent: false },
              ].map((stat) => (
                <Stat
                  key={stat.label}
                  label={stat.label}
                  value={stat.value}
                  accent={stat.accent}
                  boxed
                />
              ))}
            </div>

            <div
              style={{
                padding: '22px 24px',
                borderRadius: 12,
                border: `1px solid ${border.base}`,
                background: color.inset,
              }}
            >
              <div style={{ ...kicker(), marginBottom: 16 }}>TIER LADDER</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
                {TIER_LADDER.map((tier) => {
                  const reached = tier.name === currentTier.name
                  return (
                    <div
                      key={tier.name}
                      style={{
                        padding: '14px 16px',
                        borderRadius: 8,
                        border: `1px solid ${reached ? border.accentStrong : border.base}`,
                        background: reached ? brandFill.soft : 'transparent',
                      }}
                    >
                      <div
                        style={{
                          font: `600 16px/1 ${font.display}`,
                          color: reached ? color.accentSoft : color.textDim,
                        }}
                      >
                        {tier.name}
                      </div>
                      <div
                        style={{
                          font: `500 11px/1 ${font.mono}`,
                          color: color.textFaint,
                          marginTop: 8,
                        }}
                      >
                        {tier.threshold.toLocaleString()} PTS
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <TextArea
                label="BIO (SHOWN IN DIRECTORY)"
                placeholder="What you build, what you study…"
              />
              <Labelled label="LINKS">
                <input
                  placeholder="x.com/…, linkedin.com/in/…, github.com/…"
                  style={fieldStyle}
                />
                <Button
                  variant="secondary"
                  small
                  style={{ alignSelf: 'flex-start', borderRadius: 6, padding: '10px 16px' }}
                >
                  Save profile
                </Button>
              </Labelled>
            </div>
          </div>
        </PanelBody>
      </TabPanel>

      <TabPanel active={active === 'Analytics'}>
        <PanelHeading
          index={8}
          section="YOU"
          title="Analytics"
          description="Your reach and points, last 12 weeks."
          underTabs
        />

        <PanelBody
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gridTemplateRows: 'auto 1fr',
            gap: 20,
          }}
        >
          <div
            style={{
              gridColumn: '1/3',
              display: 'grid',
              gridTemplateColumns: 'repeat(4,1fr)',
              gap: 12,
            }}
          >
            {KPIS.map((kpi) => (
              <Stat key={kpi.label} label={kpi.label} value={kpi.value} note={kpi.delta} size="kpi" boxed />
            ))}
          </div>

          <div
            style={{
              padding: '22px 24px',
              borderRadius: 12,
              border: `1px solid ${border.base}`,
              background: color.inset,
              display: 'flex',
              flexDirection: 'column',
              minHeight: 0,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={kicker()}>POINTS EARNED / WEEK</span>
              <span style={{ font: `500 10px/1 ${font.mono}`, color: color.accentSoft }}>
                ▲ {VIEWER.points} THIS WEEK
              </span>
            </div>
            <svg
              viewBox={`0 0 ${CHART.width} ${CHART.height}`}
              preserveAspectRatio="none"
              style={{ flex: 1, width: '100%', marginTop: 16, minHeight: 160 }}
              role="img"
              aria-label="Points earned per week over the last twelve weeks"
            >
              <defs>
                <linearGradient id="bbSpark" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor={color.brand} stopOpacity=".45" />
                  <stop offset="1" stopColor={color.brand} stopOpacity="0" />
                </linearGradient>
              </defs>
              <g stroke={border.soft}>
                <line x1="0" y1="50" x2={CHART.width} y2="50" />
                <line x1="0" y1="100" x2={CHART.width} y2="100" />
                <line x1="0" y1="150" x2={CHART.width} y2="150" />
              </g>
              <polygon
                points={`0,${CHART.height} ${line} ${CHART.width},${CHART.height}`}
                fill="url(#bbSpark)"
              />
              <polyline
                points={line}
                fill="none"
                stroke={color.accent}
                strokeWidth="2.5"
                strokeLinejoin="round"
                style={{ filter: 'drop-shadow(0 0 6px rgba(77,155,255,.8))' }}
              />
            </svg>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                font: `500 10px/1 ${font.mono}`,
                color: color.textFaint,
                marginTop: 8,
              }}
            >
              {['W23', 'W26', 'W29', 'W32', 'W35'].map((week) => (
                <span key={week}>{week}</span>
              ))}
            </div>
          </div>

          <div
            style={{
              padding: '22px 24px',
              borderRadius: 12,
              border: `1px solid ${border.base}`,
              background: color.inset,
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
            }}
          >
            <span style={kicker()}>BY CATEGORY</span>
            {CATEGORY_BREAKDOWN.map((category) => (
              <div key={category.label}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: 13,
                    color: color.textSoft,
                  }}
                >
                  <span>{category.label}</span>
                  <span style={{ fontFamily: font.mono, color: color.accentSoft }}>
                    {category.points}
                  </span>
                </div>
                <div style={{ marginTop: 8 }}>
                  <Meter percent={category.percent} />
                </div>
              </div>
            ))}
          </div>
        </PanelBody>
      </TabPanel>
    </>
  )
}
