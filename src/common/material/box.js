import THREE from '@/common/libs/Three'
import { Color, MatCap } from '@/common/utils/canvas'

export const vertexShader = `
  ${THREE.ShaderChunk['common']}
  ${THREE.ShaderChunk['shadowmap_pars_vertex']}

  varying vec2 vPoint;
  varying vec2 vUv;
  varying vec4 vPosition;

  uniform vec3 uLight;

  void main(){
    vec3 e = normalize(vec3(modelViewMatrix * vec4(position, 1.0)));
    vec3 n = normalize( normalMatrix * normal );
    vec3 r = reflect( e, n );
    float m = 2.0 * sqrt(pow( r.x, 2. ) + pow( r.y, 2. ) + pow( r.z + 1.0, 2.0));
    vPoint = r.xy / m + .5;
    vUv = uv;
    vPosition = modelMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewMatrix * vPosition;

    ${THREE.ShaderChunk['beginnormal_vertex']}
    ${THREE.ShaderChunk['defaultnormal_vertex']}
    ${THREE.ShaderChunk['begin_vertex']}
    ${THREE.ShaderChunk['project_vertex']}
    ${THREE.ShaderChunk['worldpos_vertex']}
    ${THREE.ShaderChunk['shadowmap_vertex']}
  }
`
export const fragmentShader = `
  varying vec4 vPosition;
  varying vec2 vPoint;
  varying vec2 vUv;

  uniform sampler2D u_texture;
  uniform sampler2D u_matCap;
  uniform float u_waterHeight;
  uniform float u_bubbleHeight;
  uniform float u_buildStatus;

  ${THREE.ShaderChunk['common']}
  ${THREE.ShaderChunk['packing']}
  ${THREE.ShaderChunk['lights_pars_begin']}
  ${THREE.ShaderChunk['shadowmap_pars_fragment']}
  ${THREE.ShaderChunk['shadowmask_pars_fragment']}

  void main(){
    vec4 matCapColor = texture2D(u_matCap, vPoint);
    vec4 color = texture2D(u_texture, vUv);
    float mask = getShadowMask();
    float colorShadow = 1.0;
    if (mask == 0.0) {
      colorShadow = 0.72;
    }
    matCapColor = smoothstep(0.0, 1.0, matCapColor);
    vec4 waterColor = vec4(0.34, 0.592, 0.968, 1.0);
    if (vPosition.y < u_bubbleHeight && vPosition.y > u_waterHeight) {
      color = vec4(1.0);
    } else if (vPosition.y < u_waterHeight) {
      color = color * waterColor;
    } else {
      color = color * colorShadow * matCapColor;
    }
    float opacity = 1.0;
    if (u_buildStatus == 0.0) {
      vec3 red = vec3(0.9, 0.0, 0.0);
      color.rgb = color.rgb * red;
      opacity = 0.68;
    }
    gl_FragColor = vec4(color.rgb, opacity);
  }
`

export const material = new THREE.ShaderMaterial({
  uniforms: {
    u_texture: { type: 't', value:  new THREE.TextureLoader().load(Color) },
    u_matCap: {type: 't', value: new THREE.TextureLoader().load(MatCap) },
    u_bubbleHeight: { type: 'f', value: -4},
    u_waterHeight: { type: 'f', value: -6},
    u_buildStatus: { type: 'f', value: 1.0},
  },
  vertexShader,
  fragmentShader,
  transparent: true,
})