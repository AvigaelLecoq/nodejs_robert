const { response } = require('express')
let express = require('express')
const { request } = require('http')
let bodyParser = require('body-parser')
let session = require('express-session')
let app = express()

app.set('view engine', 'ejs')

app.use('/assets', express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(session({
    secret: 'azerty123',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))

app.use(require('./middlewares/flash'))

// Routes

// Route index
app.get('/', (request, response) => {
    response.render('pages/index')
})

// Route de recherche
app.post('/', (request, response) => {
    if (request.body.search == undefined || request.body.search == '') {
        request.flash('error', 'Champs vide')
        response.redirect('/')
    } else {
        let Patient = require('./models/patient')
        Patient.recherche(request.body.search, function(listPatient) {

            if (listPatient[0] == undefined) {
                request.flash('error', 'Aucun résultat')
                response.redirect('/')
            } else {
                response.render('pages/index', { listPatient: listPatient })
            }
        })
    }
})

// Route de test d'un patient
app.get('/patient/:idPatient', (request, response) => {
    let Patient = require('./models/patient')
    Patient.find(request.params.idPatient, function(listExamen) {

        if (listExamen[0] == undefined) {
            request.flash('error', 'Aucun résultat')
            response.redirect('/')
        } else {
            response.render('pages/patient', { listExamen: listExamen })
        }
    })
})

// Route d'un test d'un patient
app.get('/patient/examen/:idExamen', (request, response) => {
    let Patient = require('./models/patient')
    Patient.findExam(request.params.idExamen, function(lexamen) {

        if (lexamen[0] == undefined) {
            request.flash('error', 'Erreur, Veuillez réessayer')
            response.redirect('/')
        } else {
            response.render('pages/examen', { lexamen: lexamen })
        }
    })
})

app.post('/patient/examen', (request, response) => {
    if (request.body.idExamen == undefined || request.body.texteExamen == undefined || request.body.texteExamen == '' || request.body.idExamen == '') {
        request.flash('error', 'Erreur, Veuillez réessayer')
        response.redirect('/')
    } else {
        let Patient = require('./models/patient')
        Patient.updateExamen(request.body.idExamen, request.body.texteExamen, function(res) {
            request.flash('error', 'Examen mis à jour')
            response.redirect('/')
        })
    }
})

app.listen(8585)