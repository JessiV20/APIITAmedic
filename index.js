const express = require('express');
const bodyParser = require('body-parser');


const cors = require('cors');
const mysql = require('mysql2/promise');
const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'itamedic',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});


const rutasInicio = {
	registroPaciente: require('./src/routes/inicio/registroPaciente.router'),
	login: require('./src/routes/inicio/login.router'),
};
rutasPaciente = {
	paciente: require('./src/routes/paciente/paciente.routes')
};
rutasAdmin = {
	admin: require('./src/routes/admin/admin.routes'),
	citas: require('./src/routes/admin/citas.routes')
};

const app = express();

app.set('trust proxy', true);

app.use(bodyParser.json({limit: '200mb'}));
app.use(bodyParser.urlencoded({ limit: '200mb', extended: true }));


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin'
    + ', X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method,token');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
	res.setHeader('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
	next();
});
app.use(cors());

const api = '/api/'




app.use(api + 'inicio/', rutasInicio.registroPaciente);
app.use(api + 'inicio/', rutasInicio.login);
app.use(api + 'admins/', rutasAdmin.admin)
app.use(api + 'admins/', rutasAdmin.citas);
app.use(api + 'paciente/', rutasPaciente.paciente);
// Rutas de citas
app.get('/api/citas/medico/:idmedico', async (req, res) => {
  try {
    console.log('ID Médico recibido:', req.params.idmedico);
    
    const [results] = await pool.query(`
      SELECT 
        c.idcitas,
        c.fecha,
        c.estatus,
        c.motivo,
        p.nombre AS paciente_nombre,
        p.edad AS paciente_edad,
        p.sexo AS paciente_sexo,
        p.peso AS paciente_peso,
        p.altura AS paciente_altura,
        m.nombre AS medico_nombre,
        m.telefono AS medico_telefono,
        m.sexo AS medico_sexo,
        m.edad AS medico_edad,
        m.disponibilidad AS medico_disponibilidad
      FROM 
        citas c
      JOIN 
        paciente p ON c.idpaciente = p.idpaciente
      JOIN 
        medico m ON c.idmedico = m.idmedico
      WHERE 
        c.idmedico = ?;
    `, [req.params.idmedico]);
    
    console.log('Resultados de la consulta:', results);
    res.json(results);
  } catch (error) {
    console.error('Error en /api/citas/medico/:idmedico:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener citas del médico',
      error: error.message,
      sqlMessage: error.sqlMessage
    });
  }
});

// Ruta para actualizar estado de cita (versión corregida)
app.put('/api/citas/:idcita/estado', async (req, res) => {
  try {
    const { estado } = req.body;
    const { idcita } = req.params;

    console.log('Datos recibidos:', { idcita, estado }); // Log de depuración

    // Validación de datos
    if (!idcita || isNaN(idcita)) {
      console.error('ID de cita inválido');
      return res.status(400).json({ success: false, message: 'ID de cita no válido' });
    }

    if (![2, 3, 1].includes(estado)) {
      console.error('Estado no válido:', estado);
      return res.status(400).json({ success: false, message: 'Estado no válido' });
    }

    // Debug: Verificar conexión a BD
    const connection = await pool.getConnection();
    console.log('Conexión a BD establecida');

    // Ejecutar consulta
    const [result] = await pool.query(
      'UPDATE citas SET estatus = ? WHERE idcitas = ?',
      [estado, idcita]
    );

    console.log('Resultado de la consulta:', result); // Debug

    // Verificar filas afectadas
    if (result.affectedRows === 0) {
      console.error('No se actualizó ninguna fila');
      return res.status(404).json({ success: false, message: 'Cita no encontrada' });
    }

    // Confirmar cambios
    await connection.commit();
    connection.release();

    console.log('Actualización exitosa'); // Debug
    res.json({ success: true, message: 'Estado actualizado', idcita, estado });

  } catch (error) {
    console.error('Error en la transacción:', error);
    if (connection) {
      await connection.rollback();
      connection.release();
    }
    res.status(500).json({ success: false, message: 'Error del servidor', error: error.message });
  }
});

// Ruta para actualizar datos del paciente y motivo de consulta
app.put('/api/citas/actualizar-datos-paciente', async (req, res) => {
  let connection;
  try {
    const { idcitas, paciente_nombre, paciente_edad, paciente_sexo, paciente_peso, paciente_altura, motivo } = req.body;

    // Validar el campo sexo
    const sexosPermitidos = ['Masculino', 'Femenino', 'Otro'];
    if (!sexosPermitidos.includes(paciente_sexo)) {
      return res.status(400).json({
        success: false,
        message: 'Sexo no válido. Valores permitidos: Masculino, Femenino, Otro'
      });
    }

    // Resto de tu lógica...
    connection = await pool.getConnection();
    
    // Actualizar paciente
    await connection.query(
      `UPDATE paciente SET 
        nombre = ?,
        edad = ?,
        sexo = ?,
        peso = ?,
        altura = ?
      WHERE idpaciente = (SELECT idpaciente FROM citas WHERE idcitas = ?)`,
      [paciente_nombre, paciente_edad, paciente_sexo, paciente_peso, paciente_altura, idcitas]
    );

    // Actualizar motivo en cita
    await connection.query(
      'UPDATE citas SET motivo = ? WHERE idcitas = ?',
      [motivo, idcitas]
    );

    await connection.commit();
    res.json({ success: true, message: 'Datos actualizados' });

  } catch (error) {
    console.error('Error:', error);
    if (connection) await connection.rollback();
    res.status(500).json({
      success: false,
      message: error.sqlMessage || 'Error al actualizar datos'
    });
  } finally {
    if (connection) connection.release();
  }
});

const PORT = 4300 || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
// Manejo de errores no capturados
process.on('unhandledRejection', (err) => {
  console.error('Error no capturado:', err);
});