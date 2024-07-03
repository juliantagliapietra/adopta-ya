const BASEURL = 'http://127.0.0.1:5000';

/**
 * Función para realizar una petición fetch con JSON.
 * @param {string} url - La URL a la que se realizará la petición.
 * @param {string} method - El método HTTP a usar (GET, POST, PUT, DELETE, etc.).
 * @param {Object} [data=null] - Los datos a enviar en el cuerpo de la petición.
 * @returns {Promise<Object>} - Una promesa que resuelve con la respuesta en formato JSON.
 */
async function enviarFormulario(event) {
    event.preventDefault(); // Evita el envío del formulario por defecto

    const adoptionId = document.getElementById('adoptionId').value;
    const formData = {
        nombrePersona: document.getElementById('nombrePersona').value.trim(),
        correo: document.getElementById('correo').value.trim(),
        telefono: document.getElementById('telefono').value.trim(),
        animal_de_interes: document.getElementById('animal_de_interes').value
    };

    let url = `${BASEURL}/api/adopciones/`;
    let method = 'POST';

    if (adoptionId) {
        url += adoptionId;
        method = 'PUT';
    }

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();
        console.log('Respuesta del servidor:', data);
        mostrarAdopciones(); // Llama a la función para mostrar las adopciones actualizadas
        document.getElementById('adoptionForm').reset(); // Reinicia el formulario después de enviar
        document.getElementById('adoptionId').value = '';
        document.getElementById('submitButton').textContent = 'Enviar';

        // SweetAlert: mostrar notificación de éxito
        Swal.fire({
            icon: 'success',
            title: adoptionId ? 'Adopción actualizada' : 'Adopción creada',
            text: `La adopción de ${formData.nombrePersona} ha sido ${adoptionId ? 'actualizada' : 'creada'} con éxito.`,
        });
    } catch (error) {
        console.error('Error al enviar los datos:', error);
        // Manejo de errores si es necesario
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al enviar los datos. Inténtalo de nuevo.',
        });
    }
}

async function mostrarAdopciones() {
    try {
        const response = await fetch(`${BASEURL}/api/adopciones/`);
        const data = await response.json();

        const adoptionList = document.getElementById('adoptionList');
        adoptionList.innerHTML = ''; // Limpiar contenido anterior si lo hubiera

        data.forEach(adoption => {
            const card = document.createElement('div');
            card.className = 'col-md-4 mb-3';

            card.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${adoption.nombrePersona}</h5>
                        <p class="card-text"><strong>Correo:</strong> ${adoption.correo}</p>
                        <p class="card-text"><strong>Teléfono:</strong> ${adoption.telefono}</p>
                        <p class="card-text"><strong>Animal de Interés:</strong> ${adoption.animal_de_interes}</p>
                        <button class="btn btn-warning btn-sm" onclick="cargarAdopcionParaEditar('${adoption.id_adopcion}')">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="eliminarAdopcion('${adoption.id_adopcion}')">Eliminar</button>
                    </div>
                </div>
            `;

            adoptionList.appendChild(card);
        });
    } catch (error) {
        console.error('Error al obtener las adopciones:', error);
        // Manejo de errores si es necesario
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al obtener las adopciones. Inténtalo de nuevo.',
        });
    }
}

async function cargarAdopcionParaEditar(adoptionId) {
    try {
        const response = await fetch(`${BASEURL}/api/adopciones/${adoptionId}`);
        const data = await response.json();

        document.getElementById('nombrePersona').value = data.nombrePersona;
        document.getElementById('correo').value = data.correo;
        document.getElementById('telefono').value = data.telefono;
        document.getElementById('animal_de_interes').value = data.animal_de_interes;
        document.getElementById('adoptionId').value = adoptionId;

        const submitButton = document.getElementById('submitButton');
        submitButton.textContent = 'Actualizar';
    } catch (error) {
        console.error('Error al cargar la adopción para edición:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al cargar la adopción para edición. Inténtalo de nuevo.',
        });
    }
}

async function eliminarAdopcion(adoptionId) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "No podrás revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminarlo!'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const response = await fetch(`${BASEURL}/api/adopciones/${adoptionId}`, {
                    method: 'DELETE',
                });

                const data = await response.json();
                console.log('Adopción eliminada:', data);
                mostrarAdopciones();

                // SweetAlert: mostrar notificación de éxito
                Swal.fire(
                    'Eliminado!',
                    'La adopción ha sido eliminada.',
                    'success'
                );
            } catch (error) {
                console.error('Error al eliminar la adopción:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un problema al eliminar la adopción. Inténtalo de nuevo.',
                });
            }
        }
    })
}

document.addEventListener('DOMContentLoaded', () => {
    mostrarAdopciones();
});

const adoptionForm = document.getElementById('adoptionForm');
adoptionForm.addEventListener('submit', enviarFormulario);