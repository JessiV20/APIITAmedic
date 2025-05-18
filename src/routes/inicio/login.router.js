const express = require('express');
const procesadorConsultas = require('../../controladores/procesadorConsultas.controller');
const rutas = express.Router();

//----------------------------------------------Login-------------------------------------------
rutas.post('/login', async (req, res) => {
    const datos = req.body.datos;
    console.log(datos.tipo)
    if (datos.tipo === 'paciente') {
        const consulta = `SELECT * FROM paciente WHERE correo= '${datos.correo}' && contraseña ='${datos.contrasena}'`;
        try {
            const resultado = await procesadorConsultas(consulta);
            const pacientes = resultado[0];

            if (pacientes.length >= 1) {
                const paciente = pacientes[0];
                return res.status(200).send({ success: true, mensaje: "Inicio de sesión exitoso", paciente: paciente });
            } else {
                return res.status(401).send({ success: false, mensaje: "Correo o contraseña incorrectos" });
            }

        } catch (error) {
            console.log('⚠️ Error:', error);
            return res.status(500).send({ error: error.message || 'Hubo un problema con la base de datos' });
        }
    }
    else if (datos.tipo === 'medico') {
        const consulta = `SELECT * FROM medico WHERE username= '${datos.correo}' && contraseña = '${datos.contrasena}';`;
        try {
            const resultado = await procesadorConsultas(consulta);
            const medicos = resultado[0];

            if (medicos.length >= 1) {
                const medico = medicos[0];
                return res.status(200).send({ success: true, mensaje: "Inicio de sesión exitoso", medico: medico });
            } else {
                return res.status(401).send({ success: false, mensaje: "Correo o contraseña incorrectos" });
            }

        } catch (error) {
            console.log('⚠️ Error:', error);
            return res.status(500).send({ error: error.message || 'Hubo un problema con la base de datos' });
        }
    }
    else if (datos.tipo === 'administrativo') {
        console.log('entra')
        const consulta = `SELECT * FROM administrativo WHERE username= '${datos.correo}' && contraseña = '${datos.contrasena}';`;
        try {
            const resultado = await procesadorConsultas(consulta);
            const administrativos = resultado[0];

            if (administrativos.length >= 1) {
                const administrativo = administrativos[0];
                return res.status(200).send({ success: true, mensaje: "Inicio de sesión exitoso", administrativo: administrativo });
            } else {
                return res.status(401).send({ success: false, mensaje: "Correo o contraseña incorrectos" });
            }

        } catch (error) {
            console.log('⚠️ Error:', error);
            return res.status(500).send({ error: error.message || 'Hubo un problema con la base de datos' });
        }
    } else {
        return res.status(400).send({ mensaje: "Tipo de usuario no soportado" });
    }
});

//----------------------------------------------Gestión de Citas-------------------------------------------
rutas.get('/citas/medico/:idmedico', async (req, res) => {
    const idmedico = req.params.idmedico;
    
    try {
        const consulta = `
            SELECT 
                c.idcita, 
                CONCAT(p.nombre, ' ', p.apellido) AS paciente_nombre,
                c.fecha, 
                c.hora, 
                c.estado
            FROM cita c
            JOIN paciente p ON c.idpaciente = p.idpaciente
            WHERE c.idmedico = ${idmedico}
            ORDER BY c.fecha, c.hora
        `;
        
        const resultado = await procesadorConsultas(consulta);
        const citas = resultado[0];
        
        return res.status(200).send(citas);
    } catch (error) {
        console.log('⚠️ Error:', error);
        return res.status(500).send({ error: error.message || 'Error al obtener las citas' });
    }
});

rutas.put('/citas/:idcita/estado', async (req, res) => {
    const idcita = req.params.idcita;
    const { estado } = req.body;
    
    if (!estado) {
        return res.status(400).send({ mensaje: "El estado es requerido" });
    }
    
    try {
        const consulta = `
            UPDATE cita 
            SET estado = '${estado}'
            WHERE idcita = ${idcita}
        `;
        
        await procesadorConsultas(consulta);
        return res.status(200).send({ success: true, mensaje: "Estado de la cita actualizado" });
    } catch (error) {
        console.log('⚠️ Error:', error);
        return res.status(500).send({ error: error.message || 'Error al actualizar el estado de la cita' });
    }
});

module.exports = rutas;