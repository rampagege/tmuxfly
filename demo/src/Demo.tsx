import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion';

// ── Reusable Components ──────────────────────────────────────────

const FadeIn: React.FC<{ children: React.ReactNode; delay?: number }> = ({
  children,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame - delay, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const y = interpolate(frame - delay, [0, 15], [30, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div style={{ opacity, transform: `translateY(${y}px)` }}>{children}</div>
  );
};

const TerminalWindow: React.FC<{
  title: string;
  children: React.ReactNode;
  width?: number;
  height?: number;
}> = ({ title, children, width = 500, height = 280 }) => (
  <div
    style={{
      width,
      height,
      background: '#1a1a2e',
      borderRadius: 12,
      overflow: 'hidden',
      boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
      border: '1px solid #333',
    }}
  >
    <div
      style={{
        height: 36,
        background: '#252540',
        display: 'flex',
        alignItems: 'center',
        padding: '0 12px',
        gap: 8,
      }}
    >
      <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57' }} />
      <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffbd2e' }} />
      <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840' }} />
      <span
        style={{
          marginLeft: 8,
          color: '#888',
          fontSize: 13,
          fontFamily: 'monospace',
        }}
      >
        {title}
      </span>
    </div>
    <div
      style={{
        padding: 16,
        fontFamily: '"SF Mono", "Fira Code", monospace',
        fontSize: 14,
        color: '#e0e0e0',
        lineHeight: 1.6,
      }}
    >
      {children}
    </div>
  </div>
);

const TypeWriter: React.FC<{ text: string; startFrame?: number; speed?: number }> = ({
  text,
  startFrame = 0,
  speed = 2,
}) => {
  const frame = useCurrentFrame();
  const chars = Math.min(Math.floor((frame - startFrame) / speed), text.length);
  if (frame < startFrame) return null;
  return (
    <span>
      {text.slice(0, Math.max(0, chars))}
      {chars < text.length && (
        <span
          style={{
            borderRight: '2px solid #10b981',
            animation: 'none',
            marginLeft: 1,
          }}
        />
      )}
    </span>
  );
};

const PhoneFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      width: 220,
      height: 400,
      background: '#111',
      borderRadius: 28,
      padding: '8px 4px',
      boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
      border: '2px solid #444',
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <div
      style={{
        width: 60,
        height: 5,
        background: '#333',
        borderRadius: 3,
        margin: '4px auto 8px',
      }}
    />
    <div
      style={{
        flex: 1,
        background: '#1e1e2e',
        borderRadius: 20,
        overflow: 'hidden',
        padding: 12,
        fontSize: 11,
        color: '#e0e0e0',
        fontFamily: 'monospace',
      }}
    >
      {children}
    </div>
  </div>
);

const TelegramBubble: React.FC<{
  text: string;
  isBot?: boolean;
  delay?: number;
}> = ({ text, isBot = true, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame: frame - delay, fps, config: { damping: 15 } });
  if (frame < delay) return null;
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: isBot ? 'flex-start' : 'flex-end',
        marginBottom: 6,
        transform: `scale(${scale})`,
        transformOrigin: isBot ? 'left bottom' : 'right bottom',
      }}
    >
      <div
        style={{
          background: isBot ? '#2b5278' : '#2b7548',
          padding: '6px 10px',
          borderRadius: 10,
          maxWidth: 200,
          fontSize: 11,
          color: '#fff',
          lineHeight: 1.4,
        }}
      >
        {text}
      </div>
    </div>
  );
};

const Badge: React.FC<{ text: string; color: string }> = ({ text, color }) => (
  <span
    style={{
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: 6,
      background: color,
      color: '#fff',
      fontSize: 12,
      fontWeight: 600,
      marginRight: 6,
    }}
  >
    {text}
  </span>
);

// ── Scenes ───────────────────────────────────────────────────────

const SceneIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleScale = spring({ frame, fps, config: { damping: 12 } });
  const subtitleOpacity = interpolate(frame, [20, 40], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a3e 50%, #0f0f1a 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          fontSize: 64,
          fontWeight: 800,
          color: '#fff',
          transform: `scale(${titleScale})`,
          letterSpacing: -2,
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <span style={{ color: '#10b981' }}>claude</span>-remote
      </div>
      <div
        style={{
          fontSize: 22,
          color: '#94a3b8',
          marginTop: 16,
          opacity: subtitleOpacity,
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        Remote controller for multiple Claude Code sessions
      </div>
      <div
        style={{
          display: 'flex',
          gap: 8,
          marginTop: 24,
          opacity: subtitleOpacity,
        }}
      >
        <Badge text="Web UI" color="#3b82f6" />
        <Badge text="Telegram Bot" color="#0088cc" />
        <Badge text="AI Supervisor" color="#8b5cf6" />
      </div>
    </AbsoluteFill>
  );
};

const SceneMultiSession: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        background: '#0f0f1a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
      }}
    >
      <FadeIn>
        <div
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: '#fff',
            marginBottom: 10,
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          Run multiple Claude Code sessions
        </div>
      </FadeIn>
      <div style={{ display: 'flex', gap: 20 }}>
        {['claude-1: Build API', 'claude-2: Write tests', 'claude-3: Fix bugs'].map(
          (title, i) => {
            const s = spring({ frame: frame - i * 8, fps, config: { damping: 15 } });
            return (
              <div key={title} style={{ transform: `scale(${s})` }}>
                <TerminalWindow title={title} width={340} height={200}>
                  <div style={{ color: '#10b981' }}>
                    <TypeWriter
                      text={
                        i === 0
                          ? '> Building REST endpoints...\n* Crunching...'
                          : i === 1
                            ? '> Running test suite...\n  45 passed, 2 pending'
                            : '> Fixing auth middleware...\n* Thinking...'
                      }
                      startFrame={i * 8 + 5}
                      speed={1.5}
                    />
                  </div>
                </TerminalWindow>
              </div>
            );
          },
        )}
      </div>
    </AbsoluteFill>
  );
};

const SceneWebAndPhone: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const phoneSlide = spring({ frame: frame - 10, fps, config: { damping: 14 } });
  const termSlide = spring({ frame, fps, config: { damping: 14 } });

  return (
    <AbsoluteFill
      style={{
        background: '#0f0f1a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 60,
      }}
    >
      <div style={{ transform: `translateX(${(1 - termSlide) * -200}px)`, opacity: termSlide }}>
        <TerminalWindow title="claude-1 (Web UI)" width={520} height={320}>
          <div style={{ color: '#a78bfa' }}>
            <TypeWriter text="* Implementing user auth..." startFrame={5} speed={1.5} />
          </div>
          <FadeIn delay={25}>
            <div style={{ color: '#fbbf24', marginTop: 8 }}>
              ? Allow Bash(npm install bcrypt) [Y/n]
            </div>
          </FadeIn>
          <FadeIn delay={45}>
            <div style={{ color: '#10b981', marginTop: 4 }}>{'>'} y</div>
          </FadeIn>
          <FadeIn delay={55}>
            <div style={{ color: '#64748b', marginTop: 4 }}>
              {'>'} Running npm install...
            </div>
          </FadeIn>
        </TerminalWindow>
      </div>

      <div
        style={{
          transform: `translateX(${(1 - phoneSlide) * 200}px)`,
          opacity: phoneSlide,
        }}
      >
        <PhoneFrame>
          <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 13 }}>Sessions</div>
          {['claude-1', 'claude-2', 'claude-3'].map((name, i) => (
            <FadeIn key={name} delay={15 + i * 6}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '6px 8px',
                  background: i === 0 ? '#10b98120' : '#ffffff08',
                  borderRadius: 8,
                  marginBottom: 4,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: '#10b981',
                    }}
                  />
                  <span style={{ fontSize: 11 }}>{name}</span>
                </div>
                <span
                  style={{
                    fontSize: 9,
                    padding: '2px 6px',
                    background: '#3b82f6',
                    borderRadius: 4,
                  }}
                >
                  Attach
                </span>
              </div>
            </FadeIn>
          ))}
        </PhoneFrame>
      </div>
    </AbsoluteFill>
  );
};

const SceneTelegram: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        background: '#0f0f1a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 60,
      }}
    >
      <div>
        <FadeIn>
          <div
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: '#fff',
              marginBottom: 16,
              fontFamily: 'system-ui, sans-serif',
            }}
          >
            <span style={{ color: '#0088cc' }}>Telegram</span> Bot Control
          </div>
        </FadeIn>
        <div
          style={{
            width: 320,
            background: '#17212b',
            borderRadius: 16,
            padding: 16,
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          }}
        >
          <TelegramBubble text="/list" isBot={false} delay={5} />
          <TelegramBubble
            text="Sessions:
  claude-1 — 3w
  claude-2 — 1w
  claude-3 — 2w"
            delay={20}
          />
          <TelegramBubble text="/watch claude-1 Build the API" isBot={false} delay={40} />
          <TelegramBubble text="Supervisor started on claude-1 (confirm)" delay={55} />
          <TelegramBubble
            text="[claude-1] Input detected
Suggestion: y
Allow Bash(npm install)?"
            delay={75}
          />
          <FadeIn delay={85}>
            <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
              {['Approve', 'Reject', 'Stop'].map((btn) => (
                <div
                  key={btn}
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    padding: '6px 0',
                    background: btn === 'Approve' ? '#2b7548' : '#2b5278',
                    borderRadius: 8,
                    fontSize: 12,
                    color: '#fff',
                    fontWeight: 600,
                  }}
                >
                  {btn}
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>

      <div>
        <FadeIn delay={10}>
          <TerminalWindow title="AI Supervisor" width={420} height={300}>
            <FadeIn delay={15}>
              <div style={{ color: '#64748b' }}>{'>'} Polling every 5s...</div>
            </FadeIn>
            <FadeIn delay={30}>
              <div style={{ color: '#fbbf24' }}>{'>'} Input detected: permission prompt</div>
            </FadeIn>
            <FadeIn delay={50}>
              <div style={{ color: '#a78bfa' }}>{'>'} LLM analysis: needsInput=true</div>
            </FadeIn>
            <FadeIn delay={65}>
              <div style={{ color: '#10b981' }}>{'>'} Suggestion: "y"</div>
            </FadeIn>
            <FadeIn delay={80}>
              <div style={{ color: '#3b82f6' }}>{'>'} Waiting for user confirmation...</div>
            </FadeIn>
            <FadeIn delay={95}>
              <div style={{ color: '#10b981' }}>{'>'} Approved! Sending keys...</div>
            </FadeIn>
          </TerminalWindow>
        </FadeIn>
      </div>
    </AbsoluteFill>
  );
};

const SceneOutro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame, fps, config: { damping: 12 } });
  const featureOpacity = interpolate(frame, [15, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a3e 50%, #0f0f1a 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          fontSize: 48,
          fontWeight: 800,
          color: '#fff',
          transform: `scale(${scale})`,
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <span style={{ color: '#10b981' }}>claude</span>-remote
      </div>
      <div
        style={{
          display: 'flex',
          gap: 32,
          marginTop: 32,
          opacity: featureOpacity,
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {[
          { icon: '🖥', label: 'Web UI' },
          { icon: '📱', label: 'Telegram' },
          { icon: '🤖', label: 'AI Supervisor' },
          { icon: '📊', label: 'Usage Stats' },
        ].map(({ icon, label }) => (
          <div
            key={label}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span style={{ fontSize: 32 }}>{icon}</span>
            <span style={{ color: '#94a3b8', fontSize: 14 }}>{label}</span>
          </div>
        ))}
      </div>
      <FadeIn delay={30}>
        <div
          style={{
            marginTop: 32,
            padding: '10px 24px',
            background: '#10b981',
            borderRadius: 8,
            color: '#fff',
            fontSize: 16,
            fontWeight: 600,
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          github.com/rampagege/claude-remote
        </div>
      </FadeIn>
    </AbsoluteFill>
  );
};

// ── Main Composition ─────────────────────────────────────────────

export const Demo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#0f0f1a' }}>
      <Sequence durationInFrames={75}>
        <SceneIntro />
      </Sequence>
      <Sequence from={75} durationInFrames={90}>
        <SceneMultiSession />
      </Sequence>
      <Sequence from={165} durationInFrames={90}>
        <SceneWebAndPhone />
      </Sequence>
      <Sequence from={255} durationInFrames={120}>
        <SceneTelegram />
      </Sequence>
      <Sequence from={375} durationInFrames={75}>
        <SceneOutro />
      </Sequence>
    </AbsoluteFill>
  );
};
