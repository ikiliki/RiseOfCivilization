/**
 * Maple-style chibi player avatar for canvas.
 * Exported for Storybook and used by GameScene.
 */
import type { ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import type { PlayerAssetLoadout } from '@roc/shared-types';

function AvatarAccessories({ assets }: { assets: PlayerAssetLoadout }) {
  return (
    <>
      {assets.hatAssetId === 'cap' && (
        <group position={[0, 0.82, 0]}>
          <mesh position={[0, 0.04, 0]}>
            <coneGeometry args={[0.34, 0.18, 20]} />
            <meshStandardMaterial color="#2f5eea" />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, 0.18]}>
            <ringGeometry args={[0.08, 0.24, 20]} />
            <meshStandardMaterial color="#1d3d9d" side={THREE.DoubleSide} />
          </mesh>
        </group>
      )}
      {assets.hatAssetId === 'crown' && (
        <group position={[0, 0.88, 0]}>
          <mesh>
            <cylinderGeometry args={[0.24, 0.24, 0.14, 16]} />
            <meshStandardMaterial color="#f4c63d" />
          </mesh>
          {[0, 1, 2, 3, 4].map((i) => {
            const angle = (Math.PI * 2 * i) / 5;
            return (
              <mesh key={i} position={[Math.cos(angle) * 0.2, 0.12, Math.sin(angle) * 0.2]}>
                <coneGeometry args={[0.06, 0.12, 10]} />
                <meshStandardMaterial color="#e5a500" />
              </mesh>
            );
          })}
        </group>
      )}
      {assets.shoesAssetId === 'sneakers' && (
        <>
          <mesh position={[-0.16, -0.36, 0.16]}>
            <boxGeometry args={[0.22, 0.12, 0.34]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0.16, -0.36, 0.16]}>
            <boxGeometry args={[0.22, 0.12, 0.34]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        </>
      )}
      {assets.shoesAssetId === 'boots' && (
        <>
          <mesh position={[-0.16, -0.33, 0.14]}>
            <boxGeometry args={[0.24, 0.18, 0.34]} />
            <meshStandardMaterial color="#5f4229" />
          </mesh>
          <mesh position={[0.16, -0.33, 0.14]}>
            <boxGeometry args={[0.24, 0.18, 0.34]} />
            <meshStandardMaterial color="#5f4229" />
          </mesh>
        </>
      )}
    </>
  );
}

export interface PlayerAvatarProps {
  skinColor: string;
  assets: PlayerAssetLoadout;
  /** Scale multiplier for avatar size. Default 1.25 for slightly larger in-game visibility. */
  scale?: number;
  onClick?: (e: ThreeEvent<MouseEvent>) => void;
  onPointerOver?: (e: ThreeEvent<PointerEvent>) => void;
  onPointerOut?: (e: ThreeEvent<PointerEvent>) => void;
}

export function PlayerAvatar({
  skinColor,
  assets,
  scale = 1.25,
  onClick,
  onPointerOver,
  onPointerOut
}: PlayerAvatarProps) {
  const shirtColor = new THREE.Color(skinColor).multiplyScalar(0.72).getStyle();

  return (
    <group
      scale={[scale, scale, scale]}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      <mesh position={[0, 0.26, 0]}>
        <capsuleGeometry args={[0.2, 0.28, 6, 12]} />
        <meshStandardMaterial color={shirtColor} />
      </mesh>
      <mesh position={[0, 0.7, 0]}>
        <sphereGeometry args={[0.34, 24, 24]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>
      <mesh position={[-0.11, 0.12, 0]}>
        <capsuleGeometry args={[0.07, 0.16, 4, 8]} />
        <meshStandardMaterial color="#2b3b5b" />
      </mesh>
      <mesh position={[0.11, 0.12, 0]}>
        <capsuleGeometry args={[0.07, 0.16, 4, 8]} />
        <meshStandardMaterial color="#2b3b5b" />
      </mesh>
      <mesh position={[-0.27, 0.34, 0]} rotation={[0, 0, Math.PI / 2.4]}>
        <capsuleGeometry args={[0.055, 0.14, 4, 8]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>
      <mesh position={[0.27, 0.34, 0]} rotation={[0, 0, -Math.PI / 2.4]}>
        <capsuleGeometry args={[0.055, 0.14, 4, 8]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>
      <mesh position={[-0.11, 0.72, 0.29]}>
        <sphereGeometry args={[0.03, 12, 12]} />
        <meshStandardMaterial color="#1e2533" />
      </mesh>
      <mesh position={[0.11, 0.72, 0.29]}>
        <sphereGeometry args={[0.03, 12, 12]} />
        <meshStandardMaterial color="#1e2533" />
      </mesh>
      <AvatarAccessories assets={assets} />
    </group>
  );
}
