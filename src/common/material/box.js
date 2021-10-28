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

  uniform sampler2D uTexture;
  uniform sampler2D uMatCap;
  uniform float uWaterHeight;
  uniform float uBubbleHeight;
  uniform float uBuildStatus;

  ${THREE.ShaderChunk['common']}
  ${THREE.ShaderChunk['packing']}
  ${THREE.ShaderChunk['lights_pars_begin']}
  ${THREE.ShaderChunk['shadowmap_pars_fragment']}
  ${THREE.ShaderChunk['shadowmask_pars_fragment']}

  void main(){
    vec4 matCapColor = texture2D(uMatCap, vPoint);
    vec4 color = texture2D(uTexture, vUv);
    float mask = getShadowMask();
    float colorShadow = 1.0;
    if (mask == 0.0) {
      colorShadow = 0.72;
    }
    matCapColor = smoothstep(0.0, 1.0, matCapColor);
    vec4 waterColor = vec4(0.34, 0.592, 0.968, 1.0);
    if (vPosition.y < uBubbleHeight && vPosition.y > uWaterHeight) {
      color = vec4(1.0);
    } else if (vPosition.y < uWaterHeight) {
      color = color * waterColor;
    } else {
      color = color * colorShadow * matCapColor;
    }
    float opacity = 1.0;
    if (uBuildStatus == 0.0) {
      vec3 red = vec3(0.9, 0.0, 0.0);
      color.rgb = color.rgb * red;
      opacity = 0.68;
    }
    gl_FragColor = vec4(color.rgb, opacity);
  }
`

export const material = new THREE.ShaderMaterial({
  uniforms: {
    uTexture: { type: 't', value:  new THREE.TextureLoader().load(Color) },
    uMatCap: {type: 't', value: new THREE.TextureLoader().load(MatCap) },
    uBubbleHeight: { type: 'f', value: -4},
    uWaterHeight: { type: 'f', value: -6},
    uBuildStatus: { type: 'f', value: 1.0},
  },
  vertexShader,
  fragmentShader,
  transparent: true,
})