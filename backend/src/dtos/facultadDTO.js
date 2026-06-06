class FacultadDTO {
    constructor({ idFacultad, nombre, decano, profesores, secretarias }) {
        this.idFacultad = idFacultad;
        this.nombre = nombre;
        this.decano = decano;
        if (profesores) {
            this.profesores = profesores.map(p => ({ idProfesor: p.idProfesor, nombre: p.nombre }));
        }
        if (secretarias) {
            this.secretarias = secretarias.map(s => ({ idSecretaria: s.idSecretaria, nombre: s.nombre }));
        }
    }
}

module.exports = FacultadDTO;