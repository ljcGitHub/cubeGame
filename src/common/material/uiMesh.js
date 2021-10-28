import THREE from '@/common/libs/Three'
import { Color } from '@/common/utils/canvas'

export const vertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vLight;

  uniform vec3 uLight;
  uniform float utime;

  void main(){
    float x = mod(utime, 400.0) / 400.0;
    float y = smoothstep(0.0,0.5,x) - smoothstep(0.5, 1.0, x);
    vLight = normalize(uLight);
    vNormal = normalize(normal);
    vUv = uv;
    vec4 vPosition = modelMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewMatrix * vPosition;
  }
`
export const fragmentShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vLight;

  uniform sampler2D uTexture;

  void main(){
    vec4 color = texture2D(uTexture, vUv);
    float diffuse = max(0.1, dot(vLight, vNormal)) * 0.2 + 0.8;
    vec4 c = color * diffuse;
    gl_FragColor = vec4(c.rgb, 1.0);
  }
`

export const material = new THREE.ShaderMaterial({
  uniforms: {
    uTexture: { type: 't', value:  new THREE.TextureLoader().load(Color) },
    uLight: { type: 'v3', value: new THREE.Vector3(-100, 140, 100) },
    utime: { type: 'f', value: 0 }
  },
  vertexShader,
  fragmentShader,
  transparent: true,
})