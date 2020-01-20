const express = require('express')
const router = express.Router()
const billsModel = require('../models/bills')
const inventoryModel = require('../models/inventory')

router.get('/view', (req, res) => res.render('./bills/viewbills'))
router.get('/', (req, res) => res.render('./bills/viewbills'))

router.post('/view/search',
    (req, res) => {
        var query = {}
        if(req.user.shop!='All') query.shop = req.user.shop;
        if(req.body.type!='All') if (req.body.type) query.type = req.body.type;
        if (req.body.billnumber) query.billnumber = req.body.billnumber;
        if (req.body.IMEI) query.IMEI = req.body.IMEI;
        if (req.body.model) query.model = req.body.model;
        if (req.body.fromdate) {
            query.datemodified = {};
            query.datemodified.$gte = new Date(req.body.fromdate).setHours(00, 00, 00)
        }
        if (req.body.todate) query.datemodified.$lte = new Date(req.body.todate).setHours(23, 59, 59)

        billsModel.find(query, (err, doc) => {
            if (err) res.send(err)
            else
                res.render('./bills/viewbills', { result: doc ? doc : 'No Search Result' })
        })
    })

router.post('/newbill',
    (req, res) => {
        let query = {}
        if(req.user.shop!='All') query.shop = req.user.shop;
        if (req.body.IMEI) query.IMEI = req.body.IMEI;
        if (req.body.model) query.model = req.body.model;
        query.type = req.body.type;

        //console.log(query)
        //inventoryModel.updateOne(query, { count: 1 },(err)=>{console.log(err)});
        inventoryModel.find(query, (err, doc) => {
            if (err) res.send(err)
            else
                billsModel.countDocuments({}, function (err, count) {
                    if (doc.length == 0) res.render('./bills/newbill', { billnumber: count + 1, messages: 'No Product with given Name in the Shop' });
                    else if (doc[0].count > 0) res.render('./bills/newbill', { billnumber: count + 1, result: doc })
                    else res.render('./bills/newbill', { billnumber: count + 1, messages: 'No Stock' });
                })
        })
    })


router.get('/newbill', (req, res) => {
    billsModel.countDocuments({}, function (err, count) {
        res.render('./bills/newbill', { billnumber: count + 1 })
    })
})

router.post('/sell', (req, res) => {
    //get count here
    if (typeof (req.body.IMEI0) == 'undefined')
        res.redirect('./newbill');//, { billnumber: newBillNo, messages: JSON.stringify(err) })
    let query = {}
    let newBillNo = 0;
    query.IMEI = req.body.IMEI0;
    if(req.user.shop!='All') query.shop = req.user.shop;

    let getBillNumber = new Promise(function (resolve, reject) {
        billsModel.countDocuments({}, function (err, count) {
            if (err) {
                reject(err);
            } else {
                //setTimeout(() => {
                //  console.log('before');
                newBillNo = count + 1;
                resolve(count);
                //}, 3000);
            }
        })
    });

    let getInventoryRecord = new Promise((resolve, reject) => {
        inventoryModel.findOne(query, (err, doc) => {
            if (err)
                reject(err);
            else
                resolve(doc);
        })
    })



    getBillNumber.then((count) => {
        getInventoryRecord.then((doc) => {
            reduceCount = 1;
            if (doc.type == "ec") reduceCount = req.body.sellingprice;

            inventoryModel.updateOne(query, { count: doc.count - reduceCount }, (err) => {//doc.count - 1
                if (err) console.log(err);// res.render('./bills/newbill', { billnumber: 1 })
            })
            //Insert Bill Here
            let newRecord = new billsModel();
            newRecord.billnumber = newBillNo;
            newRecord.type = doc.type;
            newRecord.IMEI = doc.IMEI;
            newRecord.model = doc.model;
            newRecord.shop = doc.shop;
            newRecord.mrp = doc.mrp;
            newRecord.sellingprice = req.body.sellingprice;
            newRecord.user = req.user.username;
            newRecord.customer = req.body.customer;
            newRecord.contactnum = req.body.contactnum;
            newRecord.save((err, doc) => {
                if (err) {
                    //console.log(err)
                    res.render('./bills/newbill', { billnumber: newBillNo, messages: JSON.stringify(err) })
                }
                else {
                    res.render('./bills/viewsinglebill', { result: doc })
                }
            })
        })
    })
})
module.exports = router;