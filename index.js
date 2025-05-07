const express = require('express');
const bodyParser = require('body-parser');


const cors = require('cors');




const rutasInicio = {
	registroPaciente: require('./src/routes/inicio/registroPaciente.router'),
	login: require('./src/routes/inicio/login.router'),
	admin: require('./src/routes/admin/admin.routes')
};
rutasPaciente = {
	paciente: require('./src/routes/paciente/paciente.routes')
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
app.use(api + 'admins/', rutasInicio.admin)
app.use(api + 'paciente/', rutasPaciente.paciente);

const PORT = 4300 || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});