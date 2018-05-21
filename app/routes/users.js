/**
 * Note-HEMN
 *
 * Note app using the HEMN (Handlebars, Express, Mongo, Node) stack
 *
 * Author:  Anshul Kharbanda
 * Created: 5 - 12 - 2018
 */
import { Router } from 'express'
import { genSaltSync, hash, compare } from 'bcryptjs'
import { dbConnect, usersCollection } from '../db'
import { BCRYPT_SALT_ROUNDS } from '../consts'

// Generate salt
const SALT = genSaltSync(BCRYPT_SALT_ROUNDS)

// Create users router
var users = Router()

// Signup user page
users.get('/signup', (req, res) => {
    res.render('user-signup', {
        error: req.query.error,
        unmatch: req.query.unmatch
    })
})

users.post('/signup', async (req, res) => {
    // Mongo client
    var client;

    try {
        // Connect to mongo
        client = await dbConnect()

        // Check password and verify
        if (req.body.password === req.body.verify) {
            // Hash password
            let passhash = await hash(req.body.password, SALT)

            // Insert new user
            let result = await usersCollection(client)
                .insertOne({
                    name: req.body.name,
                    email: req.body.email,
                    passhash: passhash
                })

            // If it's good
            if (result.result.ok) {
                // Save created user
                req.session.user = result.ops[0]

                // Redirect back to home
                res.redirect('/')
            }
            else {
                res.redirect('/signup?error=true')
            }
        }
        else {
            res.redirect('/signup?unmatch=true')
        }
    } catch (error) {
        // Send error to client
        res.send(error.stack)
        if (client) client.close()
    }
})

// Login user page
users.get('/login', (req, res) => {
    res.render('user-login', {
        user: req.session.user,
        notfound: req.query.notfound
    })
})

// Post user login
users.post('/login', async (req, res) => {
    // Mongo client
    var client;

    try {
        // Connect to mongo
        client = await dbConnect()

        // Get user from client
        let user = await usersCollection(client)
            .find({ email: req.body.email })
            .limit(1)
            .next()

        // Check if password matches
        let pwdMatch = await compare(req.body.password, user.passhash)

        // If user exists and password matches
        if (user && pwdMatch) {
            // Store user in session if user exists
            req.session.user = user

            // Redirect back to home
            res.redirect('/')
        }
        else {
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

// User logout page
users.get('/logout', (req, res) => {
    res.render('user-logout', {
        user: req.session.user
    })
})

// User post logout
users.post('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/')
})

// Export users router
export default users
