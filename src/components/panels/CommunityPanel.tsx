/**
 * Community — the directory, open roles, and the ambassador toolkit.
 *
 * Three tabs that share a theme: everything here is about other people, not
 * about the viewer's own progress.
 */
import { useState } from 'react'

import { border, color, font } from '../../design/tokens'
import { MEMBERS, OPPORTUNITIES, RESOURCES } from '../../data/program'
import { PANEL_TABS, type TabOf } from '../../domain/types'
import type { ProgramState } from '../../state/useProgramState'
import { PanelBody } from '../shell/Panel'
import { Avatar, Button, EmptyState, PanelHeading, fieldStyle } from '../ui'
import { PanelTabs, TabPanel } from '../shell/PanelTabs'

export function CommunityPanel({ program }: { program: ProgramState }) {
  const tabs = PANEL_TABS.Community
  const active: TabOf<'Community'> = program.tabs.Community ?? tabs[0]
  const [search, setSearch] = useState('')

  const query = search.trim().toLowerCase()
  const members = query
    ? MEMBERS.filter(
        (m) =>
          m.name.toLowerCase().includes(query) || m.school.toLowerCase().includes(query),
      )
    : MEMBERS

  return (
    <>
      <PanelTabs
        tabs={tabs}
        active={active}
        onSelect={(tab) => program.selectTab('Community', tab)}
        label="Community views"
      />

      <TabPanel active={active === 'Directory'}>
        <PanelHeading
          index={7}
          section="COMMUNITY"
          title="Directory"
          description="26 ambassadors across 11 campuses."
          underTabs
          aside={
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name or school…"
              aria-label="Search the directory"
              style={{ ...fieldStyle, padding: '12px 16px', width: 280 }}
            />
          }
        />

        <PanelBody
          style={{
            padding: '24px 44px 36px',
            display: 'grid',
            gridTemplateColumns: 'repeat(4,1fr)',
            gap: 12,
            alignContent: 'start',
          }}
        >
          {members.length === 0 && (
            <div style={{ gridColumn: '1/5' }}>
              <EmptyState outlined>No ambassadors match “{search}”.</EmptyState>
            </div>
          )}
          {members.map((member) => (
            <div
              key={member.name}
              className="bb-row"
              style={{
                padding: '18px 20px',
                borderRadius: 12,
                border: `1px solid ${border.base}`,
                background: color.inset,
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar name={member.name} size={38} />
                <div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
                    <span style={{ font: `600 14px/1.2 ${font.sans}`, color: color.text }}>
                      {member.name}
                    </span>
                    <span
                      style={{
                        font: `500 9px/1 ${font.mono}`,
                        letterSpacing: '.16em',
                        color: member.tier === 'Legend' ? color.pending : color.textFaint,
                      }}
                    >
                      {member.tier.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: color.textFaint, marginTop: 3 }}>
                    {member.school}
                  </div>
                </div>
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: 12.5,
                  lineHeight: 1.45,
                  color: color.textMuted,
                  minHeight: 36,
                }}
              >
                {member.bio || 'No bio yet'}
              </p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {member.links.map((link) => (
                  <a key={link} href="#" style={{ fontSize: 12, color: color.accent }}>
                    {link} ↗
                  </a>
                ))}
              </div>
            </div>
          ))}
        </PanelBody>
      </TabPanel>

      <TabPanel active={active === 'Opportunities'}>
        <PanelHeading
          index={7}
          section="COMMUNITY"
          title="Opportunities"
          description="Early access to jobs and internships for ambassadors."
          underTabs
        />

        <PanelBody style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {OPPORTUNITIES.map((role) => (
            <div
              key={role.title}
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
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <span style={{ font: `600 20px/1.2 ${font.sans}`, color: color.text }}>
                    {role.title}
                  </span>
                  <span
                    style={{
                      font: `500 9.5px/1 ${font.mono}`,
                      letterSpacing: '.16em',
                      padding: '5px 8px',
                      borderRadius: 4,
                      color: color.accent,
                      border: `1px solid ${border.accent}`,
                    }}
                  >
                    {role.type}
                  </span>
                </div>
                <div style={{ marginTop: 8, fontSize: 14, color: color.textMuted }}>
                  {role.team} · {role.location}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <span style={{ font: `500 11px/1 ${font.mono}`, color: color.textFaint }}>
                  CLOSES {role.closes}
                </span>
                <Button variant="secondary" style={{ padding: '11px 18px', fontSize: 13 }}>
                  View role ↗
                </Button>
              </div>
            </div>
          ))}
          <EmptyState outlined>
            More roles open each semester. Ambassadors at Captain+ get a referral fast-track.
          </EmptyState>
        </PanelBody>
      </TabPanel>

      <TabPanel active={active === 'Resources'}>
        <PanelHeading
          index={7}
          section="COMMUNITY"
          title="Resources"
          description="Brand kit, talk tracks, and everything you need to represent Backboard."
          underTabs
        />

        <PanelBody
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3,1fr)',
            gap: 12,
            alignContent: 'start',
          }}
        >
          {RESOURCES.map((resource) => (
            <a
              key={resource.title}
              href="#"
              className="bb-lift"
              style={{
                padding: '22px 24px',
                borderRadius: 12,
                border: `1px solid ${border.base}`,
                background: color.inset,
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                color: 'inherit',
              }}
            >
              <span
                style={{
                  font: `500 9.5px/1 ${font.mono}`,
                  letterSpacing: '.16em',
                  color: color.accent,
                }}
              >
                {resource.kind}
              </span>
              <span style={{ font: `600 18px/1.25 ${font.sans}`, color: color.text }}>
                {resource.title}
              </span>
              <span style={{ fontSize: 13, lineHeight: 1.5, color: color.textMuted }}>
                {resource.description}
              </span>
            </a>
          ))}
        </PanelBody>
      </TabPanel>
    </>
  )
}
