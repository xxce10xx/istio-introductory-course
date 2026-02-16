import express from 'express' 
import colors from 'colors'
import router  from './router'
import {router as routerProm} from './router-prom'
import db from './config/db'
import './models'
import { logger } from './config/pino'
import { sdk } from './config/telemetry'

// Conectar a base de datos
async function connectDB() {
    try {
        await db.authenticate()
        await db.sync({ alter: true });
        console.log( colors.blue('Conexión exitosa a la BD'))
    } catch (error) {
        console.log( colors.red.bold('Hubo un error al conectar a la BD'))
    }
}
connectDB()

//Telemetry
sdk.start();

// Instancia de express
const server = express()

// Leer datos de formularios
server.use(express.json())

server.use(require('pino-http')({ logger }));

server.use('/api/doctors', router)
server.use('/prom', routerProm)
server.get("/", (req, res) => res.send("Service running"));

// LivenessProbe
server.get('/health/live', (req, res) => {res.status(200).send('OK');});

// ReadinessProbe
server.get('/health/ready', async (req, res) => {
  try {
    await db.query('SELECT 1');
    res.status(200).send('READY');
  } catch (err) {
    res.status(503).send('NOT READY');
  }
});



export default server
