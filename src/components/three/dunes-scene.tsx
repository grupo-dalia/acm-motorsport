"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Color, ShaderMaterial } from "three";

/**
 * Dunas nocturnas procedurales (sin texturas ni modelos): ruido fractal + crestas de viento,
 * iluminadas por la luna y fundidas con la niebla del horizonte. El terreno avanza solo.
 */
const noise = /* glsl */ `
  vec2 hash(vec2 p){ p = vec2(dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3))); return -1.0 + 2.0*fract(sin(p)*43758.5453123); }
  float noise(vec2 p){
    const float K1 = 0.366025404; const float K2 = 0.211324865;
    vec2 i = floor(p + (p.x+p.y)*K1); vec2 a = p - i + (i.x+i.y)*K2;
    float m = step(a.y,a.x); vec2 o = vec2(m,1.0-m);
    vec2 b = a - o + K2; vec2 c = a - 1.0 + 2.0*K2;
    vec3 h = max(0.5-vec3(dot(a,a), dot(b,b), dot(c,c)), 0.0);
    vec3 n = h*h*h*h*vec3(dot(a,hash(i)), dot(b,hash(i+o)), dot(c,hash(i+1.0)));
    return dot(n, vec3(70.0));
  }
  float fbm(vec2 p){ float f = 0.0; float a = 0.5; for(int i=0;i<4;i++){ f += a*noise(p); p *= 2.03; a *= 0.5; } return f; }
  float dune(vec2 p){
    float warp = fbm(p*0.018) * 3.2;
    // perfil asimétrico de duna: ladera de barlovento suave y cara de sotavento abrupta
    float s = fract((p.x*0.045 + p.y*0.012) + warp*0.16);
    float profile = smoothstep(0.0, 0.78, s) * (1.0 - smoothstep(0.78, 1.0, s));
    return profile*1.7 + fbm(p*0.028)*1.0 + fbm(p*0.22)*0.04;
  }
`;

function Terrain() {
  const mat = useMemo(
    () =>
      new ShaderMaterial({
        transparent: true,
        uniforms: {
          uTime: { value: 0 },
          uFog: { value: new Color("#16294b") },
          uShadow: { value: new Color("#050a16") },
          uLit: { value: new Color("#6688cc") },
          uCrest: { value: new Color("#c9d6f2") },
        },
        vertexShader: /* glsl */ `
          uniform float uTime;
          varying float vDist; varying vec3 vN; varying float vH;
          ${noise}
          void main(){
            vec3 p = position;
            vec2 q = vec2(p.x, p.y + uTime*1.6);
            float h = dune(q);
            float e = 0.2;
            vec3 n = normalize(vec3(dune(q - vec2(e,0.0)) - dune(q + vec2(e,0.0)), dune(q - vec2(0.0,e)) - dune(q + vec2(0.0,e)), 2.0*e));
            vN = normalize(vec3(n.x, n.z, -n.y));
            vH = h;
            p.z += h;
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            vDist = -mv.z;
            gl_Position = projectionMatrix * mv;
          }`,
        fragmentShader: /* glsl */ `
          uniform vec3 uFog; uniform vec3 uShadow; uniform vec3 uLit; uniform vec3 uCrest;
          varying float vDist; varying vec3 vN; varying float vH;
          void main(){
            vec3 moon = normalize(vec3(0.75, 0.32, -0.55));
            float d = max(dot(vN, moon), 0.0);
            vec3 col = mix(uShadow, uLit, smoothstep(0.05, 0.85, d));
            col += uCrest * pow(d, 8.0) * 0.6;
            float fog = smoothstep(8.0, 62.0, vDist);
            col = mix(col, uFog, fog);
            float alpha = 1.0 - smoothstep(48.0, 66.0, vDist);
            gl_FragColor = vec4(col, alpha);
          }`,
      }),
    [],
  );
  const matRef = useRef(mat);
  useFrame((_, dt) => {
    matRef.current.uniforms.uTime!.value += Math.min(dt, 0.05);
  });
  return (
    <mesh material={mat} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.6, -26]}>
      <planeGeometry args={[140, 70, 260, 140]} />
    </mesh>
  );
}

export default function DunesScene({ active }: { active: boolean }) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.5]}
      camera={{ fov: 38, near: 0.1, far: 120, position: [0, 1.9, 6] }}
      onCreated={({ camera }) => camera.lookAt(0, 0.6, -20)}
      gl={{ antialias: true, alpha: true }}
      aria-hidden
    >
      <Terrain />
    </Canvas>
  );
}
