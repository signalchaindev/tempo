import populateDb from "../../src/base/mutation/populateDb.js";
import resetDb from "../../src/base/mutation/resetDb.js";
import testConnection from "../../src/base/query/testConnection.js";
import getAllProducts from "../../src/products/query/getAllProducts.js";
import createTodo from "../../src/todos/mutation/createTodo.js";
import getAllTodos from "../../src/todos/query/getAllTodos.js";
import createUser from "../../src/user/mutation/createUser.js";
import deleteUser from "../../src/user/mutation/deleteUser.js";
import getAllUsers from "../../src/user/query/getAllUsers.js";
import getSingleUser from "../../src/user/query/getSingleUser.js";

export const resolvers = {
	Mutation: {
		populateDb,
		resetDb,
		createTodo,
		createUser,
		deleteUser,
	},
	Query: {
		testConnection,
		getAllProducts,
		getAllTodos,
		getAllUsers,
		getSingleUser,
	},
}
