/**
 * nexCommerce — Hero WebGL Liquid Displacement Shader
 * Benchmark Blueprint: NUSET.jp (#mvCanvas GLSL wave dissolve)
 * Powered by Curtains.js v8.1.6
 */

(function () {
  // Accessibility: skip WebGL shaders for reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  // Wait for Curtains library and DOM
  function init() {
    if (typeof Curtains === 'undefined') return;

    const container = document.getElementById('heroImgStack');
    if (!container) return;

    const layerA = document.getElementById('heroLayerA');
    const layerB = document.getElementById('heroLayerB');
    if (!layerA || !layerB) return;

    // GLSL Shaders
    const vs = `
      precision mediump float;
      attribute vec3 aVertexPosition;
      attribute vec2 aTextureCoord;
      uniform mat4 uMVMatrix;
      uniform mat4 uPMatrix;
      varying vec2 vTextureCoord;
      void main() {
        vTextureCoord = aTextureCoord;
        gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
      }
    `;

    const fs = `
      precision mediump float;
      varying vec2 vTextureCoord;
      uniform sampler2D uSampler0;
      uniform sampler2D uSampler1;
      uniform float u_time;
      uniform float u_mix;
      uniform float u_activeTexture; // 0 = texture0 is current, 1 = texture1 is current

      void main() {
        vec2 uv = vTextureCoord;

        // Wave distortion envelope: peaks during slide transition
        float envelope = sin(u_mix * 3.14159265);
        
        // Liquid distortion based on sinusoidal frequency
        float waveX = sin(uv.y * 9.0 + u_time * 1.8) * (0.008 + 0.032 * envelope);
        float waveY = cos(uv.x * 9.0 + u_time * 2.2) * (0.006 + 0.024 * envelope);

        vec2 distortedUV = clamp(uv + vec2(waveX, waveY), 0.0, 1.0);

        vec4 colA = texture2D(uSampler0, distortedUV);
        vec4 colB = texture2D(uSampler1, distortedUV);

        // Mix between textures according to u_mix transition progress
        gl_FragColor = mix(colA, colB, u_mix);
      }
    `;

    try {
      const CurtainsClass = typeof Curtains === 'function' ? Curtains : (window.Curtains && window.Curtains.Curtains ? window.Curtains.Curtains : window.Curtains);
      const PlaneClass = typeof Plane === 'function' ? Plane : (window.Curtains && window.Curtains.Plane ? window.Curtains.Plane : window.Plane);

      if (!CurtainsClass || !PlaneClass) {
        console.warn('nexCommerce: Curtains or Plane class unavailable, using CSS transition fallback');
        return;
      }

      const curtains = new CurtainsClass({
        container: 'heroImgStack',
        pixelRatio: Math.min(1.5, window.devicePixelRatio || 1),
        antialias: false,
      });

      curtains.onError(() => {
        // Graceful fallback to CSS crossfade if WebGL fails
        console.warn('nexCommerce: WebGL Curtains fallback active');
      });

      const params = {
        vertexShader: vs,
        fragmentShader: fs,
        uniforms: {
          time: {
            name: 'u_time',
            type: '1f',
            value: 0,
          },
          mix: {
            name: 'u_mix',
            type: '1f',
            value: 0,
          },
          activeTexture: {
            name: 'u_activeTexture',
            type: '1f',
            value: 0,
          },
        },
        texturesOptions: {
          premultiplyAlpha: true,
        },
      };

      const plane = new PlaneClass(curtains, container, params);

      if (!plane) {
        console.warn('nexCommerce: Curtains Plane could not be instantiated');
        return;
      }

      plane.onRender(() => {
        if (plane.uniforms && plane.uniforms.time) {
          plane.uniforms.time.value += 0.015;
        }
      });

      // Global transition trigger for home.js carousel
      window._nexHeroCurtainsTransition = function (nextSrc, onComplete) {
        if (!plane || !plane.uniforms || !plane.uniforms.mix) {
          if (onComplete) onComplete();
          return;
        }

        const isCurrentlyTex0 = plane.uniforms.activeTexture.value === 0;
        const targetTexIndex = isCurrentlyTex0 ? 1 : 0;
        const targetTexture = plane.textures && plane.textures[targetTexIndex];

        // Load new image onto target texture safely
        if (targetTexture && targetTexture.source) {
          targetTexture.source.src = nextSrc;
          if (typeof targetTexture.needUpdate === 'function') {
            targetTexture.needUpdate();
          }
        }

        const fromMix = isCurrentlyTex0 ? 0 : 1;
        const toMix = isCurrentlyTex0 ? 1 : 0;
        const animState = { mix: fromMix };

        if (typeof gsap !== 'undefined') {
          gsap.to(animState, {
            mix: toMix,
            duration: 0.85,
            ease: 'power2.inOut',
            onUpdate: () => {
              plane.uniforms.mix.value = animState.mix;
            },
            onComplete: () => {
              plane.uniforms.mix.value = toMix;
              plane.uniforms.activeTexture.value = targetTexIndex;
              if (onComplete) onComplete();
            },
          });
        } else {
          let startTime = null;
          const duration = 850;
          function step(ts) {
            if (!startTime) startTime = ts;
            const progress = Math.min((ts - startTime) / duration, 1);
            const eased = -(Math.cos(Math.PI * progress) - 1) / 2;
            plane.uniforms.mix.value = fromMix + (toMix - fromMix) * eased;
            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              plane.uniforms.mix.value = toMix;
              plane.uniforms.activeTexture.value = targetTexIndex;
              if (onComplete) onComplete();
            }
          }
          requestAnimationFrame(step);
        }
      };

      window._nexHeroPlane = plane;
    } catch (err) {
      console.warn('nexCommerce: Curtains initialization notice:', err);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
