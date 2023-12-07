import Locals from './locals.js';
import Log from '../middlewares/log.js';

// import webRouter from './../routes/Web.js';
import apiRouter from '../routes/api.js';
import { graphqlHTTP } from 'express-graphql';
import GraphQlSchema from '../routes/graphql.js';

export default new class Routes {
	// public mountWeb(_express: Application): Application {
	// 	Log.info('Routes :: Mounting Web Routes...');

	// 	return _express.use('/', webRouter);
	// }

	mountApi(_express){
		const apiPrefix = Locals.config().apiPrefix;
		Log.info('Routes :: Mounting API Routes...');
		_express.use(`/graphql`, graphqlHTTP({
			schema: GraphQlSchema.schema,
			rootValue: GraphQlSchema.root,
			graphiql:true
		}));
		return _express.use(`/${apiPrefix}`, apiRouter);
	}
}
