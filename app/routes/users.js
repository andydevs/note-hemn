/**
 * Note-HEMN
 *
 * Note app using the HEMN (Handlebars, Express, Mongo, Node) stack
 *
 * Author:  Anshul Kharbanda
 * Created: 5 - 12 - 2018
 */
import { Router } from 'express'
import { dbConnect, usersCollection } from '../db'

// Create users router
var users = Router()

users.get('/login', (req, res) => {
    res.render('user-login-form', {
        notfound: req.query.notfound
    })
})

users.post('/login', async (req, res) => {
    // Mongo client
    var client;

    try {
        // Connect to mongo
        client = await dbConnect()

        // Hash password
        let email = req.body.email
        let passhash = req.body.password

        // Get user from client
        let user = await usersCollection(client)
            .find({ email: email, passhash: passhash })
            .limit(1)
            .next()

        // If user exists
        if (user) {
            // Store user in session if user exists
            let session = user

            // Redirect back to home
            res.redirect('/')
        } else {
            // Redirect to not found page
            res.redirect('/user/login?notfound=true')
        }

        // Close client
        client.close()
    }
    catch (error) {
        // Send error and close client
        res.send(error.stack)
        if (client) client.close()
    }
})

// Export users router
export default users
