import THREE from '@/common/libs/Three'
import { Color } from '@/common/utils/canvas'

export const vertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vLight;

  uniform vec3 u_light;

  #include <clipping_planes_pars_vertex>

  void main(){
    #include <begin_vertex>

    vLight = normalize(u_light);
    vNormal = normalize(normal);
    vUv = uv;
    vec4 vPosition = modelMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewMatrix * vPosition;

    #include <project_vertex>
    #include <clipping_planes_vertex>
  }
`
export const fragmentShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vLight;

  uniform sampler2D u_texture;
  #include <clipping_planes_pars_fragment>

  void main(){
    #include <clipping_planes_fragment>

    vec4 color = texture2D(u_texture, vUv);
    float diffuse = max(0.1, dot(vLight, vNormal)) * 0.2 + 0.8;
    vec4 c = color * diffuse;
    gl_FragColor = vec4(c.rgb, 1.0);
  }
`

export const material = new THREE.ShaderMaterial({
  uniforms: {
    u_texture: { type: 't', value:  new THREE.TextureLoader().load(Color) },
    u_light: { type: 'v3', value: new THREE.Vector3(-100, 140, 100) },
    utime: { type: 'f', value: 0 }
  },
  vertexShader,
  fragmentShader,
  transparent: true,
  clipping: true,
})