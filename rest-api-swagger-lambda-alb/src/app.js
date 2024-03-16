import express from 'express';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import OpenApiValidator from 'express-openapi-validator';
import compression from 'compression';

function buildApp(database) {
    const app = express();

    // Middleware to parse JSON requests
    app.use(express.json());

    // Use compression for server response
    app.use(compression({ level: 9 }))

    // Swagger registration
    const swaggerJsDocOptions = {
        definition: {
          openapi: '3.0.0',
          info: {
            title: 'Northwind',
            version: '1.0.0',
            description: 'A simple REST API for providing basic CRUD-access to the employees in a Northwind database.'
          }
        },
        apis: ['./*.js',]
      };
      const apiSpec = swaggerJsDoc(swaggerJsDocOptions);
      
    app.get('/swagger.json', (_req, res) => res.json(apiSpec));
    app.use('/swagger', swaggerUi.serve, swaggerUi.setup(null, { swaggerOptions: { url: '/swagger.json' } }));
      
    /*app.use(OpenApiValidator.middleware({
        apiSpec,
        validateRequests: true,
        validateResponses: true
    }));*/


    const idFromReq = (req) => req.params.id;

    // Get tasks
    app.get('/tasks', async (req, res) => {
        const tasks = await database.getTasks();
        res.json(tasks);
    });

    // Get a task by id
    app.get('/tasks/:id', async (req, res) => {
        const id = idFromReq(req);
        const task = await database.findTask(id);
        if (!task) {
            return res.status(404).send('Task not found.');
        }
        return res.json(task);
    });

    // Create a task
    app.post('/tasks', async (req, res) => {
        const { description, targetDate, isCompleted } = req.body;
        const task = {
            description,
            targetDate,
            isCompleted: isCompleted || false,
        };

        const createdTask = await database.createTask(task);

        return res.status(201).json(createdTask);
    });

    // Update a task
    app.put('/tasks/:id', async (req, res) => {
        const task = await database.findTask(idFromReq(req));
        if (!task) {
            return res.status(404).send('Task not found.');
        }
        task.description = req.body.description || task.description;
        task.targetDate = req.body.targetDate || task.targetDate;
        task.isCompleted = req.body.isCompleted || task.isCompleted;

        const updatedTask = await database.updateTask(task);

        return res.json(updatedTask);
    });

    // Delete a task
    app.delete('/tasks/:id', async (req, res) => {
        const task = await database.findTask(idFromReq(req));
        if (!task) {
            return res.status(404).send('Task not found.');
        }

        await database.deleteTask(task);

        return res.status(204).send();
    });

    app.use((err, _req, res, _next) => {
        console.error(err);
        res.status(err.status || 500).json({
          message: err.message,
          errors: err.errors
        });
      });
      
    return app;
}
export default buildApp;
