import express, { Express } from 'express';
import * as YAML from 'yamljs';
import swaggerUi from 'swagger-ui-express';
import logger from 'winston';

// Load Swagger YAML file
const swaggerDoc = YAML.load('./validator/swagger.yaml');

function swaggerDocs(app: Express, port: number) {
    app.use(express.json());
    
    // Serve Swagger UI
    app.use('/api-docs', swaggerUi.serve);
    app.get('/api-docs', swaggerUi.setup(swaggerDoc));

    logger.info(`Swagger docs available at http://localhost:${port}/api-docs`);
}

export default swaggerDocs;




// import {Express, Request, Response} from 'express'
// import swaggerJsdoc from 'swagger-jsdoc'
// import swaggerUi from 'swagger-ui-express'
// import {version} from '../../package.json'
// import logger from 'winston'

// const options: swaggerJsdoc.Options = {
//     definition:{
//         openapi: '3.0.0',
//         info:{
//             title: 'Welcome to REST API DOCS with',
//             version,
//             description:"This is documentation on REST API for Ruth's portfolio with Typescript,node,express,mongoDb and documented by using swagger-jsdoc and swagger-ui-express",
//             contact:{
//                 name: 'Ruth',
//                 url:'https://github.com/Ruthuwamahoro/backend-side',
//                 email: 'ruthuwamahoro250@gmail.com'
//             },
            
//         },
//         servers:[
//             {
//                 url: 'http://localhost:8080',
//                 description : 'Local server'
//             }
//         ],
//         components:{
//             securitySchemes:{
//                 bearerAuth:{
//                     type: 'http',
//                     scheme: 'bearer',
//                     bearerFormat: 'JWT'
//                 }
//             }
//         },
//         security: [{
//             bearerAuth: []
//         }]
//     },
//     apis:['./routes/*.ts', './model/*.ts' ]
// }

// const swaggerSpec = swaggerJsdoc(options)
// function swaggerDocs(app:Express, port: number){
// //swagger page
// app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
// app.get('docs.json', (req:Request,res:Response) =>{
//     res.setHeader('Content-Type', 'application/json')
//     res.send(swaggerSpec)
// })
// logger.info(`Swagger docs available at http://localhost:${port}/docs`)
// }
// export default swaggerDocs