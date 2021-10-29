import THREE from '@/common/libs/Three'

export const vertexShader = `
  varying vec2 vUv;
  varying vec4 v_position;

  uniform float u_time;
  #include <clipping_planes_pars_vertex>

  void main(){
    #include <begin_vertex>

    vUv = uv;

    float t = mod(u_time, 800.0) / 800.0;
    float scale = 1.0 - (smoothstep(0.0,0.5,t) - smoothstep(0.5, 1.0, t)) / 4.0;
    vec4 mvPosition = vec4( transformed, 1.0 );
    mvPosition = mat4(
      scale, 0.0, 0.0, 0.0,
      0.0, scale, 0.0, 0.0,
      0.0, 0.0, 1.0, 0.0,
      0.0, 0.0, 0.0, 1.0
    ) * mvPosition;
    #ifdef USE_INSTANCING
      mvPosition = instanceMatrix * mvPosition;
    #endif
      mvPosition = modelViewMatrix * mvPosition;
      gl_Position = projectionMatrix * mvPosition;
    #if 1 > 0 && ! defined( STANDARD ) && ! defined( PHONG ) && ! defined( MATCAP )
     	vViewPosition = - mvPosition.xyz;
    #endif
  }
`
export const fragmentShader = `
  varying vec2 vUv;

  uniform sampler2D u_texture;
  #include <clipping_planes_pars_fragment>

  void main(){
    #include <clipping_planes_fragment>

    gl_FragColor = texture2D(u_texture, vUv);
  }
`

export const material = new THREE.ShaderMaterial({
  uniforms: {
    u_texture: { type: 't', value:  null },
    u_time: { type: 'f', value: 0 }
  },
  vertexShader,
  fragmentShader,
  transparent: true,
  depthWrite: false,
  clipping: true,
})