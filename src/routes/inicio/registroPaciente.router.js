const express = require('express');
const procesadorConsultas = require('../../controladores/procesadorConsultas.controller');
const rutas = express.Router();

//----------------------------------------------Consulta Datos-------------------------------------------


//----------------------------------------------Insertar Datos-------------------------------------------


rutas.post('/registroPaciente', async (req, res) => {
    console.log('🟢 Ruta /registroPaciente fue llamada');
    const datos = req.body.datos;
    const consulta = `
    INSERT INTO paciente (nombre, sexo, peso, correo, contraseña, edad, altura, alergias, tipo_sangre, enfermedad, direccion)
    VALUES ('${datos.nombre}', '${datos.sexo}', ${datos.peso}, '${datos.correo}', '${datos.contrasena}', ${datos.edad}, ${datos.altura}, '${datos.alergias}', '${datos.tipo_sangre}', '${datos.enfermedad}', '${datos.direccion}');
`;

    try {
        await procesadorConsultas(consulta);
        return res.status(200).send({ mensaje: "Datos insertados correctamente" });
    } catch (error) {
        console.log('⚠️ Error:', error); 
        return res.status(500).send({ error: error.message || 'Hubo un problema con la base de datos' });
    }
});


//----------------------------------------------Actualizar Datos-------------------------------------------

//----------------------------------------------Eliminar Datos-------------------------------------------
module.exports = rutas;
