const express = require('express');
const router = express.Router({mergeParams : true});


const {beachSchema, reviewSchema} = require('../schemas.js');
const {validateReview , isReviewAuthor ,isLoggedIn} = require('../middleware');
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError');


const Beach = require('../models/beeaches');
const Review = require('../models/review');

const reviews = require('../controllers/review');



router.post('/' , isLoggedIn, validateReview ,catchAsync(reviews.createReview));

router.delete('/:reviewId' ,isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));


module.exports = router;