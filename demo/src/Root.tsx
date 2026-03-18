import { Composition } from 'remotion';
import { Demo } from './Demo';

export const Root: React.FC = () => {
  return (
    <Composition
      id="claude-remote-demo"
      component={Demo}
      durationInFrames={450}
      fps={30}
      width={1280}
      height={720}
    />
  );
};
