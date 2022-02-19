const { getToken, encryptPassword, comparePassword } = require("../util")
const db = require('../db');

const {
    AuthenticationError,
} = require('apollo-server');

const userResolvers = {
    Query: {
        me: (parent, args, context, info) => {
            // console.log(context.user)
            if (context.loggedIn) {
                return context.user
            } else {
                throw new AuthenticationError("Please Login Again!")
            }
        },
        container: async (parent, args, context, info) => {
            // console.log(context.user)
            if (context.loggedIn && args) {
                const container = await db.getCollection('container').findOne({ container_id: args.container_id });
                return container;
            } else {
                throw new AuthenticationError("Please Login Again!")
            }
        }
    },
    Mutation: {
        register: async (parent, args, context, info) => {
            const newUser = { username: args.username, password: await encryptPassword(args.password) }
            // Check conditions
            const user = await db.getCollection('user').findOne({ username: args.username })
            if (user) {
                throw new AuthenticationError("User Already Exists!")
            }
            try {
                const regUser = (await db.getCollection('user').insertOne(newUser)).ops[0]
                const token = getToken(regUser);
                return { ...regUser, token }
            } catch (e) {
                throw e
            }
        },
        login: async (parent, args, context, info) => {
            const user = await db.getCollection('user').findOne({ username: args.username })
            const isMatch = await comparePassword(args.password, user.password)
            if (isMatch) {
                const token = getToken(user)
                return { ...user, token };
            } else {
                throw new AuthenticationError("Wrong Password!")
            }
        },
        addContainer: async (parent, args, context, info) => {
            const newContainer = {
                container_id: args.container_id,
                container_size: args.container_size,
                container_type: args.container_type,
                container_damage_level: args.container_damage_level,
                container_date_start: args.container_date_start,
                container_date_end: args.container_date_end,
                container_fixed_status: args.container_fixed_status
            }

            //Check authentikate
            if(!context.loggedIn) throw new AuthenticationError("Please Login Again!");

            //Check conditions
            const container = await db.getCollection('container').findOne({ container_id: args.container_id });
            if (container) {
                throw new AuthenticationError('Container id is already exists');
            }
            try {
                const regContainer = (await db.getCollection('container').insertOne(newContainer)).ops[0]
                return { ...regContainer };
            }
            catch (e) {
                throw e;
            }
        },
    }
};

module.exports = {
    userResolvers,
}