
const {beachSchema, reviewSchema} = require('./schemas.js');
const ExpressError = require('./utils/ExpressError')
const Beach = require('./models/beeaches');
const Review = require('./models/review');
module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error' , 'You must be signed in');
        return res.redirect('/login');
    }
    next();
}



module.exports.validateBeach = (req,res,next) => {
        const {error} = beachSchema.validate(req.body);
        if(error){
            const msg = error.details.map(el => el.message).join(',')
            throw new ExpressError(msg, 400);
        }
        else{
            next();
        }
    };
    
module.exports.isAuthor = async (req,res,next) => {
        const {id} = req.params;
        const beach = await Beach.findById(id);
        if(!beach.author.equals(req.user._id)){
            req.flash('error', 'You are not authorized to edit details');
            return res.redirect(`/beaches/${id}`);
        }
        next();
}

module.exports.isReviewAuthor = async (req,res,next) => {
    const {id, reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error', 'You are not authorized to edit details');
        return res.redirect(`/beaches/${id}`);
    }
    next();
}



module.exports.validateReview = (req,res,next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    }
    else{
        next();
    }
}
