'use client';

import React, { useEffect, useRef } from 'react';

export interface PixelBlastProps {
  variant?: 'square' | 'circle' | 'triangle' | 'diamond' | 'cross' | 'ring' | 'asterisk' | 'mascot';
  pixelSize?: number;
  color?: string;
  accentColor?: string;
  className?: string;
  style?: React.CSSProperties;
  patternScale?: number;
  patternDensity?: number;
  pixelSizeJitter?: number;
  enableRipples?: boolean;
  rippleIntensityScale?: number;
  rippleThickness?: number;
  rippleSpeed?: number;
  autoPauseOffscreen?: boolean;
  speed?: number;
  transparent?: boolean;
  edgeFade?: number;
  noiseAmount?: number;
  softness?: number;
  smoothing?: number;
  glow?: number;
  twinkle?: number;
  drift?: number;
  driftAngle?: number;
  hoverEffect?: 'none' | 'grow' | 'reveal';
  hoverRadius?: number;
  autoRipple?: number;
  tiltX?: number;
  tiltY?: number;
  intro?: boolean;
  variation?: number;
  lightMode?: boolean;
  dpr?: number;
  mascotSrc?: string;
  mascotCenterX?: number;
  mascotCenterY?: number;
  mascotScale?: number;
}

const MAX_CLICKS = 10;
const INTRO_SECONDS = 1.8;
const SHAPES: Record<string, number> = {
  square: 0,
  circle: 1,
  triangle: 2,
  diamond: 3,
  cross: 4,      // Maps to Forke 6-arm Asterisk (*)
  ring: 5,
  asterisk: 4,   // Forke 6-arm Asterisk (*)
  mascot: 7
};
const HOVERS: Record<string, number> = { none: 0, grow: 1, reveal: 2 };
const bayer2 = (x: number, y: number) => (Math.floor(x) / 2 + Math.floor(y) * Math.floor(y) * 0.75) % 1;
const bayer8 = (x: number, y: number) => (bayer2(x / 4, y / 4) * 0.25 + bayer2(x / 2, y / 2)) * 0.25 + bayer2(x, y);
const BAYER_TABLE = Array.from({ length: 64 }, (_, i) => bayer8(i % 8, Math.floor(i / 8)).toFixed(6)).join(', ');
const RANGE_MIN = -6;
const RANGE_MAX = 10;

const VERTEX = `#version 300 es
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

const PACKING = `
const float RANGE_MIN = ${RANGE_MIN.toFixed(1)};
const float RANGE_MAX = ${RANGE_MAX.toFixed(1)};

vec2 pack16(float value) {
  float x = floor(clamp((value - RANGE_MIN) / (RANGE_MAX - RANGE_MIN), 0.0, 1.0) * 65535.0 + 0.5);
  float hi = floor(x / 256.0);
  return vec2(hi, x - hi * 256.0) / 255.0;
}

float unpack16(vec2 c) {
  float x = floor(c.x * 255.0 + 0.5) * 256.0 + floor(c.y * 255.0 + 0.5);
  return RANGE_MIN + x / 65535.0 * (RANGE_MAX - RANGE_MIN);
}
`;

const CELL_FRAGMENT = `#version 300 es
precision highp float;
precision highp int;
const int MAX_CLICKS = 10;

uniform vec2 uResolution;
uniform float uTime;
uniform float uPixelSize;
uniform float uScale;
uniform float uDensity;
uniform int uEnableRipples;
uniform float uRippleSpeed;
uniform float uRippleThickness;
uniform float uRippleIntensity;
uniform vec2 uClickPos[${MAX_CLICKS}];
uniform float uClickAge[${MAX_CLICKS}];
uniform ivec2 uOrigin;
uniform vec2 uDrift;
uniform int uHover;
uniform vec2 uMouse;
uniform float uMouseRadius;
uniform float uMousePresence;
uniform float uIntro;
uniform sampler2D uPrev;
uniform sampler2D uMascot;
uniform vec2 uMascotCenter;
uniform float uMascotScale;
uniform float uDecay;
uniform float uFresh;

out vec4 outCell;
${PACKING}
float hash11(float n) { return fract(sin(n) * 43758.5453); }

float vnoise(vec3 p) {
  vec3 ip = floor(p);
  vec3 fp = fract(p);
  float n000 = hash11(dot(ip + vec3(0.0, 0.0, 0.0), vec3(1.0, 57.0, 113.0)));
  float n100 = hash11(dot(ip + vec3(1.0, 0.0, 0.0), vec3(1.0, 57.0, 113.0)));
  float n010 = hash11(dot(ip + vec3(0.0, 1.0, 0.0), vec3(1.0, 57.0, 113.0)));
  float n110 = hash11(dot(ip + vec3(1.0, 1.0, 0.0), vec3(1.0, 57.0, 113.0)));
  float n001 = hash11(dot(ip + vec3(0.0, 0.0, 1.0), vec3(1.0, 57.0, 113.0)));
  float n101 = hash11(dot(ip + vec3(1.0, 0.0, 1.0), vec3(1.0, 57.0, 113.0)));
  float n011 = hash11(dot(ip + vec3(0.0, 1.0, 1.0), vec3(1.0, 57.0, 113.0)));
  float n111 = hash11(dot(ip + vec3(1.0, 1.0, 1.0), vec3(1.0, 57.0, 113.0)));
  vec3 w = fp * fp * fp * (fp * (fp * 6.0 - 15.0) + 10.0);
  float x00 = mix(n000, n100, w.x);
  float x10 = mix(n010, n110, w.x);
  float x01 = mix(n001, n101, w.x);
  float x11 = mix(n011, n111, w.x);
  float y0 = mix(x00, x10, w.y);
  float y1 = mix(x01, x11, w.y);
  return mix(y0, y1, w.z) * 2.0 - 1.0;
}

float fbm2(vec2 uv, float t) {
  vec3 p = vec3(uv * uScale, t);
  float amp = 1.0;
  float freq = 1.0;
  float sum = 1.0;
  for (int i = 0; i < 5; ++i) {
    sum += amp * vnoise(p * freq);
    freq *= 1.25;
    amp *= 1.0;
  }
  return sum * 0.5 + 0.5;
}

float sdForkyMascot(vec2 p) {
  // 1. Body: squircle / chubby egg
  float body = length(vec2(p.x, (p.y + 0.05) * 1.1)) - 0.22;

  // 2. Left ear: rotated ellipse
  vec2 e1 = vec2((p.x + 0.11) * 0.939 - (p.y - 0.18) * 0.342, (p.x + 0.11) * 0.342 + (p.y - 0.18) * 0.939);
  float ear1 = (length(e1 / vec2(0.065, 0.11)) - 1.0) * 0.065;

  // 3. Right ear: rotated -20 deg
  vec2 e2 = vec2((p.x - 0.11) * 0.939 + (p.y - 0.18) * 0.342, -(p.x - 0.11) * 0.342 + (p.y - 0.18) * 0.939);
  float ear2 = (length(e2 / vec2(0.065, 0.11)) - 1.0) * 0.065;

  // 4. Tail: curved hook on the right
  float tail = length(vec2(p.x - 0.24, p.y + 0.06)) - 0.065;
  float tip = max(abs(p.x - 0.27) + abs(p.y + 0.01) - 0.05, p.x - 0.31);

  // 5. Paws: bottom lobes
  float paw1 = (length(vec2((p.x + 0.12) / 0.08, (p.y + 0.23) / 0.04)) - 1.0) * 0.05;
  float paw2 = (length(vec2((p.x - 0.12) / 0.08, (p.y + 0.23) / 0.04)) - 1.0) * 0.05;

  float d = min(body, min(ear1, min(ear2, min(paw1, paw2))));
  if (p.x > 0.15) {
    d = min(d, min(tail, tip));
  }
  return d;
}

void main() {
  ivec2 texel = ivec2(gl_FragCoord.xy);
  float aspectRatio = uResolution.x / uResolution.y;
  float cellPixelSize = 8.0 * uPixelSize;
  vec2 cellId = vec2(texel + uOrigin);
  vec2 cellCoord = cellId * cellPixelSize;
  vec2 uv = cellCoord / uResolution * vec2(aspectRatio, 1.0);

  float base = fbm2(uv + uDrift, uTime * 0.05);
  base = base * 0.5 - 0.65;
  float feed = base + (uDensity - 0.5) * 0.3;

  // Mascot shape synthesis during animation
  // Positioned via uMascotCenter with gentle floating motion
  vec2 mascotCenter = vec2(uMascotCenter.x, uMascotCenter.y + sin(uTime * 0.8) * 0.03);
  float mascotScale = uMascotScale > 0.0 ? uMascotScale : 0.55;
  vec2 pMascot = (uv - mascotCenter) / mascotScale;
  
  // Calculate procedural mascot SDF (Forky body, ears, tail, paws)
  float dMascot = sdForkyMascot(pMascot);
  float mascotMask = smoothstep(0.03, -0.03, dMascot);

  // Sample mascot texture for facial details (eyes, horns)
  vec2 mUV = pMascot + 0.5;
  if (mUV.x >= 0.0 && mUV.x <= 1.0 && mUV.y >= 0.0 && mUV.y <= 1.0) {
    vec4 mSample = texture(uMascot, vec2(mUV.x, 1.0 - mUV.y));
    float alphaVal = mSample.a > 0.05 ? mSample.a : mSample.r;
    mascotMask = max(mascotMask, alphaVal);
  }

  // Energy wave breathing through the mascot during animation
  float pulse = 0.85 + 0.15 * sin(uTime * 1.8 - dMascot * 12.0);
  mascotMask *= pulse;

  // Modulate cell feed with animated mascot shape
  feed = mix(feed, max(feed, mascotMask * 0.95 - 0.10), 0.78);

  if (uEnableRipples == 1) {
    for (int i = 0; i < MAX_CLICKS; ++i) {
      vec2 pos = uClickPos[i];
      if (pos.x < 0.0) continue;
      vec2 cuv = (((pos - uResolution * 0.5 - cellPixelSize * 0.5) / uResolution)) * vec2(aspectRatio, 1.0);
      float t = max(uClickAge[i], 0.0);
      float r = distance(uv, cuv);
      float waveR = uRippleSpeed * t;
      float ring = exp(-pow((r - waveR) / uRippleThickness, 2.0));
      float atten = exp(-1.0 * t) * exp(-10.0 * r);
      feed = max(feed, ring * atten * uRippleIntensity);
    }
  }

  if (uIntro < 1.0) {
    vec2 center = (-cellPixelSize * 0.5 / uResolution) * vec2(aspectRatio, 1.0);
    float reach = length(vec2(aspectRatio, 1.0)) * 0.5 + 0.2;
    float eased = 1.0 - pow(1.0 - uIntro, 2.4);
    float front = eased * reach;
    float r = distance(uv, center);
    float shown = smoothstep(front + 0.04, front - 0.06, r);
    float ring = exp(-pow((r - front) / 0.07, 2.0)) * (1.0 - uIntro);
    feed = mix(-1.0, feed, shown);
    feed = max(feed, ring * 1.4 + mascotMask * ring * 1.8);
  }

  float brush = 0.0;
  if (uHover > 0) {
    vec2 d = (cellCoord + cellPixelSize * 0.5 + uResolution * 0.5 - uMouse) / max(uMouseRadius, 1.0);
    brush = exp(-dot(d, d)) * uMousePresence;
  }
  vec4 prev = texelFetch(uPrev, texel, 0) * (1.0 - uFresh);
  float trail = max(brush, max(prev.a * uDecay - 1.0 / 255.0, 0.0));
  if (uHover == 2) feed += trail * 0.9;

  outCell = vec4(pack16(feed), clamp((feed + 0.5) * 0.5, 0.0, 1.0), trail);
}`;

const MAIN_FRAGMENT = `#version 300 es
precision highp float;
precision highp int;

uniform vec3 uColor;
uniform vec3 uAccent;
uniform vec2 uResolution;
uniform float uTime;
uniform float uClock;
uniform float uPixelSize;
uniform float uPixelJitter;
uniform float uEdgeFade;
uniform int uShapeType;
uniform sampler2D uCells;
uniform sampler2D uMascot;
uniform ivec2 uOrigin;
uniform ivec2 uCellCount;
uniform float uSoftness;
uniform float uSmoothing;
uniform float uGlow;
uniform float uTwinkle;
uniform float uLightMode;
uniform float uTransparent;
uniform float uNoise;
uniform int uHover;
uniform mat3 uPlane;
uniform float uTilted;

out vec4 fragColor;
${PACKING}
const float BAYER[64] = float[64](${BAYER_TABLE});

vec2 gDx;
vec2 gDy;

float aaFrom(vec2 grad) {
  return abs(dot(grad, gDx)) + abs(dot(grad, gDy));
}

float maskSquare(vec2 p, float cov, float soft) {
  if (soft <= 0.0) return cov;
  float side = 0.5 * sqrt(clamp(cov, 0.0, 1.0));
  vec2 c = p - 0.5;
  vec2 q = abs(c) - side;
  float d = max(q.x, q.y);
  vec2 grad = q.x > q.y ? vec2(sign(c.x), 0.0) : vec2(0.0, sign(c.y));
  float aa = max(aaFrom(grad), 1e-4);
  return 1.0 - smoothstep(-aa * 0.5, aa * 0.5, d);
}

float maskCircle(vec2 p, float cov) {
  float r = sqrt(cov) * 0.25;
  vec2 c = p - 0.5;
  float len = length(c);
  float d = len - r;
  float aa = 0.5 * aaFrom(c / max(len, 1e-5));
  return cov * (1.0 - smoothstep(-aa, aa, d * 2.0));
}

float maskTriangle(vec2 p, vec2 id, float cov) {
  bool flip = mod(id.x + id.y, 2.0) > 0.5;
  if (flip) p.x = 1.0 - p.x;
  float r = sqrt(cov);
  float d = p.y - r * (1.0 - p.x);
  float aa = max(aaFrom(vec2(flip ? -r : r, 1.0)), 1e-4);
  return cov * clamp(0.5 - d / aa, 0.0, 1.0);
}

float maskDiamond(vec2 p, float cov) {
  float r = sqrt(cov) * 0.564;
  return step(abs(p.x - 0.49) + abs(p.y - 0.49), r);
}

// Forke 6-arm Asterisk (*)
float maskAsterisk(vec2 p, float cov) {
  float s = sqrt(clamp(cov, 0.0, 1.0));
  vec2 c = p - 0.5;
  float arm = 0.46 * s;
  float bar = 0.13 * s + 0.015;

  // 1. Horizontal bar (0 deg)
  vec2 q0 = abs(c);
  float d0 = max(q0.x - arm, q0.y - bar);

  // 2. Bar at 60 deg (cos 60 = 0.5, sin 60 = 0.8660254)
  vec2 c1 = vec2(c.x * 0.5 + c.y * 0.8660254, -c.x * 0.8660254 + c.y * 0.5);
  vec2 q1 = abs(c1);
  float d1 = max(q1.x - arm, q1.y - bar);

  // 3. Bar at -60 deg
  vec2 c2 = vec2(c.x * 0.5 - c.y * 0.8660254, c.x * 0.8660254 + c.y * 0.5);
  vec2 q2 = abs(c2);
  float d2 = max(q2.x - arm, q2.y - bar);

  float d = min(d0, min(d1, d2));
  float aa = max(aaFrom(vec2(1.0, 1.0)), 1e-4);
  return 1.0 - smoothstep(-aa * 0.5, aa * 0.5, d);
}

float maskRing(vec2 p, float cov) {
  float s = sqrt(clamp(cov, 0.0, 1.0));
  vec2 c = p - 0.5;
  float len = length(c);
  float d = abs(len - 0.3 * s) - 0.09 * s;
  vec2 grad = sign(len - 0.3 * s) * c / max(len, 1e-5);
  float aa = max(aaFrom(grad), 1e-4);
  return 1.0 - smoothstep(-aa * 0.5, aa * 0.5, d);
}

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  float pixelSize = uPixelSize;
  vec2 screen = gl_FragCoord.xy;
  vec4 empty = uTransparent < 0.5 ? vec4(vec3(uLightMode > 0.5 ? 1.0 : 0.0), 1.0) : vec4(0.0);

  float lod = 0.0;
  float depthFade = 1.0;
  if (uTilted > 0.5) {
    vec3 plane = uPlane * vec3(screen.x, uResolution.y - screen.y, 1.0);
    screen = vec2(plane.x, uResolution.y * plane.z - plane.y) / max(plane.z, 1e-4);
    float footprint = length(fwidth(screen));
    lod = smoothstep(0.3, 0.85, footprint / pixelSize);
    depthFade = (1.0 - smoothstep(0.45, 1.0, footprint / (8.0 * pixelSize))) * step(0.0, plane.z);
  }

  vec2 fragCoord = screen - uResolution * 0.5;
  gDx = dFdx(fragCoord) / pixelSize;
  gDy = dFdy(fragCoord) / pixelSize;
  if (depthFade <= 0.0) {
    fragColor = empty;
    return;
  }

  float cellPixelSize = 8.0 * pixelSize;
  vec2 cellId = floor(fragCoord / cellPixelSize);
  ivec2 texel = clamp(ivec2(cellId) - uOrigin, ivec2(0), uCellCount - 1);
  vec2 smoothAt = (fragCoord / cellPixelSize - vec2(uOrigin)) / vec2(uCellCount);
  vec4 blended = texture(uCells, smoothAt);
  float smoothFeed = blended.b * 2.0 - 0.5;
  float feed = smoothFeed;
  float trail = uHover == 1 ? blended.a : 0.0;
  if (uSmoothing < 1.0) {
    vec4 cell = texelFetch(uCells, texel, 0);
    feed = mix(unpack16(cell.rg), smoothFeed, uSmoothing);
    if (uHover == 1) trail = mix(cell.a, blended.a, uSmoothing);
  }

  if (feed < -0.12 * uSoftness && smoothFeed < 0.2 && (lod <= 0.0 || smoothFeed <= 0.0)) {
    fragColor = empty;
    return;
  }

  vec2 pixelId = floor(fragCoord / pixelSize);
  vec2 pixelUV = fragCoord / pixelSize - pixelId;
  ivec2 cellBits = ivec2(mod(pixelId, 8.0));
  float bayer = BAYER[cellBits.y * 8 + cellBits.x] - 0.5;
  float margin = feed + bayer - 0.5;
  float bw = uSoftness > 0.0 ? smoothstep(-0.12 * uSoftness, 0.12 * uSoftness, margin) : step(0.0, margin);

  float h = uPixelJitter > 0.0 || uTwinkle > 0.0 ? fract(sin(dot(pixelId, vec2(127.1, 311.7))) * 43758.5453) : 0.5;
  float jitterScale = 1.0 + (h - 0.5) * uPixelJitter;
  float heat = max(trail, clamp((feed - 1.0) * 2.5, 0.0, 1.0) * min(uGlow * 2.0, 1.0));
  float coverage = bw * jitterScale * (1.0 + heat * 0.35);
  float M;
  float area;
  if (uShapeType == 1) {
    M = maskCircle(pixelUV, coverage);
    area = 0.196;
  } else if (uShapeType == 2) {
    M = maskTriangle(pixelUV, pixelId, coverage);
    area = 0.5;
  } else if (uShapeType == 3) {
    M = maskDiamond(pixelUV, coverage);
    area = 0.62;
  } else if (uShapeType == 4) {
    // Cross / Asterisk (*) -> Forke 6-arm Asterisk
    M = maskAsterisk(pixelUV, coverage);
    area = 0.44;
  } else if (uShapeType == 5) {
    M = maskRing(pixelUV, coverage);
    area = 0.41;
  } else {
    M = maskSquare(pixelUV, coverage, uSoftness);
    area = 1.0;
  }
  if (lod > 0.0) {
    float average = clamp(smoothFeed, 0.0, 1.0) * area * (1.0 + heat * 0.35);
    M = mix(M, average, lod);
  }

  if (uTwinkle > 0.0) {
    float rate = 1.5 + 3.0 * fract(h * 7.31);
    float wave = 0.5 + 0.5 * sin(uClock * rate + h * 37.0);
    M *= 1.0 - uTwinkle * 0.55 * wave * wave;
  }

  float density = clamp(smoothFeed, 0.0, 1.0);
  float glow = 0.0;
  if (uGlow > 0.0) {
    float bloom = smoothstep(0.2, 1.0, density);
    glow = bloom * bloom * uGlow * (uLightMode > 0.5 ? 0.12 : 0.22) * depthFade;
  }

  float fade = depthFade;
  if (uEdgeFade > 0.0) {
    vec2 norm = gl_FragCoord.xy / uResolution;
    vec2 edgeA = clamp(norm / uEdgeFade, 0.0, 1.0);
    vec2 edgeB = clamp((1.0 - norm) / uEdgeFade, 0.0, 1.0);
    vec2 sa = edgeA * edgeA * edgeA * (edgeA * (edgeA * 6.0 - 15.0) + 10.0);
    vec2 sb = edgeB * edgeB * edgeB * (edgeB * (edgeB * 6.0 - 15.0) + 10.0);
    fade *= sa.x * sa.y * sb.x * sb.y;
  }
  M = clamp(M, 0.0, 1.0) * fade;
  glow *= fade;

  float hot = clamp(heat, 0.0, 1.0);
  float tone = smoothstep(0.3, 1.0, density) * 0.85;
  vec3 activeAccent = uLightMode > 0.5 ? mix(uColor, vec3(0.98, 0.45, 0.08), 0.5) : uAccent;
  vec3 color = mix(uColor, activeAccent, max(tone, hot));
  vec3 lit = uLightMode > 0.5 ? color * (1.0 - 0.15 * hot) : mix(color, vec3(1.0), 0.45 * hot);
  if (uNoise > 0.0) {
    float n = hash(floor(gl_FragCoord.xy) + floor(uTime * 60.0));
    lit = clamp(lit + (n - 0.5) * uNoise, 0.0, 1.0);
  }

  vec3 haze = uLightMode > 0.5 ? mix(color, vec3(1.0), 0.35) : color;
  float alpha = M + glow * (1.0 - M);
  vec3 premul = lit * M + haze * glow * (1.0 - M);
  if (uTransparent < 0.5) {
    vec3 paper = vec3(uLightMode > 0.5 ? 1.0 : 0.0);
    fragColor = vec4(premul + paper * (1.0 - alpha), 1.0);
    return;
  }
  fragColor = vec4(premul, alpha);
}`;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const compile = (gl: WebGL2RenderingContext, type: number, source: string) => {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
};

const link = (gl: WebGL2RenderingContext, fragmentSource: string) => {
  const vs = compile(gl, gl.VERTEX_SHADER, VERTEX);
  const fs = compile(gl, gl.FRAGMENT_SHADER, fragmentSource);
  if (!vs || !fs) return null;
  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  const uniforms: Record<string, WebGLUniformLocation> = {};
  const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < count; i++) {
    const info = gl.getActiveUniform(program, i);
    if (!info) continue;
    const loc = gl.getUniformLocation(program, info.name);
    if (loc) uniforms[info.name] = loc;
  }
  return { program, uniforms };
};

const colorCache = new Map<string, number[]>();

const hexToRgb = (hex: string) => {
  if (colorCache.has(hex)) return colorCache.get(hex)!;
  const [r, g, b] = parseHex(hex);
  const out = [r / 255, g / 255, b / 255];
  colorCache.set(hex, out);
  return out;
};

const parseHex = (hex: string) => {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const num = parseInt(c, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
};

const randomFloat = () => {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const u = new Uint32Array(1);
    crypto.getRandomValues(u);
    return u[0] / 0xffffffff;
  }
  return Math.random();
};

const invert3 = (m: number[]) => {
  const [a00, a01, a02, a10, a11, a12, a20, a21, a22] = m;
  const b01 = a22 * a11 - a12 * a21;
  const b11 = -a22 * a10 + a12 * a20;
  const b21 = a21 * a10 - a11 * a20;
  const det = a00 * b01 + a01 * b11 + a02 * b21;
  if (!det) return null;
  const inv = 1 / det;
  return [
    b01 * inv,
    (-a22 * a01 + a02 * a21) * inv,
    (a12 * a01 - a02 * a11) * inv,
    b11 * inv,
    (a22 * a00 - a02 * a20) * inv,
    (-a12 * a00 + a02 * a10) * inv,
    b21 * inv,
    (-a21 * a00 + a01 * a20) * inv,
    (a11 * a00 - a01 * a10) * inv
  ];
};

const multiply3 = (x: number[], y: number[]) => {
  const out = new Array(9);
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      out[row * 3 + col] =
        x[row * 3 + 0] * y[0 * 3 + col] +
        x[row * 3 + 1] * y[1 * 3 + col] +
        x[row * 3 + 2] * y[2 * 3 + col];
    }
  }
  return out;
};

const planeFor = (tiltX: number, tiltY: number, width: number, height: number) => {
  const radX = (tiltX * Math.PI) / 180;
  const radY = (tiltY * Math.PI) / 180;
  const cx = Math.cos(radX);
  const sx = Math.sin(radX);
  const cy = Math.cos(radY);
  const sy = Math.sin(radY);
  const rx = [1, 0, 0, 0, cx, -sx, 0, sx, cx];
  const ry = [cy, 0, sy, 0, 1, 0, -sy, 0, cy];
  const rot = multiply3(ry, rx);
  const fov = 800;
  const trans = [1, 0, -width / 2, 0, 1, -height / 2, 0, 0, fov];
  const forward = multiply3(rot, trans);
  return invert3(forward);
};

export default function PixelBlast({
  variant = 'cross',
  pixelSize = 3,
  color = '#f97316',
  accentColor = '#000000',
  className = '',
  style = {},
  patternScale = 1.7,
  patternDensity = 0.65,
  pixelSizeJitter = 0.09,
  enableRipples = true,
  rippleIntensityScale = 1,
  rippleThickness = 0.1,
  rippleSpeed = 0.3,
  autoPauseOffscreen = true,
  speed = 0.6,
  transparent = true,
  edgeFade = 0.25,
  noiseAmount = 0,
  softness = 0.6,
  smoothing = 1,
  glow = 0.4,
  twinkle = 0.2,
  drift = 0.2,
  driftAngle = 30,
  hoverEffect = 'none',
  hoverRadius = 140,
  autoRipple = 0,
  tiltX = 0,
  tiltY = 0,
  intro = true,
  variation,
  lightMode = false,
  dpr,
  mascotSrc = '/forke-assets/mascot_mask.png',
  mascotCenterX = 0,
  mascotCenterY = 0,
  mascotScale = 0.55
}: PixelBlastProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const settings = {
    variant: SHAPES[variant] ?? 4,
    pixelSize: Math.max(0.5, pixelSize),
    color,
    accentColor: accentColor || color,
    patternScale,
    patternDensity,
    pixelSizeJitter,
    enableRipples,
    rippleIntensityScale,
    rippleThickness: Math.max(0.001, rippleThickness),
    rippleSpeed,
    autoPauseOffscreen,
    speed,
    transparent,
    edgeFade: clamp(edgeFade, 0, 1),
    noiseAmount,
    softness: clamp(softness, 0, 1),
    smoothing: clamp(smoothing, 0, 1),
    glow: clamp(glow, 0, 2),
    twinkle: clamp(twinkle, 0, 1),
    drift,
    driftAngle,
    hoverEffect: HOVERS[hoverEffect] ?? 0,
    hoverRadius: Math.max(10, hoverRadius),
    autoRipple: Math.max(0, autoRipple),
    tiltX: clamp(tiltX, -70, 70),
    tiltY: clamp(tiltY, -70, 70),
    intro,
    variation,
    lightMode,
    dpr,
    mascotSrc,
    mascotCenterX,
    mascotCenterY,
    mascotScale
  };
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return undefined;

    const gl = canvas.getContext('webgl2', {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      depth: false,
      stencil: false
    });
    if (!gl) return undefined;

    const cellShader = link(gl, CELL_FRAGMENT);
    const mainShader = link(gl, MAIN_FRAGMENT);
    if (!cellShader || !mainShader) return undefined;
    const cu = cellShader.uniforms;
    const mu = mainShader.uniforms;
    const vao = gl.createVertexArray();

    const makeTexture = (filter: number) => {
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      return texture;
    };

    const targets = [0, 1].map(() => {
      const texture = makeTexture(gl.LINEAR);
      const framebuffer = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      return { texture, framebuffer };
    });
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    // Mascot Mask Texture Setup
    const mascotTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, mascotTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    // 1x1 initial fallback pixel (white)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255, 255]));

    const mascotImg = new Image();
    mascotImg.crossOrigin = 'anonymous';
    mascotImg.src = settings.mascotSrc;
    mascotImg.onload = () => {
      if (!gl.isContextLost()) {
        gl.bindTexture(gl.TEXTURE_2D, mascotTexture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE, mascotImg);
        fresh = true;
      }
    };

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const view: { width: number; height: number; ratio: number; plane: number[] | null; tiltKey: string } = {
      width: 1,
      height: 1,
      ratio: 1,
      plane: null,
      tiltKey: ''
    };
    const cells = { x: 0, y: 0, w: 1, h: 1, key: '' };
    const pointer = { x: 0, y: 0, inside: false };
    const mouse = { x: 0, y: 0, ready: false };
    const clickPos = new Float32Array(MAX_CLICKS * 2).fill(-1);
    const clickAt = new Float32Array(MAX_CLICKS);
    const clickAge = new Float32Array(MAX_CLICKS);
    let clickIndex = 0;
    let current = 0;
    let fresh = true;
    const seedOffset = settingsRef.current.variation;
    const timeOffset = typeof seedOffset === 'number' ? seedOffset * 37 : randomFloat() * 1000;
    let elapsed = 0;
    let clock = 0;
    let presence = 0;
    let driftX = 0;
    let driftY = 0;
    let introClock = settingsRef.current.intro && !reduce ? 0 : 1;
    let nextAuto = 1.2;
    let raf = 0;
    let last = 0;
    let visible = true;

    const patternTime = (s: typeof settings) => timeOffset + elapsed * s.speed;

    const toPlane = (x: number, y: number) => {
      if (!view.plane) return [x, y];
      const m = view.plane;
      const invY = canvas.height - y;
      const z = m[2] * x + m[5] * invY + m[8];
      if (z <= 0.001) return [-Infinity, -Infinity];
      const px = (m[0] * x + m[3] * invY + m[6]) / z;
      const py = (m[1] * x + m[4] * invY + m[7]) / z;
      return [px, canvas.height - py];
    };

    const layoutCells = (s: typeof settings) => {
      const ps = s.pixelSize * view.ratio;
      const cps = 8 * ps;
      const w = canvas.width;
      const h = canvas.height;
      let minX = -w / 2;
      let maxX = w / 2;
      let minY = -h / 2;
      let maxY = h / 2;
      if (view.plane) {
        const corners = [
          [0, 0],
          [w, 0],
          [0, h],
          [w, h],
          [w / 2, 0],
          [w / 2, h],
          [0, h / 2],
          [w, h / 2]
        ];
        minX = Infinity;
        maxX = -Infinity;
        minY = Infinity;
        maxY = -Infinity;
        for (const [x, y] of corners) {
          const [qx, qy] = toPlane(x, y);
          if (qx < -1e5) continue;
          minX = Math.min(minX, qx - w / 2);
          maxX = Math.max(maxX, qx - w / 2);
          minY = Math.min(minY, qy - h / 2);
          maxY = Math.max(maxY, qy - h / 2);
        }
        if (!Number.isFinite(minX)) {
          minX = -w / 2;
          maxX = w / 2;
          minY = -h / 2;
          maxY = h / 2;
        }
      }
      const pad = cps;
      const x0 = Math.floor((minX - pad) / cps);
      const x1 = Math.floor((maxX + pad) / cps);
      const y0 = Math.floor((minY - pad) / cps);
      const y1 = Math.floor((maxY + pad) / cps);
      const width = Math.max(1, Math.min(2048, x1 - x0 + 1));
      const height = Math.max(1, Math.min(2048, y1 - y0 + 1));
      const key = `${x0}:${y0}:${width}:${height}`;
      if (key === cells.key) return;
      cells.key = key;
      cells.x = x0;
      cells.y = y0;
      cells.w = width;
      cells.h = height;
      for (const target of targets) {
        gl.bindTexture(gl.TEXTURE_2D, target.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      }
      fresh = true;
    };

    const planeClicks = new Float32Array(MAX_CLICKS * 2);

    const stepCells = (s: typeof settings, decay: number) => {
      for (let k = 0; k < MAX_CLICKS; k++) {
        if (clickPos[k * 2] < 0) {
          planeClicks[k * 2] = -1;
          planeClicks[k * 2 + 1] = -1;
          continue;
        }
        const [px, py] = toPlane(clickPos[k * 2], clickPos[k * 2 + 1]);
        planeClicks[k * 2] = Math.max(px, 0);
        planeClicks[k * 2 + 1] = py;
      }
      const [mx, my] = toPlane(mouse.x, mouse.y);
      const source = targets[current];
      const target = targets[1 - current];
      gl.bindFramebuffer(gl.FRAMEBUFFER, target.framebuffer);
      gl.viewport(0, 0, cells.w, cells.h);
      gl.disable(gl.BLEND);
      gl.useProgram(cellShader.program);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, source.texture);
      gl.uniform1i(cu.uPrev, 0);

      // Bind mascot texture unit 1
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, mascotTexture);
      gl.uniform1i(cu.uMascot, 1);

      gl.uniform2f(cu.uResolution, canvas.width, canvas.height);
      gl.uniform1f(cu.uTime, patternTime(s));
      gl.uniform1f(cu.uPixelSize, s.pixelSize * view.ratio);
      gl.uniform1f(cu.uScale, s.patternScale);
      gl.uniform1f(cu.uDensity, s.patternDensity);
      gl.uniform1i(cu.uEnableRipples, s.enableRipples ? 1 : 0);
      gl.uniform1f(cu.uRippleSpeed, s.rippleSpeed);
      gl.uniform1f(cu.uRippleThickness, s.rippleThickness);
      gl.uniform1f(cu.uRippleIntensity, s.rippleIntensityScale);
      gl.uniform2fv(cu.uClickPos, planeClicks);
      gl.uniform1fv(cu.uClickAge, clickAge);
      gl.uniform2i(cu.uOrigin, cells.x, cells.y);
      gl.uniform2f(cu.uDrift, driftX, driftY);
      gl.uniform1i(cu.uHover, s.hoverEffect);
      gl.uniform2f(cu.uMouse, mx, my);
      gl.uniform1f(cu.uMouseRadius, s.hoverRadius * view.ratio);
      gl.uniform1f(cu.uMousePresence, presence);
      gl.uniform1f(cu.uIntro, introClock);
      if (cu.uMascotCenter) gl.uniform2f(cu.uMascotCenter, s.mascotCenterX, s.mascotCenterY);
      if (cu.uMascotScale) gl.uniform1f(cu.uMascotScale, s.mascotScale);
      gl.uniform1f(cu.uDecay, decay);
      gl.uniform1f(cu.uFresh, fresh ? 1 : 0);
      gl.bindVertexArray(vao);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      current = 1 - current;
      fresh = false;
    };

    const draw = () => {
      const s = settingsRef.current;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(mainShader.program);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, targets[current].texture);
      if (mu.uCells) gl.uniform1i(mu.uCells, 0);

      gl.uniform3fv(mu.uColor, hexToRgb(s.color));
      gl.uniform3fv(mu.uAccent, hexToRgb(s.accentColor));
      gl.uniform2f(mu.uResolution, canvas.width, canvas.height);
      gl.uniform1f(mu.uTime, patternTime(s));
      gl.uniform1f(mu.uClock, clock);
      gl.uniform1f(mu.uPixelSize, s.pixelSize * view.ratio);
      gl.uniform1f(mu.uPixelJitter, s.pixelSizeJitter);
      gl.uniform1f(mu.uEdgeFade, s.edgeFade);
      gl.uniform1i(mu.uShapeType, s.variant);
      gl.uniform2i(mu.uOrigin, cells.x, cells.y);
      gl.uniform2i(mu.uCellCount, cells.w, cells.h);
      gl.uniform1f(mu.uSoftness, s.softness);
      gl.uniform1f(mu.uSmoothing, s.smoothing);
      gl.uniform1f(mu.uGlow, s.glow);
      gl.uniform1f(mu.uTwinkle, reduce ? 0 : s.twinkle);
      gl.uniform1f(mu.uLightMode, s.lightMode ? 1 : 0);
      gl.uniform1f(mu.uTransparent, s.transparent ? 1 : 0);
      gl.uniform1f(mu.uNoise, s.noiseAmount);
      gl.uniform1i(mu.uHover, s.hoverEffect);
      gl.uniform1f(mu.uTilted, view.plane ? 1 : 0);
      if (view.plane) {
        const m = view.plane;
        gl.uniformMatrix3fv(mu.uPlane, false, [m[0], m[3], m[6], m[1], m[4], m[7], m[2], m[5], m[8]]);
      }
      gl.bindVertexArray(vao);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const addClick = (x: number, y: number) => {
      clickPos[clickIndex * 2] = x;
      clickPos[clickIndex * 2 + 1] = y;
      clickAt[clickIndex] = clock;
      clickAge[clickIndex] = 0;
      clickIndex = (clickIndex + 1) % MAX_CLICKS;
    };

    const updatePlane = (s: typeof settings) => {
      const key = `${s.tiltX}:${s.tiltY}:${canvas.width}:${canvas.height}`;
      if (key === view.tiltKey) return;
      view.tiltKey = key;
      view.plane = s.tiltX || s.tiltY ? planeFor(s.tiltX, s.tiltY, canvas.width, canvas.height) : null;
    };

    const resize = () => {
      const s = settingsRef.current;
      const rect = container.getBoundingClientRect();
      const pr = s.dpr || Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.floor(rect.width * pr));
      const h = Math.max(1, Math.floor(rect.height * pr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      view.width = w;
      view.height = h;
      view.ratio = pr;
      updatePlane(s);
      layoutCells(s);
    };

    resize();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null;
    ro?.observe(container);

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) * view.ratio;
      const y = (e.clientY - rect.top) * view.ratio;
      pointer.inside = x >= 0 && x <= canvas.width && y >= 0 && y <= canvas.height;
      if (pointer.inside) {
        pointer.x = x;
        pointer.y = y;
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      const s = settingsRef.current;
      if (!s.enableRipples) return;
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) * view.ratio;
      const y = (e.clientY - rect.top) * view.ratio;
      if (x >= 0 && x <= canvas.width && y >= 0 && y <= canvas.height) {
        addClick(x, y);
      }
    };

    const onPointerLeave = () => {
      pointer.inside = false;
    };

    const onVisibility = () => {
      visible = document.visibilityState !== 'hidden';
      if (visible) last = performance.now();
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    document.documentElement.addEventListener('pointerleave', onPointerLeave);
    document.addEventListener('visibilitychange', onVisibility);

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible) return;
      if (!last) last = now;
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;

      const s = settingsRef.current;
      clock += dt;
      elapsed += dt;

      if (introClock < 1) {
        introClock = Math.min(1, introClock + dt / INTRO_SECONDS);
      }

      for (let i = 0; i < MAX_CLICKS; i++) {
        if (clickPos[i * 2] >= 0) {
          clickAge[i] = clock - clickAt[i];
          if (clickAge[i] > 4.0) {
            clickPos[i * 2] = -1;
            clickPos[i * 2 + 1] = -1;
          }
        }
      }

      if (s.autoRipple > 0) {
        nextAuto -= dt;
        if (nextAuto <= 0) {
          nextAuto = s.autoRipple + randomFloat() * s.autoRipple;
          addClick(randomFloat() * canvas.width, randomFloat() * canvas.height);
        }
      }

      const rad = (s.driftAngle * Math.PI) / 180;
      driftX += Math.cos(rad) * s.drift * dt * 0.1;
      driftY += Math.sin(rad) * s.drift * dt * 0.1;

      if (pointer.inside) {
        presence = Math.min(1, presence + dt * 4.0);
        mouse.x += (pointer.x - mouse.x) * Math.min(1, dt * 12.0);
        mouse.y += (pointer.y - mouse.y) * Math.min(1, dt * 12.0);
      } else {
        presence = Math.max(0, presence - dt * 2.0);
      }

      const decay = Math.exp(-dt * 3.0);
      stepCells(s, decay);
      draw();
    };

    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      document.documentElement.removeEventListener('pointerleave', onPointerLeave);
      document.removeEventListener('visibilitychange', onVisibility);
      ro?.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden ${className}`}
      style={style}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block w-full h-full"
      />
    </div>
  );
}
