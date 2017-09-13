
module.exports = {
    handleInternalError: (res, errorMessage) => {
        console.log(`Cannot ${errorMessage}`);
        res.redirect('/?error=Internal server error. Please try again later.');
    }
}