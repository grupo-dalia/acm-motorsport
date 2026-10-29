"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import type { MotionValue } from "motion/react";
import {
  AdditiveBlending,
  BackSide,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  CatmullRomCurve3,
  Color,
  Group,
  Mesh,
  MeshBasicMaterial,
  ShaderMaterial,
  TubeGeometry,
  Vector3,
} from "three";
import { LEGS, ROUTE, clamp01, latLon, viewAt } from "./geo";

const C_LAND = new Color("#7d9ad3");
const C_ROUTE_LAND = new Color("#f5f7fa");
const C_RED = new Color("#e52435");

/* ───────── Puntos de tierra ───────── */
function LandDots() {
  const [geo, setGeo] = useState<BufferGeometry | null>(null);
  useEffect(() => {
    let alive = true;
    fetch("/globe/dots.bin")
      .then((r) => r.arrayBuffer())
      .then((buf) => {
        if (!alive) return;
        const d = new Int16Array(buf);
        const n = d.length / 3;
        const pos = new Float32Array(n * 3);
        const flag = new Float32Array(n);
        const v = new Vector3();
        for (let i = 0; i < n; i++) {
          latLon(d[i * 3]! / 100, d[i * 3 + 1]! / 100, 1.003, v);
          pos.set([v.x, v.y, v.z], i * 3);
          flag[i] = d[i * 3 + 2]!;
        }
        const g = new BufferGeometry();
        g.setAttribute("position", new BufferAttribute(pos, 3));
        g.setAttribute("flag", new BufferAttribute(flag, 1));
        setGeo(g);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const mat = useMemo(
    () =>
      new ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: { uDpr: { value: 1 }, uLand: { value: C_LAND }, uRoute: { value: C_ROUTE_LAND }, uFade: { value: 0 } },
        vertexShader: /* glsl */ `
          attribute float flag;
          uniform float uDpr;
          varying float vFlag;
          varying float vFacing;
          void main() {
            vFlag = flag;
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            vec3 n = normalize(normalMatrix * position);
            vFacing = dot(n, normalize(-mv.xyz));
            gl_PointSize = (flag > 0.5 ? 2.4 : 4.4) * uDpr * (3.0 / -mv.z);
            gl_Position = projectionMatrix * mv;
          }`,
        fragmentShader: /* glsl */ `
          uniform vec3 uLand;
          uniform vec3 uRoute;
          uniform float uFade;
          varying float vFlag;
          varying float vFacing;
          void main() {
            vec2 c = gl_PointCoord - 0.5;
            float d = length(c);
            if (d > 0.5) discard;
            float edge = smoothstep(0.5, 0.32, d);
            float rim = smoothstep(0.0, 0.35, vFacing);
            vec3 col = mix(uLand, uRoute, vFlag);
            float a = edge * rim * mix(0.78, 1.0, vFlag) * uFade;
            gl_FragColor = vec4(col, a);
          }`,
      }),
    [],
  );
  const dpr = useThree((s) => s.viewport.dpr);
  const matRef = useRef(mat);
  useFrame((_, dt) => {
    const u = matRef.current.uniforms;
    u.uDpr!.value = dpr;
    if (geo) u.uFade!.value = Math.min(1, u.uFade!.value + dt * 0.8);
  });
  if (!geo) return null;
  return <points geometry={geo} material={mat} />;
}

/* ───────── Esfera base y atmósfera ───────── */
function Planet() {
  const core = useMemo(
    () =>
      new ShaderMaterial({
        uniforms: { uBase: { value: new Color("#0b1628") }, uRim: { value: new Color("#3a64b5") } },
        vertexShader: /* glsl */ `
          varying vec3 vN; varying vec3 vV;
          void main() {
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz);
            gl_Position = projectionMatrix * mv;
          }`,
        fragmentShader: /* glsl */ `
          uniform vec3 uBase; uniform vec3 uRim;
          varying vec3 vN; varying vec3 vV;
          void main() {
            float f = pow(1.0 - max(dot(vN, vV), 0.0), 2.6);
            float light = 0.55 + 0.45 * max(dot(vN, normalize(vec3(-0.6, 0.5, 0.8))), 0.0);
            gl_FragColor = vec4(uBase * light + uRim * f * 0.9, 1.0);
          }`,
      }),
    [],
  );
  const halo = useMemo(
    () =>
      new ShaderMaterial({
        side: BackSide,
        transparent: true,
        blending: AdditiveBlending,
        depthWrite: false,
        uniforms: { uColor: { value: new Color("#4f7fe0") } },
        vertexShader: /* glsl */ `
          varying vec3 vN; varying vec3 vV;
          void main() {
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz);
            gl_Position = projectionMatrix * mv;
          }`,
        fragmentShader: /* glsl */ `
          uniform vec3 uColor; varying vec3 vN; varying vec3 vV;
          void main() {
            float i = pow(max(0.0, 0.72 + dot(vN, vV)), 4.0);
            gl_FragColor = vec4(uColor, 1.0) * i * 0.9;
          }`,
      }),
    [],
  );
  return (
    <>
      <mesh material={core}>
        <sphereGeometry args={[1, 96, 96]} />
      </mesh>
      <mesh material={halo} scale={1.16}>
        <sphereGeometry args={[1, 64, 64]} />
      </mesh>
    </>
  );
}

/* ───────── Ruta: arcos, cometa y marcadores ───────── */
function glowTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, "rgba(255,255,255,1)");
  grd.addColorStop(0.25, "rgba(255,120,130,0.7)");
  grd.addColorStop(1, "rgba(229,36,53,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 64, 64);
  return new CanvasTexture(c);
}

function Route({ progress }: { progress: MotionValue<number> }) {
  const RADIAL = 8;
  const SEG = 160;
  const legs = useMemo(
    () =>
      LEGS.map((leg) => {
        const a = latLon(ROUTE[leg.from].lat, ROUTE[leg.from].lon);
        const b = latLon(ROUTE[leg.to].lat, ROUTE[leg.to].lon);
        const pts: Vector3[] = [];
        for (let i = 0; i <= 64; i++) {
          const t = i / 64;
          const v = a.clone().lerp(b, t).normalize();
          pts.push(v.multiplyScalar(1.004 + leg.lift * Math.sin(Math.PI * t)));
        }
        const curve = new CatmullRomCurve3(pts);
        const geo = new TubeGeometry(curve, SEG, 0.0055, RADIAL, false);
        geo.setDrawRange(0, 0);
        return { curve, geo, leg };
      }),
    [],
  );
  const mat = useMemo(() => new MeshBasicMaterial({ color: C_RED, toneMapped: false }), []);
  const tex = useMemo(() => glowTexture(), []);
  const comet = useRef<Mesh>(null);
  const markers = useRef<(Group | null)[]>([]);
  const thresholds = [0.12, LEGS[0].end, LEGS[1].end];

  useFrame(({ clock }) => {
    const p = progress.get();
    let head: Vector3 | null = null;
    legs.forEach(({ geo, curve, leg }) => {
      const f = clamp01((p - leg.start) / (leg.end - leg.start));
      geo.setDrawRange(0, Math.floor(f * SEG) * RADIAL * 6);
      if (f > 0 && f < 1) head = curve.getPoint(f);
    });
    if (comet.current) {
      comet.current.visible = head !== null;
      if (head) comet.current.position.copy(head);
    }
    markers.current.forEach((m, i) => {
      if (!m) return;
      const on = p >= thresholds[i]! ? 1 : 0;
      const s = m.scale.x + (on - m.scale.x) * 0.12;
      m.scale.setScalar(Math.max(0.0001, s));
      const ring = m.children[1] as Mesh | undefined;
      if (ring) {
        const k = (clock.elapsedTime * 0.7 + i * 0.3) % 1;
        ring.scale.setScalar(1 + k * 2.2);
        (ring.material as MeshBasicMaterial).opacity = (1 - k) * 0.8;
      }
    });
  });

  return (
    <>
      {legs.map(({ geo }, i) => <mesh key={i} geometry={geo} material={mat} />)}
      <sprite ref={comet} scale={0.09}>
        <spriteMaterial map={tex} blending={AdditiveBlending} depthWrite={false} transparent />
      </sprite>
      {ROUTE.map((r, i) => {
        const pos = latLon(r.lat, r.lon, 1.006);
        return (
          <group key={r.id} position={pos} ref={(el) => { markers.current[i] = el; }} scale={0.0001} onUpdate={(g) => g.lookAt(pos.clone().multiplyScalar(2))}>
            <mesh>
              <circleGeometry args={[0.014, 24]} />
              <meshBasicMaterial color="#f5f7fa" toneMapped={false} />
            </mesh>
            <mesh>
              <ringGeometry args={[0.018, 0.024, 32]} />
              <meshBasicMaterial color={C_RED} transparent toneMapped={false} depthWrite={false} />
            </mesh>
          </group>
        );
      })}
    </>
  );
}

/* ───────── Polvo de fondo ───────── */
function Dust() {
  const geo = useMemo(() => {
    let seed = 7;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const n = 900;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const v = new Vector3(rnd() * 2 - 1, rnd() * 2 - 1, rnd() * 2 - 1).normalize().multiplyScalar(8 + rnd() * 10);
      pos.set([v.x, v.y, v.z], i * 3);
    }
    const g = new BufferGeometry();
    g.setAttribute("position", new BufferAttribute(pos, 3));
    return g;
  }, []);
  return (
    <points geometry={geo}>
      <pointsMaterial size={0.022} color="#9fb4dc" transparent opacity={0.45} depthWrite={false} />
    </points>
  );
}

/* ───────── Rig: orienta el globo según el scroll ───────── */
function Rig({ progress, offsetX, offsetY }: { progress: MotionValue<number>; offsetX: number; offsetY: number }) {
  const globe = useRef<Group>(null);
  const state = useRef({ lat: 30, lon: 14, dist: 3.9 });
  useFrame(({ camera, clock, size }, dt) => {
    const target = viewAt(progress.get());
    // En pantallas verticales el campo horizontal es estrecho: alejamos la cámara
    const aspect = size.width / size.height;
    const m = aspect < 1 ? Math.min(2.3, 0.88 / aspect) : 1;
    const k = 1 - Math.exp(-dt * 3.2);
    const s = state.current;
    s.lat += (target.lat - s.lat) * k;
    s.lon += (target.lon - s.lon) * k;
    s.dist += (target.dist - s.dist) * k;
    const drift = Math.sin(clock.elapsedTime * 0.15) * 1.5;
    if (globe.current) {
      globe.current.rotation.set((s.lat * Math.PI) / 180, (-(s.lon + drift) * Math.PI) / 180, 0, "XYZ");
      globe.current.position.set(offsetX, offsetY, 0);
    }
    camera.position.set(0, 0, s.dist * m);
    camera.lookAt(offsetX * 0.35, offsetY * 0.35, 0);
  });
  return (
    <group ref={globe}>
      <Planet />
      <LandDots />
      <Route progress={progress} />
    </group>
  );
}

export default function GlobeScene({ progress, onReady }: { progress: MotionValue<number>; onReady?: () => void }) {
  const [offset, setOffset] = useState({ x: 0, y: -0.42 });
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const apply = () => setOffset(mq.matches ? { x: 0.62, y: 0 } : { x: 0, y: -0.42 });
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ fov: 32, near: 0.1, far: 100, position: [0, 0, 3.9] }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={() => onReady?.()}
      aria-hidden
    >
      <Dust />
      <Rig progress={progress} offsetX={offset.x} offsetY={offset.y} />
    </Canvas>
  );
}
