const express = require('express');
const procesadorConsultas = require('../../controladores/procesadorConsultas.controller');
const rutas = express.Router();


rutas.post('/obtenerHistorialCitas', async (req, res) => {
    console.log('🟢 Ruta /consultarcitas fue llamada');
    const idpaciente = req.body.datos;
    console.log('🟢 ID Paciente:', idpaciente); 
    const consulta = `
    

SELECT 
  idcitas,
  (SELECT p.nombre FROM paciente p WHERE p.idpaciente = c.idpaciente) AS nombrePaciente,
  CASE 
    WHEN c.idmedico IS NULL THEN 'Médico no asignado'
    ELSE (SELECT m.nombre FROM medico m WHERE m.idmedico = c.idmedico)
  END AS nombreMedico, 
  c.fecha,
  (SELECT e.nombre FROM estatus e WHERE e.idEstatus = c.estatus) AS estatus
FROM citas c where c.idpaciente= ${idpaciente};
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

rutas.post('/insertarCita', async (req, res) => {
    console.log('🟢 Ruta /insertarcita fue llamada');
    const datos = req.body.datos;
    console.log('🟢 Datos recibidos:', datos); 
    const fecha = new Date(datos.fecha);
    const fechaFormateada = fecha.toISOString().slice(0, 19).replace('T', ' ');

    const consulta = `
    INSERT INTO citas (idpaciente, fecha, estatus, motivo)
    VALUES ('${datos.idpaciente}', '${fechaFormateada}', 1, '${datos.motivo}');
`;

    try {
        await procesadorConsultas(consulta);
        return res.status(200).send({ mensaje: "Datos insertados correctamente" });
    } catch (error) {
        console.log('⚠️ Error:', error); 
        return res.status(500).send({ error: error.message || 'Hubo un problema con la base de datos' });
    }
});

module.exports = rutas;