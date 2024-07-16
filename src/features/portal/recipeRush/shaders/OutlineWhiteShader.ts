const whitenShaderCode = `
#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D uMainSampler;
varying vec2 outTexCoord;
uniform vec2 uTextureSize;

void main() {
    vec4 color = texture2D(uMainSampler, outTexCoord);
    vec2 texelSize = 1.0 / uTextureSize; // Tamaño del texel

    // Obtener los colores de los vecinos
    vec4 colorLeft = texture2D(uMainSampler, outTexCoord - vec2(1.0 / 180.0, 0.0));
    vec4 colorRight = texture2D(uMainSampler, outTexCoord + vec2(1.0 / 180.0, 0.0));
    vec4 colorTop = texture2D(uMainSampler, outTexCoord - vec2(0.0, 1.0 / 36.0));
    vec4 colorBottom = texture2D(uMainSampler, outTexCoord + vec2(0.0, 1.0 / 36.0));

    // Determinar si el píxel está en el borde basado en los colores vecinos
    bool isEdge = (color.a == 0.0 && (colorLeft.a > 0.0 || colorRight.a > 0.0 || colorTop.a > 0.0 || colorBottom.a > 0.0));

    if (isEdge) {
        // Pintar el borde de blanco
        color.rgb = vec3(1.0);
    }

    gl_FragColor = color;
}
`;

export class OutlineWhitePipeline extends Phaser.Renderer.WebGL.Pipelines
  .SinglePipeline {
  constructor(game: Phaser.Game) {
    super({
      game,
      fragShader: whitenShaderCode,
    });
  }
}
