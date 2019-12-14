const express = require('express')
const router = express.Router()

router.get('/view', (req, res) => res.render('./bills/viewbills'))
router.get('/', (req, res) => res.render('./bills/viewbills'))
router.get('/view/search', (req, res) => res.render('./bills/viewbills'))

router.get('/newbill',(req,res)=>res.render('./bills/newbill'))

module.exports=router;