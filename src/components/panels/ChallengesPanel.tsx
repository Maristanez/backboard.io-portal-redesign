/**
 * Challenges — admin-published bounties with fixed awards.
 *
 * Unlike Submit, where you propose what something is worth, these carry a set
 * price. The button reflects where a claim stands: open, under review, or done.
 */
import { border, color, font } from '../../design/tokens'
import { CHALLENGES } from '../../data'
import type { ReviewStatus } from '../../domain/types'
import type { ProgramState } from '../../state/useProgramState'
import { PanelBody } from '../shell/Panel'
import { Button, PanelHeading, StatusPill, Unit } from '../ui'

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
      <PanelHeading
        index={3}
        section="PROGRAM"
        title="Challenges"
        description="Admin-published challenges with set points and claim limits. Every submission is reviewed before points land."
        descriptionWidth={560}
      />

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
                  <StatusPill label={status.toUpperCase()} tone={STATUS_COLOR[status]} />
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
                  {challenge.points} <Unit size={14}>PTS</Unit>
                </div>
                <Button
                  onClick={() => onApply(i, challenge.title)}
                  disabled={!isOpen}
                  style={{ padding: '11px 18px', fontSize: 13 }}
                >
                  {STATUS_LABEL[status]}
                </Button>
              </div>
            </div>
          )
        })}
      </PanelBody>
    </>
  )
}
