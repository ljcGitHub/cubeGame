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
  uniform sampler2D u_texture;
  varying vec2 vUv;

  void main(){
    float greyNum = 1.0;
    if (status == 0.0) {
      greyNum = 0.72;
    }
    gl_FragColor = texture2D(u_texture, vUv) * greyNum;
  }
`

export const material = new THREE.ShaderMaterial({
  uniforms: {
    status: { value: 1.0 },
    u_texture: { type: 't', value: null }
  },
  vertexShader,
  fragmentShader,
  transparent: true,
})