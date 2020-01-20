const express = require('express')
const router = express.Router()
const auth = require('../checkauth')
const inventoryModel = require('../models/inventory')


router.get('/view', (req, res) => res.render('./inventory/viewinventory'))
router.get('/', (req, res) => res.render('./inventory/viewinventory'))
router.get('/view/search', (req, res) => res.render('./inventory/viewinventory'))

router.post('/view/search',
    (req, res) => {
        var query = {}
        if(req.user.shop!='All') query.shop = req.user.shop;
        if(req.body.type!='All' && req.body.type) query.type = req.body.type;
        if (req.body.IMEI) query.IMEI = req.body.IMEI;
        if (req.body.model) query.model = req.body.model;
        if (req.body.fromdate) {
            query.datemodified = {};
            query.datemodified.$gte = new Date(req.body.fromdate).setHours(00, 00, 00)
        }
        if (req.body.todate) query.datemodified.$lte = new Date(req.body.todate).setHours(23, 59, 59)
        query.count={};
        query.count.$gte = 1;

        inventoryModel.find(query, (err, doc) => {
            if (err) res.send(err)
            else
                res.render('./inventory/viewinventory', { result: doc })
        })
    })

router.get('/manage', (req, res) => res.render('./inventory/manageinventory'))
router.get('/manage/insert', (req, res) => res.render('./inventory/manageinventory'))

router.post('/manage/insert', (req, res) => {
    var newRecord = new inventoryModel();
    newRecord.type = req.body.type;
    newRecord.IMEI = req.body.IMEI || req.body.type + "_" + req.body.model;
    newRecord.model = req.body.model || req.body.type;;
    newRecord.mrp = req.body.mrp;
    newRecord.user = req.user.username;
    newRecord.shop = req.user.shop;
    (req.body.type == 'ec') ? newRecord.count = req.body.mrp : newRecord.count = req.body.count || 1;
    newRecord.save((err, doc) => {
        if (err)
            res.render('./inventory/manageinventory', { message: err })
        else
            res.render('./inventory/manageinventory', { message: 'Record Inserted' })
    })
})

router.post('/manage/update', (req, res) => {
    var updatedRecord = {}
    var query = {}
    if (req.body.spares) {
        query.model = req.body.model
    }
    else {
        query.IMEI = req.body.IMEI
        if (req.body.model) updatedRecord.model = req.body.model;
    }
    if (req.body.mrp) updatedRecord.mrp = req.body.mrp;
    updatedRecord.count = req.body.count || 1;
    updatedRecord.user = req.user.username;
    updatedRecord.shop = req.user.shop;

    inventoryModel.findOneAndUpdate(query, updatedRecord, (err, doc) => {
        if (err)
            res.send(err)
        else
            res.render('./inventory/manageinventory', { message: 'Updated' })
    })
})

router.post('/manage/delete', (req, res) => {
    var query = {}
    req.body.IMEI ? query.IMEI = req.body.IMEI : query.model = req.body.model
    inventoryModel.findOneAndDelete(query,
        (err) => {
            if (err) res.send(err)
            else res.render('./inventory/manageinventory', { message: 'Deleted' })
        })
})

module.exports = router;