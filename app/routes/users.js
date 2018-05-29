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
import authenticate from '../authenticate'
import {
    setSessionAndRedirect,
    signupUser,
    loginUser,
    updateNameOfUser,
    updatePasswordOfUser
} from '../models/user'

// Create users router
var users = Router()

// Signup user page
users.get('/signup', (req, res) => {
    res.render('user-signup', {
        layout: 'base',
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
        layout: 'base',
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
        layout: 'base',
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
    res.render('user-view', { user: req.session.user })
})

// User update-name page
users.get('/update/name', authenticate, (req, res) => {
    res.render('user-update-name', {
        user: req.session.user,
        error: req.params.error === "true"
    })
})

// User update name
users.post('/update/name', authenticate, async (req, res) => {
    // Connect to mongo
    await using(dbConnect, async client => {
        // Update name of user in database
        let update = await updateNameOfUser(
            client, req.session.user, req.body)

        // If successful updated user set user in session
        // else redirect to error
        if (update.user) setSessionAndRedirect(req, res, update.user)
        else res.redirect('/user/update/name?error='+update.error)
    })
})

// User update password page
users.get('/update/password', authenticate, (req, res) => {
    res.render('user-update-password', {
        user: req.session.user,
        invalid: req.params.invalid === "true",
        unmatch: req.params.unmatch === "true",
        error: req.params.error === "true"
    })
})

// User update password
users.post('/update/password', authenticate, async (req, res) => {
    // Connect to mongo
    await using(dbConnect, async client => {
        // Update password of user in database
        let update = await updatePasswordOfUser(
            client, req.session.user, req.body)

        // If successful updated user set user in session
        // else redirect to error
        if (update.user) setSessionAndRedirect(req, res, update.user)
        else res.redirect('/user/update/name?error='+update.error
                                         + '&invalid='+update.invalid,
                                         + '&unmatch='+update.unmatch)
    })
})

// Export users router
export default users
