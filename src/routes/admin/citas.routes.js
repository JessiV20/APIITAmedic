const express = require('express');
const procesadorConsultas = require('../../controladores/procesadorConsultas.controller');
const rutas = express.Router();

rutas.get('/consultarMedicos', async (req, res) => {
    console.log('🟢 Ruta /consultarmedicos fue llamada');
    const consulta = `
    SELECT idmedico, nombre FROM medico
`;

    try {
        const resultado = await procesadorConsultas(consulta);
        return res.status(200).send({resultado: resultado[0] });
    } catch (error) {
        console.log('⚠️ Error:', error); 
        return res.status(500).send({ error: error.message || 'Hubo un problema con la base de datos' });
    }
}
);

rutas.get('/consultarCitasProgramadas', async (req, res) => {
    console.log('🟢 Ruta /consultarcitas fue llamada');

    const consulta = `
    SELECT 
  idcitas,
  (SELECT p.nombre FROM paciente p WHERE p.idpaciente = c.idpaciente) AS nombrePaciente,
  (SELECT m.nombre FROM medico m WHERE m.idmedico = c.idmedico) AS nombreMedico, c.idmedico,
  c.fecha,motivo,
  (SELECT e.nombre FROM estatus e WHERE e.idEstatus = c.estatus) AS estatus
FROM citas c
where c.estatus = '1'
`;

    try {
        const resultado = await procesadorConsultas(consulta);
        return res.status(200).send({resultado: resultado[0] });
    } catch (error) {
        console.log('⚠️ Error:', error); 
        return res.status(500).send({ error: error.message || 'Hubo un problema con la base de datos' });
    }
}
);

rutas.put('/guardarCambiosCitasProgramadas', async (req, res) => {
    console.log('🟢 Ruta /actualizarCita fue llamada');
    const datos = req.body.datos;
    console.log('🟢 Datos recibidos:', datos); 

    const consulta = `
    UPDATE citas
    SET idpaciente = '${datos.idpaciente}', fecha = '${fechaFormateada}', estatus = 1, motivo = '${datos.motivo}'
    WHERE idcitas = ${datos.idcitas};
`;

    try {
        await procesadorConsultas(consulta);
        return res.status(200).send({ mensaje: "Datos actualizados correctamente" });
    } catch (error) {
        console.log('⚠️ Error:', error); 
        return res.status(500).send({ error: error.message || 'Hubo un problema con la base de datos' });
    }
});




module.exports = rutas;
