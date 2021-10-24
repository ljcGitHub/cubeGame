import THREE from '@/common/libs/Three'
import { Color } from '@/common/utils/canvas'
import Game from '@/core/Game'

export const vertexShader = `
  ${THREE.ShaderChunk['common']}
  ${THREE.ShaderChunk['shadowmap_pars_vertex']}

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vLight;
  varying vec4 vPosition;

  uniform vec3 uLight;

  void main(){
    vLight = normalize(uLight);
    vNormal = normalize(normal);
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
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vLight;
  varying vec4 vPosition;

  uniform sampler2D uTexture;
  uniform float uWaterHeight;
  uniform float uBubbleHeight;

  ${THREE.ShaderChunk['common']}
  ${THREE.ShaderChunk['packing']}
  ${THREE.ShaderChunk['lights_pars_begin']}
  ${THREE.ShaderChunk['shadowmap_pars_fragment']}
  ${THREE.ShaderChunk['shadowmask_pars_fragment']}

  void main(){
    vec4 color = texture2D(uTexture, vUv);
    float diffuse = max(0.1, dot(vLight, vNormal)) * 0.2 + 0.8;
    vec4 fragColor = color * diffuse;
    float mask = getShadowMask();
    float colorShadow = 1.0;
    if (mask == 0.0) {
      colorShadow = 0.72;
    }
    vec4 waterColor = vec4(0.34, 0.592, 0.968, 1.0);
    if (vPosition.y < uBubbleHeight && vPosition.y > uWaterHeight) {
      fragColor = vec4(1.0);
    } else if (vPosition.y < uWaterHeight) {
      fragColor = fragColor * waterColor;
    } else {
      fragColor = fragColor * colorShadow * diffuse;
    }
    gl_FragColor = vec4(fragColor.rgb, 1.0);
  }
`

export const material = new THREE.ShaderMaterial({
  uniforms: {
    uTexture: { type: 't', value:  new THREE.TextureLoader().load(Color) },
    uLight: { type: 'v3', value: Game.light.position },
    uBubbleHeight: { type: 'f', value: -4},
    uWaterHeight: { type: 'f', value: -6},
  },
  vertexShader,
  fragmentShader,
  transparent: true,
})