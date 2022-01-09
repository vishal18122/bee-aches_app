const express= require('express');

const router = express.Router();
const beach = require('../controllers/beach');
const {beachSchema, reviewSchema} = require('../schemas.js');
const catchAsync = require('../utils/catchAsync')
const {isLoggedIn , isAuthor, validateBeach} = require('../middleware');

const ExpressError = require('../utils/ExpressError');
const Beach = require('../models/beeaches');
const Review = require('../models/review');
const multer  = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({ storage });


router.route('/')
router.get('/' , catchAsync(beach.index));

router.get('/new' , isLoggedIn , beach.renderNewForm )

router.post('/'  , isLoggedIn,  upload.array('image') , validateBeach ,catchAsync(beach.createBeach));
// router.post('/' , upload.array('image') ,(req,res) => {
//     console.log(req.body,req.files);
//     res.send("IT WORKED!!")
// });
router.get('/:id'  , catchAsync(beach.showBeach));

router.get('/:id/edit' , isLoggedIn, isAuthor , catchAsync(beach.renderEditForm));

router.put('/:id' , isLoggedIn, isAuthor, upload.array('image'), validateBeach ,catchAsync(beach.updateBeach));

router.delete('/:id' ,  isLoggedIn, isAuthor,  catchAsync(beach.deleteBeach));


module.exports = router;



// https://res.cloudinary.com/dxdkgbvly/image/upload/v1632410038/ecgp9i6hnpjynfh9laf2.jpg