const User = require('../models/user');

module.exports.renderRegister = (req,res)=> {
    res.render('users/register');
}

module.exports.register = async (req,res)=> {
    try{
        const {email , username, password} = req.body;
        const user = new User({email, username});
        const registerUser = await User.register(user , password);
        req.login(registerUser , err => {
            if(err){
                return next(err);
            }
            req.flash('success' , 'Welcome to the Bee-aches');
            res.redirect('/beaches');
        })
        
    }catch(e){
        req.flash('error' , e.message);
        res.redirect('/register');
    }

    
}

module.exports.renderLogin = (req,res) =>{
    res.render('users/login');
}

module.exports.login = (req,res) =>{
    req.flash('success' , 'welcome back');
    const url = req.session.returnTo || '/beaches';
    delete req.session.returnTo;
    res.redirect(url);
}

module.exports.logout = (req,res) => {
    if(!req.isAuthenticated()){
        req.flash('error' , 'In order to logout you must be Logged In');
        return res.redirect('/login');
    }
    req.logout();
    req.flash('success' , "GOODBYE!!");
    res.redirect('/beaches');
}