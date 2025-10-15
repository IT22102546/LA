// This is a temporary file for development use only
// It provides bypass authentication middlewares for testing
// DO NOT USE IN PRODUCTION

export const bypassVerifyToken = (req, res, next) => {
  // Set a default admin user for development purposes
  req.user = {
    id: '123456789012345678901234', // Fake MongoDB ObjectId
    isAdmin: true
  };
  next();
};

export const bypassVerifyAdmin = (req, res, next) => {
  // Assume the user is an admin
  req.user.isAdmin = true;
  next();
};
