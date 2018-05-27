/**
 * Note-HEMN
 *
 * Note app using the HEMN (Handlebars, Express, Mongo, Node) stack
 *
 * Author:  Anshul Kharbanda
 * Created: 5 - 12 - 2018
 */
import { Router } from 'express'
import { dbConnect, using } from '../db'
import { authenticate } from '../authenticate'
import {
    setSessionAndRedirect,
    signupUser,
    loginUser
} from '../models/user'

// Create users router
var users = Router()

// Signup user page
users.get('/signup', (req, res) => {
    res.render('user-signup', {
        error: req.query.error === "true",
        unmatch: req.query.unmatch === "true",
        exists: req.query.exists === "true"
    })
})

// Post signup
users.post('/signup', async (req, res) => {
    // Within mongoclient context
    await using(dbConnect, async client => {
        // Sign up user
        let result = await signupUser(client, req.body)

        // If user exist, set session and redirect
        // Else redirect back to page with flags
        if (result.user) setSessionAndRedirect(req, res, result.user)
        else res.redirect(`/user/signup?error=${result.error}`
                          + `&unmatch=${result.unmatch}`
                          + `&exists=${result.exists}`)
    })
})

// Login user page
users.get('/login', (req, res) => {
    res.render('user-login', {
        user: req.session.user === "true",
        notfound: req.query.notfound === "true"
    })
})

// Post user login
users.post('/login', async (req, res) => {
    // Within mongoclient context
    await using(dbConnect, async client => {
        // Log in user from client and check if password matches
        let user = await loginUser(client, req.body)

        // If valid user, set user in session, else redirect to error
        if (user) setSessionAndRedirect(req, res, user)
        else res.redirect('/user/login?notfound=true')
    })
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

// User get profile
users.get('/profile', authenticate, (req, res) => {
    res.render('user-view', req.session.user)
})

// Export users router
export default users
