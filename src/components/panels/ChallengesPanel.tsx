/**
 * Challenges — admin-published bounties with fixed awards.
 *
 * Unlike Submit, where you propose what something is worth, these carry a set
 * price. The button reflects where a claim stands: open, under review, or done.
 */
import { border, color, font, kicker } from '../../design/tokens'
import { CHALLENGES } from '../../data/program'
import type { ReviewStatus } from '../../domain/types'
import type { ProgramState } from '../../state/useProgramState'
import { PanelBody, PanelHeader } from '../shell/Panel'

const STATUS_COLOR: Record<ReviewStatus, string> = {
  approved: color.approved,
  pending: color.pending,
  open: color.open,
}

const STATUS_LABEL: Record<ReviewStatus, string> = {
  approved: 'Approved',
  pending: 'Under review',
  open: 'Submit for approval',
}

interface ChallengesPanelProps {
  program: ProgramState
  onApply: (index: number, title: string) => void
}

export function ChallengesPanel({ program, onApply }: ChallengesPanelProps) {
  return (
    <>
      <PanelHeader>
        <div style={{ ...kicker(10, '.24em'), color: color.accent, marginBottom: 12 }}>
          03 · PROGRAM
        </div>
        <h1 style={{ margin: 0, font: `600 52px/1 ${font.display}`, color: color.textBright }}>
          Challenges
        </h1>
        <p
          style={{
            margin: '10px 0 0',
            fontSize: 15,
            lineHeight: 1.5,
            color: color.textMuted,
            maxWidth: 560,
            textWrap: 'pretty',
          }}
        >
          Admin-published challenges with set points and claim limits. Every submission is reviewed
          before points land.
        </p>
      </PanelHeader>

      <PanelBody style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {CHALLENGES.map((challenge, i) => {
          // A local claim outranks the published state until review completes.
          const status: ReviewStatus = program.appliedChallenges[i] ? 'pending' : challenge.status
          const isOpen = status === 'open'

          return (
            <div
              key={challenge.title}
              className="bb-row"
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: 24,
                alignItems: 'center',
                padding: '22px 26px',
                borderRadius: 12,
                border: `1px solid ${border.base}`,
                background: color.inset,
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ font: `600 20px/1.2 ${font.sans}`, color: color.text }}>
                    {challenge.title}
                  </span>
                  <span
                    style={{
                      font: `500 9.5px/1 ${font.mono}`,
                      letterSpacing: '.16em',
                      padding: '5px 8px',
                      borderRadius: 4,
                      color: STATUS_COLOR[status],
                      border: `1px solid ${STATUS_COLOR[status]}`,
                      opacity: 0.9,
                    }}
                  >
                    {status.toUpperCase()}
                  </span>
                </div>
                <p
                  style={{
                    margin: '8px 0 0',
                    fontSize: 14,
                    lineHeight: 1.5,
                    color: color.textMuted,
                    maxWidth: 820,
                    textWrap: 'pretty',
                  }}
                >
                  {challenge.description}
                </p>
                <div
                  style={{
                    marginTop: 12,
                    font: `500 11px/1 ${font.mono}`,
                    letterSpacing: '.1em',
                    color: color.textFaint,
                  }}
                >
                  {challenge.meta}
                </div>
              </div>

              <div
                style={{
                  textAlign: 'right',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  gap: 14,
                }}
              >
                <div
                  style={{
                    font: `600 34px/1 ${font.display}`,
                    color: color.accentSoft,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {challenge.points} <span style={{ fontSize: 14, color: color.textFaint }}>PTS</span>
                </div>
                <button
                  onClick={() => isOpen && onApply(i, challenge.title)}
                  disabled={!isOpen}
                  style={{
                    border: `1px solid ${isOpen ? color.brand : border.bright}`,
                    cursor: isOpen ? 'pointer' : 'default',
                    padding: '11px 18px',
                    borderRadius: 8,
                    background: isOpen ? color.brand : 'transparent',
                    color: isOpen ? '#fff' : color.textDim,
                    font: `600 13px/1 ${font.sans}`,
                  }}
                >
                  {STATUS_LABEL[status]}
                </button>
              </div>
            </div>
          )
        })}
      </PanelBody>
    </>
  )
}
