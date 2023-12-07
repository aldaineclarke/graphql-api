import { buildSchema } from "graphql";

export default new class GraphQlSchema{
    schema;
    root;

    constructor(){
        this.schema = buildSchema(`
            type Query {
                hello: String
            }
        `);

        this.root = {
            hello: ()=>{
                return "Hello World!"
            }
        }
    }
}