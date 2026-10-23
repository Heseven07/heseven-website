/**
 * Cursor splash — a WebGL2 fluid simulation (stable fluids: advection, vorticity, pressure solve) in
 * the style of React Bits' "Splash Cursor": swirling ink with depth shading that trails the pointer and
 * bursts into a splash on click. Ink colours cycle through the brand palette.
 *
 * Loaded lazily by motion.ts on the first mouse move, and only for a fine pointer without
 * reduced motion, so it never runs during page load (Lighthouse never moves the mouse). The render
 * loop stops by itself a few seconds after the pointer goes still.
 */
const SIM_RES = 128;
const DYE_RES = 1024;
const DENSITY_DISSIPATION = 3.5; // trail length (lower = lingers longer)
const VELOCITY_DISSIPATION = 2; // momentum (lower = keeps flowing longer)
const PRESSURE = 0.1;
const PRESSURE_ITERATIONS = 20;
const CURL = 3; // swirl
const SPLAT_RADIUS = 0.08; // thin strokes
const SPLAT_FORCE = 6000;
const INTENSITY = 0.12; // ink per movement (light, so text underneath stays readable)
const CLICK_SPLASH = 6; // ink multiplier for the click burst
const COLOR_SPEED = 1; // hue sweep speed (one violet → lime → violet cycle ≈ 6s)
const IDLE_MS = 6000;

// Ink hue sweeps between brand violet (255°) and brand lime (85°) around the colour wheel (via teal),
// never straight across it: violet and lime are near-complementary, so mixing them directly gives grey.
const VIOLET_HUE = 255;
const LIME_HUE = 85;
const inkColor = (now: number, scale: number) => {
  const t = 0.5 + 0.5 * Math.sin((now / 1000) * COLOR_SPEED);
  const h = (LIME_HUE + (VIOLET_HUE - LIME_HUE) * t) / 60;
  const s = 0.85;
  const x = 1 - Math.abs((h % 2) - 1);
  const [r, g, b] =
    h < 1
      ? [1, x, 0]
      : h < 2
        ? [x, 1, 0]
        : h < 3
          ? [0, 1, x]
          : h < 4
            ? [0, x, 1]
            : h < 5
              ? [x, 0, 1]
              : [1, 0, x];
  return [r, g, b].map((c) => (1 - s + s * c) * scale);
};

let started = false;

export function startSmoke(first?: PointerEvent) {
  if (started) return;
  started = true;

  const canvas = document.createElement('canvas');
  canvas.className = 'cursor-smoke';
  canvas.setAttribute('aria-hidden', 'true');
  const ctx = canvas.getContext('webgl2', {
    alpha: true,
    depth: false,
    stencil: false,
    antialias: false,
    premultipliedAlpha: true,
  });
  if (
    !ctx ||
    !(ctx.getExtension('EXT_color_buffer_float') || ctx.getExtension('EXT_color_buffer_half_float'))
  )
    return;
  const gl: WebGL2RenderingContext = ctx;
  document.body.append(canvas);
  // The body is replaced on view-transition navigations: carry the canvas over.
  document.addEventListener('astro:after-swap', () => document.body.append(canvas));

  // ---- shaders -------------------------------------------------------------------------------------
  const VS = `#version 300 es
precision highp float;
in vec2 aPosition;
out vec2 vUv, vL, vR, vT, vB;
uniform vec2 texelSize;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  vL = vUv - vec2(texelSize.x, 0.0);
  vR = vUv + vec2(texelSize.x, 0.0);
  vT = vUv + vec2(0.0, texelSize.y);
  vB = vUv - vec2(0.0, texelSize.y);
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;
  const head = `#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 vUv, vL, vR, vT, vB;
out vec4 o;
`;
  const FS = {
    clear: `uniform sampler2D uTexture; uniform float value;
void main() { o = value * texture(uTexture, vUv); }`,
    splat: `uniform sampler2D uTarget; uniform float aspectRatio, radius; uniform vec3 color; uniform vec2 point;
void main() {
  vec2 p = vUv - point; p.x *= aspectRatio;
  o = vec4(texture(uTarget, vUv).xyz + exp(-dot(p, p) / radius) * color, 1.0);
}`,
    advection: `uniform sampler2D uVelocity, uSource; uniform vec2 texelSize; uniform float dt, dissipation;
void main() {
  vec2 coord = vUv - dt * texture(uVelocity, vUv).xy * texelSize;
  o = texture(uSource, coord) / (1.0 + dissipation * dt);
}`,
    divergence: `uniform sampler2D uVelocity;
void main() {
  float L = texture(uVelocity, vL).x, R = texture(uVelocity, vR).x;
  float T = texture(uVelocity, vT).y, B = texture(uVelocity, vB).y;
  vec2 C = texture(uVelocity, vUv).xy;
  if (vL.x < 0.0) L = -C.x; if (vR.x > 1.0) R = -C.x;
  if (vT.y > 1.0) T = -C.y; if (vB.y < 0.0) B = -C.y;
  o = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
}`,
    curl: `uniform sampler2D uVelocity;
void main() {
  float L = texture(uVelocity, vL).y, R = texture(uVelocity, vR).y;
  float T = texture(uVelocity, vT).x, B = texture(uVelocity, vB).x;
  o = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0);
}`,
    vorticity: `uniform sampler2D uVelocity, uCurl; uniform float curl, dt;
void main() {
  float L = texture(uCurl, vL).x, R = texture(uCurl, vR).x;
  float T = texture(uCurl, vT).x, B = texture(uCurl, vB).x, C = texture(uCurl, vUv).x;
  vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
  force /= length(force) + 0.0001;
  force *= curl * C; force.y *= -1.0;
  vec2 vel = texture(uVelocity, vUv).xy + force * dt;
  o = vec4(clamp(vel, -1000.0, 1000.0), 0.0, 1.0);
}`,
    pressure: `uniform sampler2D uPressure, uDivergence;
void main() {
  float L = texture(uPressure, vL).x, R = texture(uPressure, vR).x;
  float T = texture(uPressure, vT).x, B = texture(uPressure, vB).x;
  o = vec4((L + R + B + T - texture(uDivergence, vUv).x) * 0.25, 0.0, 0.0, 1.0);
}`,
    gradient: `uniform sampler2D uPressure, uVelocity;
void main() {
  float L = texture(uPressure, vL).x, R = texture(uPressure, vR).x;
  float T = texture(uPressure, vT).x, B = texture(uPressure, vB).x;
  vec2 vel = texture(uVelocity, vUv).xy - vec2(R - L, T - B);
  o = vec4(vel, 0.0, 1.0);
}`,
    display: `uniform sampler2D uTexture; uniform vec2 texelSize;
void main() {
  vec3 c = texture(uTexture, vUv).rgb;
  // Depth shading: treat ink density as a height map and light it from the front, like wet ink.
  float dx = length(texture(uTexture, vR).rgb) - length(texture(uTexture, vL).rgb);
  float dy = length(texture(uTexture, vT).rgb) - length(texture(uTexture, vB).rgb);
  vec3 n = normalize(vec3(dx, dy, length(texelSize)));
  c *= clamp(dot(n, vec3(0.0, 0.0, 1.0)) + 0.7, 0.7, 1.0);
  // Compress brightness only (not each channel), so dense ink keeps its hue instead of washing to white.
  float m = max(c.r, max(c.g, c.b));
  c *= (1.0 - exp(-m * 2.2)) / max(m, 0.0001);
  // Cap the ink's opacity so buttons and links underneath always read through it.
  o = vec4(c, max(c.r, max(c.g, c.b))) * 0.55;
}`,
  };

  type Prog = { p: WebGLProgram; u: Record<string, WebGLUniformLocation | null> };
  const shader = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  };
  const vs = shader(gl.VERTEX_SHADER, VS);
  const prog = (fs: string): Prog => {
    const p = gl.createProgram()!;
    gl.attachShader(p, vs);
    gl.attachShader(p, shader(gl.FRAGMENT_SHADER, head + fs));
    gl.bindAttribLocation(p, 0, 'aPosition');
    gl.linkProgram(p);
    const u: Prog['u'] = {};
    const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS) as number;
    for (let i = 0; i < n; i++) {
      const name = gl.getActiveUniform(p, i)!.name;
      u[name] = gl.getUniformLocation(p, name);
    }
    return { p, u };
  };
  const P = Object.fromEntries(Object.entries(FS).map(([k, src]) => [k, prog(src)])) as Record<
    keyof typeof FS,
    Prog
  >;
  if (!gl.getProgramParameter(P.display.p, gl.LINK_STATUS)) {
    canvas.remove();
    return;
  }

  // Full-screen quad
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(0);

  // ---- framebuffers -------------------------------------------------------------------------------
  type FBO = {
    tex: WebGLTexture;
    fbo: WebGLFramebuffer;
    w: number;
    h: number;
    attach: (id: number) => number;
  };
  type Double = { read: FBO; write: FBO; swap: () => void; w: number; h: number; texel: [number, number] };
  const fbo = (w: number, h: number, internal: number, format: number): FBO => {
    const tex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, internal, w, h, 0, format, gl.HALF_FLOAT, null);
    const fb = gl.createFramebuffer()!;
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    gl.viewport(0, 0, w, h);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    return {
      tex,
      fbo: fb,
      w,
      h,
      attach(id) {
        gl.activeTexture(gl.TEXTURE0 + id);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        return id;
      },
    };
  };
  const double = (w: number, h: number, internal: number, format: number): Double => {
    let a = fbo(w, h, internal, format);
    let b = fbo(w, h, internal, format);
    return {
      get read() {
        return a;
      },
      get write() {
        return b;
      },
      swap() {
        [a, b] = [b, a];
      },
      w,
      h,
      texel: [1 / w, 1 / h],
    };
  };
  const res = (r: number) => {
    const aspect = gl.drawingBufferWidth / gl.drawingBufferHeight;
    const min = Math.round(r);
    const max = Math.round(r * (aspect < 1 ? 1 / aspect : aspect));
    return aspect > 1 ? { w: max, h: min } : { w: min, h: max };
  };

  let dye: Double, velocity: Double, pressure: Double, divergence: FBO, curl: FBO;
  function initBuffers() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    const s = res(SIM_RES);
    const d = res(DYE_RES);
    dye = double(d.w, d.h, gl.RGBA16F, gl.RGBA);
    velocity = double(s.w, s.h, gl.RG16F, gl.RG);
    pressure = double(s.w, s.h, gl.R16F, gl.RED);
    divergence = fbo(s.w, s.h, gl.R16F, gl.RED);
    curl = fbo(s.w, s.h, gl.R16F, gl.RED);
  }
  initBuffers();
  addEventListener('resize', initBuffers);

  const blit = (target: FBO | null) => {
    if (target) {
      gl.viewport(0, 0, target.w, target.h);
      gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
    } else {
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
  };
  const use = (prog: Prog, texel: [number, number] = velocity.texel) => {
    gl.useProgram(prog.p);
    gl.uniform2f(prog.u.texelSize ?? null, texel[0], texel[1]);
    return prog.u;
  };

  // ---- simulation ----------------------------------------------------------------------------------
  function splat(x: number, y: number, dx: number, dy: number, color: number[]) {
    const aspect = canvas.width / canvas.height;
    const u = use(P.splat);
    gl.uniform1i(u.uTarget!, velocity.read.attach(0));
    gl.uniform1f(u.aspectRatio!, aspect);
    gl.uniform2f(u.point!, x, y);
    gl.uniform3f(u.color!, dx, dy, 0);
    gl.uniform1f(u.radius!, (SPLAT_RADIUS / 100) * (aspect > 1 ? aspect : 1));
    blit(velocity.write);
    velocity.swap();
    gl.uniform1i(u.uTarget!, dye.read.attach(0));
    gl.uniform3f(u.color!, color[0]!, color[1]!, color[2]!);
    blit(dye.write);
    dye.swap();
  }

  function step(dt: number) {
    let u = use(P.curl);
    gl.uniform1i(u.uVelocity!, velocity.read.attach(0));
    blit(curl);

    u = use(P.vorticity);
    gl.uniform1i(u.uVelocity!, velocity.read.attach(0));
    gl.uniform1i(u.uCurl!, curl.attach(1));
    gl.uniform1f(u.curl!, CURL);
    gl.uniform1f(u.dt!, dt);
    blit(velocity.write);
    velocity.swap();

    u = use(P.divergence);
    gl.uniform1i(u.uVelocity!, velocity.read.attach(0));
    blit(divergence);

    u = use(P.clear);
    gl.uniform1i(u.uTexture!, pressure.read.attach(0));
    gl.uniform1f(u.value!, PRESSURE);
    blit(pressure.write);
    pressure.swap();

    u = use(P.pressure);
    gl.uniform1i(u.uDivergence!, divergence.attach(0));
    for (let i = 0; i < PRESSURE_ITERATIONS; i++) {
      gl.uniform1i(u.uPressure!, pressure.read.attach(1));
      blit(pressure.write);
      pressure.swap();
    }

    u = use(P.gradient);
    gl.uniform1i(u.uPressure!, pressure.read.attach(0));
    gl.uniform1i(u.uVelocity!, velocity.read.attach(1));
    blit(velocity.write);
    velocity.swap();

    u = use(P.advection);
    gl.uniform1i(u.uVelocity!, velocity.read.attach(0));
    gl.uniform1i(u.uSource!, velocity.read.attach(0));
    gl.uniform1f(u.dt!, dt);
    gl.uniform1f(u.dissipation!, VELOCITY_DISSIPATION);
    blit(velocity.write);
    velocity.swap();

    gl.uniform1i(u.uVelocity!, velocity.read.attach(0));
    gl.uniform1i(u.uSource!, dye.read.attach(1));
    gl.uniform1f(u.dissipation!, DENSITY_DISSIPATION);
    blit(dye.write);
    dye.swap();
  }

  function render() {
    const u = use(P.display, dye.texel);
    gl.uniform1i(u.uTexture!, dye.read.attach(0));
    blit(null);
  }

  // ---- pointer + loop ------------------------------------------------------------------------------
  const pointer = { x: 0, y: 0, px: 0, py: 0, moved: false, ready: false };
  let lastMove = 0;
  let running = false;
  let last = 0;

  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    const x = e.clientX / innerWidth;
    const y = 1 - e.clientY / innerHeight;
    if (!pointer.ready) {
      pointer.px = x;
      pointer.py = y;
      pointer.ready = true;
    }
    pointer.x = x;
    pointer.y = y;
    pointer.moved = true;
    lastMove = performance.now();
    if (!running) {
      running = true;
      last = lastMove;
      requestAnimationFrame(frame);
    }
  };

  function frame(now: number) {
    const dt = Math.min((now - last) / 1000, 0.016666);
    last = now;
    if (pointer.moved) {
      pointer.moved = false;
      const aspect = canvas.width / canvas.height;
      let dx = (pointer.x - pointer.px) * SPLAT_FORCE;
      let dy = (pointer.y - pointer.py) * SPLAT_FORCE;
      if (aspect < 1) dx *= aspect;
      if (aspect > 1) dy /= aspect;
      // Ink colour cycles through the brand palette over time
      splat(pointer.x, pointer.y, dx, dy, inkColor(now, INTENSITY));
      pointer.px = pointer.x;
      pointer.py = pointer.y;
    }
    step(dt);
    render();
    if (now - lastMove > IDLE_MS) {
      running = false;
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.clear(gl.COLOR_BUFFER_BIT);
      return;
    }
    requestAnimationFrame(frame);
  }

  // Click splash: a burst of ink with a random kick where the user clicks.
  const onDown = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    onMove(e);
    splat(
      e.clientX / innerWidth,
      1 - e.clientY / innerHeight,
      1000 * (Math.random() - 0.5),
      1000 * (Math.random() - 0.5),
      inkColor(performance.now(), INTENSITY * CLICK_SPLASH),
    );
  };

  addEventListener('pointermove', onMove, { passive: true });
  addEventListener('pointerdown', onDown, { passive: true });
  if (first) onMove(first);
}
