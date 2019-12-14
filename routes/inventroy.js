const express = require('express')
const router = express.Router()
const auth = require('../checkauth')
const inventoryModel = require('../models/inventory')


router.get('/view', (req, res) => res.render('./inventory/viewinventory'))
router.get('/', (req, res) => res.render('./inventory/viewinventory'))
router.get('/view/search', (req, res) => res.render('./inventory/viewinventory'))

router.post('/view/search',
    (req, res) => {    //query - IMEI:req.body.IMEI
        inventoryModel.find({}, (err, doc) => {
            if (err) res.send(err)
            else
                res.render('./inventory/viewinventory', { 'result': doc })
        })
    })

router.get('/manage', (req, res) => res.render('./inventory/manageinventory'))
router.get('/manage/insert', (req, res) => res.render('./inventory/manageinventory'))

router.post('/manage/insert', (req, res) => {
    var newRecord = new inventoryModel();
    newRecord.IMEI = req.body.IMEI;
    newRecord.model = req.body.model;
    newRecord.mrp = req.body.mrp;
    newRecord.count = req.body.count;
    newRecord.spares = req.body.spares || false;

    newRecord.save((err, doc) => {
        if (err)
            res.send(err)
        else
            res.render('./inventory/manageinventory', { message: doc })
    })
})

router.post('/manage/update', (req, res) => {
    res.send('updatePage')
})
router.get('/manage/delete', (req, res) => {
    res.send('updatePage')
})

module.exports = router;