<<<<<<< HEAD
const pool = require('../config/dbConfig');

module.exports = { // 두 개의 메소드 module화
	queryParam_None: async(...args) => { // (...args) expression은 arrow function 사
		const query = args[0];
		let result;

		try {
			var connection = await pool.getConnection(); // connection을 pool에서 하나 가져온다.
			result = await connection.query(query) || null; // query문의 결과 || null 값이 result에 들어간다.
		} catch (err) {
			connection.rollback(() => {});
			next(err);
		} finally {
			pool.releaseConnection(connection); // waterfall 에서는 connection.release()를 사용했지만, 이 경우 pool.releaseConnection(connection) 을 해준다.
			return result;
		}

	},
	queryParam_Arr: async(...args) => {
		const query = args[0];
		const value = args[1]; // array
		let result;

		try {
			var connection = await pool.getConnection(); // connection을 pool에서 하나 가져온다.
			result = await connection.query(query, value) || null; // 두 번째 parameter에 배열 => query문에 들어갈 runtime 시 결정될 value
		} catch (err) {
			connection.rollback(() => {});
			next(err);
		} finally {
			pool.releaseConnection(connection); // waterfall 에서는 connection.release()를 사용했지만, 이 경우 pool.releaseConnection(connection) 을 해준다.
			return result;
		}
	},
	queryParam_Parse: async(inputquery, inputvalue) => {
		const query = inputquery;
		const value = inputvalue;
		let result;
		try {
			var connection = await pool.getConnection();
			result = await connection.query(query, value) || null;
			console.log(result)
		} catch (err) {
			console.log(err);
			connection.rollback(() => {});
			next(err);
		} finally {
			pool.releaseConnection(connection);
			return result;
		}
	},
	Transaction: async(...args) => {
		let result = "Success";

		try {
			var connection = await pool.getConnection();
			await connection.beginTransaction();

			await args[0](connection, ...args);
			await connection.commit();
		} catch (err) {
			await connection.rollback();
			console.log("mysql error! err log =>" + err);
			result = undefined;
		} finally {
			pool.releaseConnection(connection);
			return result;
		}
	}
};
=======
const poolPromise = require('../config/dbConfig')
module.exports = {
    queryParam_None: async (query) => {
        let result = null;
        try {
            const pool = await poolPromise;
            const connection = await pool.getConnection();
            try {
                result = await connection.query(query) || null;
            } catch (queryError) {
                connection.rollback(() => {});
                console.log(queryError);
            }
            pool.releaseConnection(connection);
        } catch (connectionError) {
            console.log(connectionError);
        }
        return result;
    },
    queryParam_Arr: async (...args) => {
        return this.queryParam_Parse(args[0], args[1]);
    },
    queryParam_Parse: async (query, value) => {
        let result = null;
        try {
            const pool = await poolPromise;
            const connection = await pool.getConnection();
            try {
                result = await connection.query(query, value) || null;
            } catch (queryError) {
                connection.rollback(() => {});
                console.log(queryError);
            }
            pool.releaseConnection(connection);
        } catch (connectionError) {
            console.log(connectionError);
        }
        return result;
    },
    Transaction: async (...args) => {
        let result = true;
        try {
            const pool = await poolPromise;
            const connection = await pool.getConnection()
            try {
                await connection.beginTransaction();
                args.forEach(async (it) => await it(connection));
                await connection.commit();
            } catch (transactionError) {
                await connection.rollback();
                console.log(transactionError);
                result = false;
            }
            pool.releaseConnection(connection);
        } catch (connectionError) {
            console.log(connectionError);
            result = false;
        }
        return result;
    }
} 
>>>>>>> 5533aefd0cef8a62aea3a5b54bc3ac32c3ad4da1
