
module.exports = function (req, fields){

    if(fields.indexOf('name')>=0){
        req.checkBody('name', 'Username field cannot be empty.').notEmpty();
        req.checkBody('name', 'Username must be between 4-15 characters long.').len(4, 15);
        // Additional validation to ensure username is alphanumeric with underscores and dashes
        req.checkBody('name', 'Username can only contain letters, numbers, or underscores.').matches(/^[A-Za-z0-9_-]+$/, 'i');
    }
    if(fields.indexOf('email')>=0){
        req.checkBody('email', 'The email you entered is invalid, please try again.').isEmail();
        req.checkBody('email', 'Email address must be between 4-100 characters long, please try again.').len(4, 100);
    }
    if(fields.indexOf('password')>=0){
        req.checkBody('password', 'Password must be between 8-100 characters long.').len(8, 100);
        req.checkBody("password", "Password must include one lowercase character, one uppercase character, a number, and a special character.").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/, "i");
    }
    if(fields.indexOf('passwordMatch')>=0){
        req.checkBody('passwordMatch', 'Password must be between 8-100 characters long.').len(8, 100);
        req.checkBody('passwordMatch', 'Passwords do not match, please try again.').equals(req.body.password);
    }

    const errors = req.validationErrors();
    return errors;
}