
function MySpotLight(id, enabled, angle, exponent, target, location, ambient, diffuse, specular) {
    this.id = id;
    this.enabled = enabled;
    this.angle = angle;
    this.exponent = exponent;

    this.target = target;
    this.location = location;

    this.ambient = ambient;
    this.diffuse = diffuse;
    this.specular = specular;

};

MySpotLight.prototype.constructor = MySpotLight;
