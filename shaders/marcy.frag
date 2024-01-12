#version 300 es
precision mediump float;
// @include "colors-and-uniforms.include"
out vec4 fragColor;

vec2 rotateUV(vec2 uv,float angle,vec2 pivot){
  // Translate UV coordinates to pivot
  uv-=pivot;
  // Apply rotation
  float cosA=cos(angle);
  float sinA=sin(angle);
  vec2 rotatedUV=vec2(cosA*uv.x-sinA*uv.y,sinA*uv.x+cosA*uv.y);
  // Translate UV coordinates back
  return rotatedUV+pivot;
}
vec3 generateBeam(vec3 color1,vec3 color2,vec3 color3,vec2 uv,float time,float offset,float centroidEffect){
  // Transformations to UV coordinates
  float horizontalMovement=sin(time*.5)*.5;
  uv.x+=horizontalMovement;
  
  float rotationAngle=sin(time*.2)*.1;
  vec2 pivot=vec2(.5,.5);
  uv=rotateUV(uv,rotationAngle,pivot);
  
  // Twist effect
  float twistFrequency=3.+6.*centroidEffect;
  float twistAmplitude=.1;
  float yCoord=uv.y;
  float twist=sin(yCoord*twistFrequency+time+offset)*twistAmplitude;
  float twist2=sin(yCoord*twistFrequency+time+offset+3.1415)*twistAmplitude;
  uv.x+=(yCoord>0.?twist:twist2);
  
  // Beam properties
  float beamWidth=.05+(energyNormalized/100.);
  float edgeSoftness=abs(spectralSpreadZScore/3.)*.1;
  float beam=smoothstep(beamWidth,beamWidth-edgeSoftness,abs(uv.x));
  
  // Determine which color to use based on the y-coordinate
  vec3 color;
  if(yCoord<.1){// First 3/10ths
    color=color1;
  }else if(yCoord<.7){// Next 6/10ths
    color=color2;
  }else{// Final 1/10th
    color=color3;
  }
  
  return color*beam;
}

void main(){
  vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/resolution.y;
  uv.x*=resolution.x/resolution.y;
  uv.y=(uv.y+1.)*.5;
  
  // Get last frame color and mix it with the beam color
  // vec3 backgroundColor=mix(getLastFrameColor(uv).rgb,mixColor,mixFactor);
  // Marceline color variables
  vec3 marcyHairColor=vec3(.07451f,.043137f,.168627f);// Dark purple
  vec3 marcyBodyColor=vec3(.45098f,.458824f,.486275f);// Gray skin
  vec3 marcyLegsColor=vec3(.180392f,.109804f,.113725f);// Boots
  
  // Bubblegum color variables
  vec3 bubblegumHairColor=vec3(.988235f,.278431f,.756863f);// Pink hair
  vec3 bubblegumBodyColor=vec3(.992157f,.745098f,.996078f);// Light pink skin
  vec3 bubblegumLegsColor=vec3(.803922f,.286275f,.898039f);// Pink boots
  
  // Generate beams
  vec3 beam1=generateBeam(marcyHairColor,marcyBodyColor,marcyLegsColor,uv,time,0.,spectralCentroidZScore);
  vec3 beam2=generateBeam(bubblegumHairColor,bubblegumBodyColor,bubblegumLegsColor,uv,time,3.14,spectralCentroidZScore);
  // vec3 beam2=generateBeam(color2,uv,time,3.14,spectralCentroidZScore);
  // vec3 beam3=generateBeam(color3,uv,time,1.57,spectralCentroidZScore);
  
  // Blend the beams
  vec3 finalBeam=(beam1+beam2)/2.;
  
  fragColor=vec4(finalBeam,1.);
}
