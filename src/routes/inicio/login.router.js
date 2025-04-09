const express = require('express');
const procesadorConsultas = require('../../controladores/procesadorConsultas.controller');
const rutas = express.Router();


//----------------------------------------------Consulta Datos-------------------------------------------
rutas.post('/login', async (req, res)  =>{
    const datos = req.body.datos;
    console.log(datos.tipo)
    if (datos.tipo==='paciente'){
        
        const consulta =  `
                    select * from paciente where correo= '${datos.correo}' && contraseña ='${datos.contrasena}' `;
                    try {
                        const resultado = await procesadorConsultas(consulta);
                        const pacientes = resultado[0]; 

                        if (pacientes.length >= 1) {
                            const paciente = pacientes[0];
                            return res.status(200).send({ success: true, mensaje: "Inicio de sesión exitoso", paciente:paciente });
                        } else {
                            return res.status(401).send({ success: false, mensaje: "Correo o contraseña incorrectos" });
                        }
            
                    } catch (error) {
                        console.log('⚠️ Error:', error); 
                        return res.status(500).send({ error: error.message || 'Hubo un problema con la base de datos' });
                    }
                }
        else if(datos.tipo==='medico'){
            const consulta =  `
            SELECT * FROM medico  where username= '${datos.correo}' && contraseña = '${datos.contrasena}'; `;
            try {
                const resultado = await procesadorConsultas(consulta);
                const medicos = resultado[0]; 

                if (medicos.length >= 1) {
                    const medico = medicos[0];
                    return res.status(200).send({ success: true, mensaje: "Inicio de sesión exitoso", medico:medico });
                } else {
                    return res.status(401).send({ success: false, mensaje: "Correo o contraseña incorrectos" });
                }
    
            } catch (error) {
                console.log('⚠️ Error:', error); 
                return res.status(500).send({ error: error.message || 'Hubo un problema con la base de datos' });
            }
        }
        else if(datos.tipo==='administrativo'){
            console.log('entra')
            const consulta =  `
            SELECT * FROM administrativo  where username= '${datos.correo}' && contraseña = '${datos.contrasena}'; `;
            try {
                const resultado = await procesadorConsultas(consulta);
                const administrativos = resultado[0]; 

                if (administrativos.length >= 1) {
                    const administrativo = administrativos[0];
                    return res.status(200).send({ success: true, mensaje: "Inicio de sesión exitoso", administrativo:administrativo });
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
        


})



module.exports = rutas;