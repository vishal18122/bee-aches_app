const Beach = require('../models/beeaches');
const Review = require('../models/review');


module.exports.createReview = async(req,res) => {
    // res.send( "HELLoo");
    const beach = await Beach.findById(req.params.id);

    const review = new Review(req.body.review);
    review.author = req.user._id;
    beach.reviews.push(review);
    await review.save();
    await beach.save();
    req.flash('success' , 'Successfully created the review!!');
    res.redirect(`/beaches/${beach._id}`);
}

module.exports.deleteReview = async(req,res) => {
    const {id, reviewId} = req.params;
    await Beach.findByIdAndUpdate(id, {$pull: {reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success' , 'Successfully deleted the review!!');
    res.redirect(`/beaches/${id}`);
}