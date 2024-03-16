import serverless from 'serverless-http';
import buildApp from './app';
import database from './fakeDatabase';
//import swagger from './swagger';

const app = buildApp(database);

//swagger(app)

/* eslint-disable-next-line import/prefer-default-export */
export const handler = serverless(app);
