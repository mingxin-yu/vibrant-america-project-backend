const express = require("express");
const app = express();
const PORT = 6969;
const stateData = require("./MOCK_DATA.json");
const graphql = require('graphql');
const { GraphQLObjectType, GraphQLSchema, GraphQLInt, GraphQLString, GraphQLList } = graphql;
const { graphqlHTTP } = require("express-graphql");

const StateType = new GraphQLObjectType({
    name: "State",
    fields: () => ({
        id: {type: GraphQLInt},
        stateName: {type: GraphQLString}
    })
})

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        getAllStates: {
            type: new GraphQLList(StateType),
            args: { key: { type: GraphQLString } },
            resolve(parent, args) {
                let result = [];
                for (let i = 0; i < stateData.length; i ++) {
                    const stateNameLower = stateData[i].stateName.toLowerCase();
                    if (stateNameLower.startsWith(args.key.toLowerCase())) {
                        result.push(stateData[i]);
                    }
                    if (result.length >= 10) {
                        break;
                    }
                }
                return result;
            },
        },
    },
});

const schema = new GraphQLSchema({query: RootQuery, mutation: null})

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}))

app.listen(PORT, () => {
    console.log("Server running");
})