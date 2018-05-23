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
import {
    setSessionAndRedirect,
    validUserSignup,
    signupUser,
    loginUser
} from '../models/user'

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

// Post signup
users.post('/signup', async (req, res) => {
    // Mongo client
    var client;

    try {
        // Connect to mongo
        client = await dbConnect()

        // Sign up user
        let result = await signupUser(client, req.body)

        // If user exist, set session and redirect
        // Else redirect back to page with flags
        if (result.user) setSessionAndRedirect(req, res, result.user)
        else res.redirect(`/signup?error=${result.error}&unmatch=${result.unmatch}`)
    }
    catch (error) {
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

        // Log in user from client and check if password matches
        let user = await loginUser(client, req.body)

        // If valid user, set user in session, else redirect to error
        if (user) setSessionAndRedirect(req, res, user)
        else res.redirect('/user/login?notfound=true')

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
