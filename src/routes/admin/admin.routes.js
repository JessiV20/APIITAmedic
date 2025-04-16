const express = require('express');
const procesadorConsultas = require('../../controladores/procesadorConsultas.controller');
const rutas = express.Router();

rutas.get('/admins', async (req, res) => {
    const consulta =  `SELECT a.id_administrativo, a.username, r.rol AS role
      FROM administrativo a
      JOIN rol r ON a.rol_idrol = r.idrol `;
    try {
            const resultado = await procesadorConsultas(consulta);
            res.json(resultado[0]);
    }catch (error) {
        console.log('⚠️ Error:', error); 
        return res.status(500).send({ error: error.message || 'Hubo un problema con la base de datos' });
    }
});

rutas.get('/roles', async (req, res) => {
    const consulta =  `SELECT idrol, rol FROM rol`;
    try {
            const resultado = await procesadorConsultas(consulta);
            res.json(resultado[0]);
    }catch (error) {
        console.log('⚠️ Error:', error); 
        return res.status(500).send({ error: error.message || 'Hubo un problema con la base de datos' });
    }
});

rutas.put('/admins/:id/role', async (req, res) => {
    const { role_id } = req.body;
    const { id } = req.params;
    const consulta =  `UPDATE administrativo SET rol_idrol = ${role_id} WHERE id_administrativo = ${id}`;
    try {
            const resultado = await procesadorConsultas(consulta);
            res.json({ message: 'Rol actualizado' });
    }catch (error) {
        console.log('⚠️ Error:', error); 
        return res.status(500).send({ error: error.message || 'Hubo un problema con la base de datos' });
    }
});

module.exports = rutas;
