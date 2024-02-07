#pragma glslify: export(map)
float map(float val, float inMin, float inMax, float outMin, float outMax) {
    float normalized =  outMin + (outMax - outMin) * (val - inMin) / (inMax - inMin);
    return clamp(normalized, outMin, outMax);
}
