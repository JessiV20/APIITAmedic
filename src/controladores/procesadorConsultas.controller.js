const sql = require('../configuraciones/bd.js');

module.exports = procesarConsulta = (consulta) => {
    return sql.query(consulta);
}