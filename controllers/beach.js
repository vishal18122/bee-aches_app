const Beach = require('../models/beeaches');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;

const geocoder = mbxGeocoding({accessToken: mapBoxToken});
const {cloudinary}  = require("../cloudinary");

module.exports.index= async(req,res,next) => {        
    const beach = await Beach.find({});
    res.render('beaches/index' , {beach});
}

module.exports.renderNewForm = async(req,res,next)=> {
    res.render('beaches/new');
}

module.exports.createBeach = async(req,res,next)=> {
    // if(!req.body.beach) throw new ExpressError('Invalid Beach Data', 400);
    const geoData= await geocoder.forwardGeocode({
        query: req.body.beach.location,
        limit: 1
    }).send()
    
    
    const beach = new Beach(req.body.beach);
    beach.geometry = geoData.body.features[0].geometry;
    beach.images = req.files.map(f => ({url : f.path , filename: f.filename}))
    beach.author = req.user._id;
    await beach.save();
    console.log(beach);
    req.flash('success' , 'Successfully added the new Beach!!');
    res.redirect(`/beaches/${beach._id}`);
    
    
    
}

module.exports.showBeach = async(req,res,next) => {
    const beach = await Beach.findById(req.params.id).populate({
         path : 'reviews',
         populate : {
            path : 'author'
         }
        }).populate('author');
    
    
    if(!beach){
        req.flash('error', 'Cannot find that beach');
        return res.redirect('/beaches');
    }
    res.render('beaches/show', { beach });
}

module.exports.renderEditForm = async(req,res,next) => {
    const {id} = req.params;
    const beach = await Beach.findById(req.params.id);
    if(!beach){
        req.flash('error', 'Cannot find that beach');
        return res.redirect('/beaches');
    }
    
    
    res.render('beaches/edit', { beach});
}

// module.exports.updateBeach = async(req,res,next) => {
//     const {id} = req.params; 
//     // console.log(req.body);
//     const b = await Beach.findByIdAndUpdate(id , {...req.body.beach} );
//     const imgs = req.files.map(f => ({url : f.path , filename: f.filename}));
//     b.images.push(...imgs);
//     await b.save();
//     if(req.body.deleteImages){
//         for(let filename of req.body.deleteImages){
//             await cloudinary.uploader.destroy(filename);
//         }
//         await b.updateOne({ $pull: { images : { filename : { $in: req.body.deleteImages }}}});
//         console.log(b);
//         console.log("deleted");
//     }
//     req.flash('success' , 'Successfully updated the new Beach!!');
//     res.redirect(`/beaches/${b.id}`);
// }

module.exports.updateBeach = async (req, res) => {
    const { id } = req.params;
    
    const beach = await Beach.findByIdAndUpdate(id, { ...req.body.beach });

    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            
            await cloudinary.uploader.destroy(filename , function(result){console.log(result)});
        }
        // console.log("..........");
        await beach.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
        // for(let i of beach.images){
        //     console.log(i);
        // }
        
    }

    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    beach.images.push(...imgs);
    await beach.save();
    
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/beaches/${beach._id}`)
}


module.exports.deleteBeach = async(req,res) => {
    const {id} = req.params;
    await Beach.findByIdAndDelete(id);
    req.flash('success' , 'Successfully deleted the Beach!!');
    res.redirect('/beaches');
}