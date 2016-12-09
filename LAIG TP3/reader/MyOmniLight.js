
function MyOmniLight(id, enabled, location, ambient, diffuse, specular) {
    this.id = id;
    this.enabled = enabled;
    
    this.location = location;
    this.ambient = ambient;
    this.diffuse = diffuse;
    this.specular = specular;
};

MyOmniLight.prototype.constructor = MyOmniLight;
