/**
 * Submit — where work gets logged for review.
 *
 * The left column walks the form: pick a category, pick what you did, attach
 * proof. The right column is the record: what you've already submitted and the
 * full range of what's worth points.
 */
import { border, brandFill, color, font, kicker } from '../../design/tokens'
import { EARN_OPTIONS } from '../../data'
import { EARN_CATEGORIES, type EarnCategory } from '../../domain/types'
import type { ProgramState } from '../../state/useProgramState'
import { PanelBody } from '../shell/Panel'
import { Button, Field, PanelHeading, Stat, TextArea, Unit } from '../ui'

export function SubmitPanel({ program }: { program: ProgramState }) {
  const { submissions, submitForm } = program
  const { category, optionIndex, proof, notes } = submitForm

  const options = EARN_OPTIONS[category]
  const award = options[optionIndex]?.points ?? 0

  return (
    <>
      <PanelHeading
        index={2}
        section="PROGRAM"
        title="Submit work"
        description="Posts, events, builds, feedback. Anything on the bounty board. Attach proof, and points land once a reviewer approves."
        descriptionWidth={560}
        aside={
          <div style={{ textAlign: 'right' }}>
            <Stat
              label="SUGGESTED AWARD"
              size="hero"
              accent
              glow
              value={
                <span style={{ whiteSpace: 'nowrap' }}>
                  {award} <Unit>PTS</Unit>
                </span>
              }
            />
          </div>
        }
      />

      <PanelBody style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 36 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div>
            <div style={{ ...kicker(), marginBottom: 12 }}>WHAT DID YOU DO</div>
            <div style={{ display: 'flex', gap: 4, borderBottom: `1px solid ${border.soft}` }}>
              {EARN_CATEGORIES.map((name) => {
                const on = name === category
                return (
                  <button
                    key={name}
                    onClick={() => program.selectCategory(name as EarnCategory)}
                    aria-pressed={on}
                    style={{
                      border: 0,
                      background: 'none',
                      cursor: 'pointer',
                      padding: '10px 14px',
                      font: `500 13px/1 ${font.sans}`,
                      color: on ? color.textBright : color.textDim,
                      borderBottom: `2px solid ${on ? color.accent : 'transparent'}`,
                      marginBottom: -1,
                      transition: 'all .3s',
                    }}
                  >
                    {name}
                  </button>
                )
              })}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>
            {options.map((option, i) => {
              const on = i === optionIndex
              return (
                <button
                  key={option.title}
                  onClick={() => program.selectOption(i)}
                  aria-pressed={on}
                  style={{
                    textAlign: 'left',
                    cursor: 'pointer',
                    padding: '16px 18px',
                    borderRadius: 10,
                    border: `1px solid ${on ? border.accentVivid : border.base}`,
                    background: on ? brandFill.soft : color.inset,
                    boxShadow: on ? '0 0 30px rgba(30,124,242,.2)' : 'none',
                    transition: 'all .3s',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: 12,
                      alignItems: 'baseline',
                    }}
                  >
                    <span style={{ font: `600 14px/1.3 ${font.sans}`, color: color.text }}>
                      {option.title}
                    </span>
                    <span
                      style={{
                        font: `600 14px/1 ${font.mono}`,
                        color: color.accent,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {option.points} <span style={{ fontSize: 9, color: color.textFaint }}>PTS</span>
                    </span>
                  </div>
                  <span style={{ font: `400 12.5px/1.45 ${font.sans}`, color: color.textMuted }}>
                    {option.description}
                  </span>
                </button>
              )
            })}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Field
              label="PROOF LINK"
              value={proof}
              onChange={program.setProof}
              placeholder="https://…"
              hint="Post, repo, recording, or a screenshot in Drive."
            />
            <TextArea
              label="NOTES FOR THE REVIEWER"
              value={notes}
              onChange={program.setNotes}
              placeholder="Attendance, reach, anything that helps the review go fast"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: color.textDim }}>
              Reviewers can adjust the award.
            </span>
            <Button onClick={program.submitWork} style={{ padding: '13px 24px' }}>
              Submit for review →
            </Button>
          </div>
        </div>

        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              marginBottom: 14,
            }}
          >
            <h2 style={{ margin: 0, font: `600 24px/1 ${font.display}`, color: color.text }}>
              My submissions
            </h2>
            <span
              style={{
                font: `500 11px/1 ${font.mono}`,
                color: color.textFaint,
                whiteSpace: 'nowrap',
              }}
            >
              {submissions.length} TOTAL
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {submissions.map((submission, i) => (
              <div
                // Titles repeat across resubmissions, so index is the identity.
                key={`${submission.title}-${i}`}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  gap: 12,
                  padding: '14px 16px',
                  borderRadius: 8,
                  border: `1px solid ${border.soft}`,
                  background: color.inset,
                }}
              >
                <div>
                  <div style={{ font: `500 13.5px/1.3 ${font.sans}`, color: color.text }}>
                    {submission.title}
                  </div>
                  <div style={{ fontSize: 12, color: color.textFaint, marginTop: 4 }}>
                    {submission.date} · {submission.category}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ font: `600 13px/1 ${font.mono}`, color: color.accentSoft }}>
                    {submission.points}
                  </div>
                  <div
                    style={{
                      font: `500 9.5px/1 ${font.mono}`,
                      letterSpacing: '.16em',
                      color: submission.status === 'APPROVED' ? color.approved : color.pending,
                      marginTop: 6,
                    }}
                  >
                    {submission.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p style={{ margin: '14px 0 0', fontSize: 12, color: color.textFaint, lineHeight: 1.5 }}>
            Verification happens off-platform; the status here is the record of it.
          </p>

          <div
            style={{
              marginTop: 22,
              padding: '18px 20px',
              borderRadius: 10,
              border: `1px solid ${border.base}`,
              background: color.inset,
            }}
          >
            <div style={{ ...kicker(), marginBottom: 12 }}>WAYS TO EARN</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {EARN_CATEGORIES.filter((name) => name !== 'Other').map((name) => {
                const points = EARN_OPTIONS[name].map((o) => o.points)
                const low = Math.min(...points)
                const high = Math.max(...points)
                return (
                  <button
                    key={name}
                    onClick={() => program.selectCategory(name as EarnCategory)}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr auto',
                      gap: 12,
                      alignItems: 'baseline',
                      textAlign: 'left',
                      cursor: 'pointer',
                      border: 0,
                      background: 'none',
                      padding: '6px 0',
                      borderBottom: `1px solid ${border.faint}`,
                    }}
                  >
                    <span
                      style={{
                        font: `500 13px/1.3 ${font.sans}`,
                        color: name === category ? color.textBright : color.textMuted,
                      }}
                    >
                      {name}{' '}
                      <span style={{ color: color.textFaint, fontWeight: 400 }}>
                        · {points.length} way{points.length > 1 ? 's' : ''}
                      </span>
                    </span>
                    <span
                      style={{
                        font: `600 12px/1 ${font.mono}`,
                        color: color.accentSoft,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {low === high ? low : `${low}–${high}`} PTS
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </PanelBody>
    </>
  )
}
