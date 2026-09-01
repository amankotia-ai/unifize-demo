// IsoScene
// Single R3F Canvas wrapper that every iso composition mounts into.
// Locks the camera to true isometric (35.264° elevation, 45° azimuth,
// ortho projection) and sets up lighting + a soft contact shadow.
// Children render in 3D world space.
//
// Sizing is controlled by the caller via className/style on the wrapping
// div, so the same scene can be 65vh on the hero or fill a kit card.

import { Canvas } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import { ACESFilmicToneMapping, SRGBColorSpace } from "three";
import type { ReactNode } from "react";

import {
  ISO_AZIMUTH_DEG,
  ISO_CAM_DISTANCE,
  ISO_ELEVATION_DEG,
  ISO_FRUSTUM,
  PAGE_BG,
} from "../tokens";

interface IsoSceneProps {
  children: ReactNode;
  /** Tailwind / inline class for the container. Controls width/height on the page. */
  className?: string;
  /** Background colour for the Canvas container. Defaults to PAGE_BG. */
  background?: string;
  /** Camera frustum — smaller = closer. Defaults to ISO_FRUSTUM (12). */
  frustum?: number;
  /** Camera look-at target in world space. Defaults to scene origin. */
  target?: [number, number, number];
  /** Show dev grid + orbit controls. Off in production. */
  debug?: boolean;
  /** Render the floor grid plane at y=0. */
  showFloor?: boolean;
  /** Render the contact shadow under the scene. Defaults to true. */
  contactShadow?: boolean;
}

/**
 * Compute camera position from elevation/azimuth/distance.
 * Y-up world. Azimuth rotates in the XZ plane; elevation tilts up from XZ.
 */
function cameraPosition(): [number, number, number] {
  const elev = (ISO_ELEVATION_DEG * Math.PI) / 180;
  const azim = (ISO_AZIMUTH_DEG * Math.PI) / 180;
  const r = ISO_CAM_DISTANCE;
  const x = r * Math.cos(elev) * Math.sin(azim);
  const y = r * Math.sin(elev);
  const z = r * Math.cos(elev) * Math.cos(azim);
  return [x, y, z];
}

export function IsoScene({
  children,
  className,
  background = PAGE_BG,
  frustum = ISO_FRUSTUM,
  target = [0, 0, 0],
  debug = false,
  showFloor = true,
  contactShadow = true,
}: IsoSceneProps) {
  const camPos = cameraPosition();
  return (
    <div className={className} style={{ background }}>
      <Canvas
        orthographic
        camera={{
          position: camPos,
          zoom: 1,
          near: 0.1,
          far: 1000,
          left: -frustum,
          right: frustum,
          top: frustum,
          bottom: -frustum,
        }}
        onCreated={({ camera, gl }) => {
          camera.lookAt(target[0], target[1], target[2]);
          gl.toneMapping = ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.05;
          gl.outputColorSpace = SRGBColorSpace;
        }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Three-point lighting tuned for iso reading.
            Key (front-up-right) carries the brightest face.
            Fill (back-down-left) softens shadow side with a cool tint.
            Rim (above and behind) catches edges so cubes don't read flat.
            No Environment preset — IBL per Canvas was eating GPU contexts. */}
        <ambientLight intensity={0.42} />
        <directionalLight position={[10, 14, 8]} intensity={1.2} />
        <directionalLight position={[-8, 5, -10]} intensity={0.4} color="#7E90C8" />
        <directionalLight position={[0, 10, -8]} intensity={0.45} color="#FFFFFF" />

        {showFloor && <IsoFloor />}

        {/* Soft drop shadow under whatever the children render. Makes the
            primitives feel anchored instead of floating.
            resolution 256 is plenty for soft blur; was 1024 — 16× memory. */}
        {contactShadow && (
          <ContactShadows
            position={[0, 0.01, 0]}
            opacity={0.55}
            scale={28}
            blur={2.2}
            far={6}
            resolution={256}
            color="#000000"
          />
        )}

        {children}

        {debug && <OrbitControls makeDefault target={target} />}
      </Canvas>
    </div>
  );
}

/** Faint grid floor — much lower opacity than before so it doesn't
 *  compete with the primitive. */
function IsoFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[80, 80, 40, 40]} />
      <meshBasicMaterial color="#1a1c22" wireframe transparent opacity={0.08} />
    </mesh>
  );
}
