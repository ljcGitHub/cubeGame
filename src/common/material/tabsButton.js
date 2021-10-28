import THREE from '@/common/libs/Three'

export const vertexShader = `
  varying vec2 vUv;
  void main(){
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  }
`
export const fragmentShader = `
uniform float status;
uniform float select;
uniform sampler2D u_texture;
  varying vec2 vUv;

  void main(){
    vec4 color = texture2D(u_texture, vUv);
    if (status == 0.0) {
      color.rgb = color.rgb * 0.48;
    } else if (select == 0.0) {
      color.rgb = color.rgb * 0.68;
    }
    gl_FragColor = color;
  }
`

export const material = new THREE.ShaderMaterial({
  uniforms: {
    status: { value: 1.0 },
    select: { value: 0.0 },
    u_texture: { type: 't', value: null }
  },
  vertexShader,
  fragmentShader,
  transparent: true,
})