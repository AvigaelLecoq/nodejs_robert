let cnx = require('./db')
let moment = require('moment')

class Patient {

    constructor(row) {
        this.row = row
    }

    get idPatient() {
        return this.row.idPatient
    }

    get nomPatient() {
        return this.row.nomPatient
    }

    get prenomPatient() {
        return this.row.prenomPatient
    }

    get idExamen() {
        return this.row.idExamen
    }

    get libelleExamen() {
        return this.row.libelleExamen
    }

    get idPatient() {
        return this.row.idPatient
    }

    get idConsultation() {
        return this.row.idConsultation
    }

    get date() {
        return moment(this.row.date)
    }

    get texte() {
        return this.row.texte
    }

    get etat() {
        return this.row.etat
    }

    //Méthode de recherche d'un patient
    static recherche(recherche, cb) {
        cnx.query("SELECT idPatient, nomPatient, prenomPatient FROM patient WHERE nomPatient = ? or prenomPatient = ?", [recherche, recherche], (err, rows) => {
            if (err) throw err
            cb(rows.map((row) => new Patient(row)))
        })
    }

    //Méthode de recherche des tests d'un patient
    static find(idPatient, cb) {
        cnx.query("SELECT idConsultation, examen.idExamen, patient.idPatient, patient.nomPatient, patient.prenomPatient, date, libelleExamen FROM consultation, examen, patient WHERE etat = 0 AND consultation.idPatient = patient.idPatient AND consultation.idExamen = examen.idExamen AND patient.idPatient = ?", [idPatient], (err, rows) => {
            if (err) throw err
            cb(rows)
        })
    }

    //Méthode de recherche d'un test'
    static findExam(idConsultation, cb) {
        cnx.query("SELECT idConsultation, date, consultation.idPatient, consultation.idExamen, nomPatient, prenomPatient, libelleExamen FROM consultation, patient, examen WHERE consultation.idPatient = patient.idPatient AND consultation.idExamen = examen.idExamen AND idConsultation = ? LIMIT 1", [idConsultation], (err, rows) => {
            if (err) throw err
            cb(rows)
        })
    }

    //Méthode pour modifier un examen
    static updateExamen(idConsultation, texte, cb) {
        cnx.query("UPDATE consultation SET etat = 1, texte = ? WHERE idConsultation = ?", [texte, idConsultation], (err, rows) => {
            if (err) throw err
            cb(rows)
        })
    }

}

module.exports = Patient