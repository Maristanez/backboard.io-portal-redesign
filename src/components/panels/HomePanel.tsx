/**
 * Home — the "what should I do now" panel.
 *
 * Three columns of answer: the next actions worth taking, the onboarding steps
 * still outstanding, and what the rest of the program is up to.
 */
import { border, color, font, kicker } from '../../design/tokens'
import { CHECKLIST, NEXT_TIER, VIEWER } from '../../data'
import type { PanelName } from '../../domain/types'
import type { ProgramState } from '../../state/useProgramState'
import { PanelBody } from '../shell/Panel'
import { Card, Meter, PanelHeading, Stat, Unit } from '../ui'

interface HomePanelProps {
  program: ProgramState
  points: number
  onNavigate: (panel: PanelName) => void
}

/** Greeting that matches the time of day, as the design does. */
function greetingFor(hour: number): string {
  if (hour < 12) return 'morning'
  if (hour < 18) return 'afternoon'
  return 'evening'
}

export function HomePanel({ program, points, onNavigate }: HomePanelProps) {
  const { submissions, feed, checklist } = program

  const pending = submissions.filter((s) => s.status !== 'APPROVED')
  const doneCount = Object.values(checklist).filter(Boolean).length
  const donePercent = doneCount * 25
  const tierPercent = Math.round((points / NEXT_TIER.threshold) * 100)
  const toNextTier = NEXT_TIER.threshold - VIEWER.points

  const nextActions = [
    {
      kicker: 'REVIEW PENDING',
      color: color.pending,
      title: pending.length
        ? `${pending.length} submission${pending.length === 1 ? '' : 's'} awaiting review`
        : 'Nothing awaiting review',
      meta: 'Reviewers usually respond within 48 hours. Points land on approval.',
      cta: 'Open submissions',
      target: 'Submit' as const,
    },
    {
      kicker: 'CLOSES SEP 11',
      color: color.accent,
      title: 'Portal Redesign · 500 pts',
      meta: 'Open competition, one winner. Your design replaces the current portal.',
      cta: 'View challenge',
      target: 'Challenges' as const,
    },
    {
      kicker: 'NEXT EVENT · SEP 13',
      color: color.approved,
      title: 'Pivot Hack, Waterloo',
      meta: 'Invite attendees now: +5 pts each once an admin confirms attendance.',
      cta: 'Open calendar',
      target: 'Calendar' as const,
    },
  ]

  return (
    <>
      <PanelHeading
        index={1}
        section="TODAY"
        title={`Good ${greetingFor(new Date().getHours())}, ${VIEWER.name.split(' ')[0]}`}
        description={`${doneCount < 4 ? `${4 - doneCount} onboarding steps left. ` : ''}You're #${VIEWER.rank} of ${VIEWER.cohortSize} this semester — ${toNextTier} points from ${NEXT_TIER.name}.`}
        descriptionWidth={600}
        aside={
          <div style={{ textAlign: 'right', minWidth: 260 }}>
            <Stat
              label={`NEXT TIER · ${NEXT_TIER.name.toUpperCase()}`}
              size="hero"
              accent
              glow
              value={
                <>
                  {points} <Unit>/ {NEXT_TIER.threshold.toLocaleString()} PTS</Unit>
                </>
              }
            />
            <div style={{ marginTop: 12 }}>
              <Meter percent={tierPercent} emphasis transitionMs={1200} />
            </div>
          </div>
        }
      />

      <PanelBody style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 32 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 26, minWidth: 0 }}>
          <div>
            <div style={{ ...kicker(), marginBottom: 12 }}>DO NEXT</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
              {nextActions.map((action) => (
                <button
                  key={action.title}
                  className="bb-lift"
                  onClick={() => onNavigate(action.target)}
                  style={{
                    textAlign: 'left',
                    cursor: 'pointer',
                    padding: '18px 20px',
                    borderRadius: 12,
                    border: `1px solid ${border.base}`,
                    background: color.inset,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                    minHeight: 150,
                  }}
                >
                  <span
                    style={{
                      font: `500 9.5px/1 ${font.mono}`,
                      letterSpacing: '.16em',
                      color: action.color,
                    }}
                  >
                    {action.kicker}
                  </span>
                  <span style={{ font: `600 17px/1.25 ${font.sans}`, color: color.text }}>
                    {action.title}
                  </span>
                  <span style={{ fontSize: 12.5, lineHeight: 1.45, color: color.textMuted, flex: 1 }}>
                    {action.meta}
                  </span>
                  <span style={{ font: `600 12px/1 ${font.sans}`, color: color.accent }}>
                    {action.cta} →
                  </span>
                </button>
              ))}
            </div>
          </div>

          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={kicker()}>GETTING STARTED</span>
              <span style={{ font: `500 11px/1 ${font.mono}`, color: color.accentSoft }}>
                {doneCount} / 4 · {donePercent}%
              </span>
            </div>
            <div style={{ margin: '14px 0 6px' }}>
              <Meter percent={donePercent} height={3} transitionMs={800} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {CHECKLIST.map((item) => {
                const done = checklist[item.step]
                return (
                  <button
                    key={item.step}
                    onClick={() => onNavigate(item.target)}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '28px 1fr auto',
                      gap: 14,
                      alignItems: 'center',
                      textAlign: 'left',
                      cursor: 'pointer',
                      padding: '14px 4px',
                      border: 0,
                      borderBottom: `1px solid ${border.faint}`,
                      background: 'none',
                      opacity: done ? 0.55 : 1,
                    }}
                  >
                    <span
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: '50%',
                        border: `1px solid ${done ? color.brand : 'rgba(140,170,220,.3)'}`,
                        background: done ? color.brand : 'transparent',
                        display: 'grid',
                        placeItems: 'center',
                        font: `600 12px/1 ${font.mono}`,
                        color: '#fff',
                        boxShadow: done ? '0 0 12px rgba(30,124,242,.6)' : 'none',
                      }}
                    >
                      {done ? '✓' : ''}
                    </span>
                    <div>
                      <div
                        style={{
                          font: `600 14px/1.3 ${font.sans}`,
                          color: color.text,
                          textDecoration: done ? 'line-through' : 'none',
                        }}
                      >
                        {item.title}
                      </div>
                      <div style={{ fontSize: 12, color: color.textFaint, marginTop: 3 }}>
                        {item.description}
                      </div>
                    </div>
                    <span style={{ font: `600 13px/1 ${font.mono}`, color: color.accentSoft }}>
                      +{item.points}
                    </span>
                  </button>
                )
              })}
            </div>
          </Card>
        </div>

        <Card style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 10,
            }}
          >
            <span style={kicker()}>PROGRAM ACTIVITY</span>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                font: `500 9.5px/1 ${font.mono}`,
                letterSpacing: '.18em',
                color: color.approved,
              }}
            >
              <span
                aria-hidden
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: color.approved,
                  boxShadow: `0 0 8px ${color.approved}`,
                  animation: 'bbPulse 1.6s infinite',
                }}
              />
              LIVE
            </span>
          </div>
          {feed.map((item, i) => (
            <div
              // The feed is a stream with repeatable text, so position is the
              // only stable identity available.
              key={`${item.when}-${i}`}
              style={{
                display: 'grid',
                gridTemplateColumns: '52px 1fr auto',
                gap: 12,
                alignItems: 'start',
                padding: '11px 0',
                borderBottom: `1px solid ${border.faint}`,
                animation: 'bbFeedIn .5s both',
              }}
            >
              <span style={{ font: `500 10px/1.5 ${font.mono}`, color: color.textFaint }}>
                {item.when}
              </span>
              <span style={{ fontSize: 13, lineHeight: 1.45, color: color.textSoft }}>
                {item.text}
              </span>
              <span
                style={{
                  font: `600 12px/1.5 ${font.mono}`,
                  color: item.color,
                  whiteSpace: 'nowrap',
                }}
              >
                {item.points}
              </span>
            </div>
          ))}
        </Card>
      </PanelBody>
    </>
  )
}
