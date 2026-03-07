import type { Meta, StoryObj } from '@storybook/react';
import { Canvas, useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import { PlayerAvatar } from './PlayerAvatar';
import {
  DEFAULT_PLAYER_ASSET_LOADOUT,
  type PlayerAssetLoadout
} from '@roc/shared-types';

const meta: Meta<typeof PlayerAvatar> = {
  title: 'Game/PlayerAvatar',
  component: PlayerAvatar,
  parameters: { layout: 'fullscreen' }
};

export default meta;

type Story = StoryObj<typeof PlayerAvatar>;

/** Fixed camera matching game view: top-down from [0, 24, 14] looking at player. */
function GameCamera() {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, 24, 14);
    camera.lookAt(0, 0.6, 0);
  }, [camera]);
  return null;
}

/**
 * Matches GameScene: same lighting, ground, fixed top-down camera (no orbit).
 * Avatar scaled 1.25x for better visibility.
 */
function Scene({
  skinColor,
  assets
}: {
  skinColor: string;
  assets: PlayerAssetLoadout;
}) {
  return (
    <>
      <GameCamera />
      <ambientLight intensity={0.7} />
      <directionalLight position={[10, 20, 12]} intensity={1.1} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.6, 0]}>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#4f9d69" />
      </mesh>
      <group position={[0, 0.6, 0]}>
        <PlayerAvatar skinColor={skinColor} assets={assets} />
      </group>
      <gridHelper args={[200, 40, '#3a4f73', '#202f49']} />
    </>
  );
}

export const Default: Story = {
  render: () => (
    <Canvas camera={{ position: [0, 24, 14], fov: 50 }}>
      <Scene skinColor="#f8f3ff" assets={DEFAULT_PLAYER_ASSET_LOADOUT} />
    </Canvas>
  )
};

export const NoAccessories: Story = {
  render: () => (
    <Canvas camera={{ position: [0, 24, 14], fov: 50 }}>
      <Scene
        skinColor="#f8f3ff"
        assets={{ hatAssetId: '', shoesAssetId: '' }}
      />
    </Canvas>
  )
};

export const CapOnly: Story = {
  render: () => (
    <Canvas camera={{ position: [0, 24, 14], fov: 50 }}>
      <Scene
        skinColor="#f8f3ff"
        assets={{ hatAssetId: 'cap', shoesAssetId: '' }}
      />
    </Canvas>
  )
};

export const CrownOnly: Story = {
  render: () => (
    <Canvas camera={{ position: [0, 24, 14], fov: 50 }}>
      <Scene
        skinColor="#f8f3ff"
        assets={{ hatAssetId: 'crown', shoesAssetId: '' }}
      />
    </Canvas>
  )
};

export const SneakersOnly: Story = {
  render: () => (
    <Canvas camera={{ position: [0, 24, 14], fov: 50 }}>
      <Scene
        skinColor="#f8f3ff"
        assets={{ hatAssetId: '', shoesAssetId: 'sneakers' }}
      />
    </Canvas>
  )
};

export const BootsOnly: Story = {
  render: () => (
    <Canvas camera={{ position: [0, 24, 14], fov: 50 }}>
      <Scene
        skinColor="#f8f3ff"
        assets={{ hatAssetId: '', shoesAssetId: 'boots' }}
      />
    </Canvas>
  )
};

export const FullLoadout: Story = {
  render: () => (
    <Canvas camera={{ position: [0, 24, 14], fov: 50 }}>
      <Scene
        skinColor="#f8f3ff"
        assets={{ hatAssetId: 'crown', shoesAssetId: 'boots' }}
      />
    </Canvas>
  )
};

export const SkinColorLight: Story = {
  render: () => (
    <Canvas camera={{ position: [0, 24, 14], fov: 50 }}>
      <Scene skinColor="#f8f3ff" assets={DEFAULT_PLAYER_ASSET_LOADOUT} />
    </Canvas>
  )
};

export const SkinColorTan: Story = {
  render: () => (
    <Canvas camera={{ position: [0, 24, 14], fov: 50 }}>
      <Scene skinColor="#e8c9a8" assets={DEFAULT_PLAYER_ASSET_LOADOUT} />
    </Canvas>
  )
};

export const SkinColorBrown: Story = {
  render: () => (
    <Canvas camera={{ position: [0, 24, 14], fov: 50 }}>
      <Scene skinColor="#8b5a2b" assets={DEFAULT_PLAYER_ASSET_LOADOUT} />
    </Canvas>
  )
};
