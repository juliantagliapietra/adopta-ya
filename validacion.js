function validateForm() {
    const nombrePersona = document.getElementById('nombrePersona').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const animal_de_interes = document.getElementById('animal_de_interes').value;

    if (!nombrePersona || !correo || !telefono || !animal_de_interes) {
        alert('Todos los campos son obligatorios.');
        return false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(correo)) {
        alert('Por favor, ingrese un correo electrónico válido.');
        return false;
    }

    return true;
}
