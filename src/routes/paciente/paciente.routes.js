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
  c.fecha,motivo,
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
    const fechaFormateada = fecha.toISOString().slice(0, 10);
    const consulta1 = ` select idmedico from citas where fecha = '${fechaFormateada}' `;
    const resultado = await procesadorConsultas(consulta1);
    const idmedico = resultado[0];
    const idsmedicos = idmedico.map((medico) => medico.idmedico);
    console.log('🟢 Resultado de la consulta:', idsmedicos);
    const idsUnicos = [];
    const frecuencias = [];

    idsmedicos.forEach(id => {
        if (id !== null) {
          const index = idsUnicos.indexOf(id);
          if (index === -1) {
            idsUnicos.push(id);
            frecuencias.push(1);
          } else {
            frecuencias[index]++;
          }
        }
      });


      let idElegido = null;

idsUnicos.forEach((id, i) => {
  if (frecuencias[i] < 8) {
    if (idElegido === null || id < idElegido) {
      idElegido = id;
    }
  }
});
if(idsmedicos.length === 0){
    idElegido = 1;
  }

    if (idElegido === null) {
        console.log('No hay médicos disponibles para la fecha seleccionada.');
        return res.status(405).send({ error: 'No hay médicos disponibles para la fecha seleccionada.' });
    }
  

console.log('Medico elegido',idElegido);

    const consulta = `
    INSERT INTO citas (idpaciente,idmedico, fecha, estatus, motivo)
    VALUES ('${datos.idpaciente}', '${idElegido}','${fechaFormateada}', 2, '${datos.motivo}');
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