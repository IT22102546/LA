import User from "../models/user.model.js";
import Advertisement from "../models/advertisement.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";

// Get all users (with pagination and filtering options)
export const getAllUsers = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      role, 
      status, 
      searchQuery 
    } = req.query;
    
    const query = {};
    
    // Filter by role (Admin/non-Admin)
    if (role === 'admin') {
      query.isAdmin = true;
    } else if (role === 'advertiser') {
      query.isAdmin = false;
    }
    
    // Filter by verification status
    if (status === 'verified') {
      query.isVerified = true;
    } else if (status === 'unverified') {
      query.isVerified = false;
    }
    
    // Search by username, email, or mobile
    if (searchQuery) {
      query.$or = [
        { username: { $regex: searchQuery, $options: 'i' } },
        { email: { $regex: searchQuery, $options: 'i' } },
        { mobile: { $regex: searchQuery, $options: 'i' } }
      ];
    }
    
    const skip = (page - 1) * limit;
    
    const users = await User.find(query)
      .select('-password -verifytoken -otp -otpExpires') // Exclude sensitive fields
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const totalUsers = await User.countDocuments(query);

    // If we're fetching advertisers, get their ad statistics
    if (role === 'advertiser' || !role) {
      // Get user IDs that are not admins
      const advertiserIds = users
        .filter(user => !user.isAdmin)
        .map(user => user._id);

      // If we have advertisers, get their ad stats
      if (advertiserIds.length > 0) {
        // Get ad counts for all advertisers in one query per status
        const approvedAds = await Advertisement.aggregate([
          { $match: { userId: { $in: advertiserIds }, status: 'approved' } },
          { $group: { _id: '$userId', count: { $sum: 1 } } }
        ]);
        
        const pendingAds = await Advertisement.aggregate([
          { $match: { userId: { $in: advertiserIds }, status: 'pending' } },
          { $group: { _id: '$userId', count: { $sum: 1 } } }
        ]);
        
        const rejectedAds = await Advertisement.aggregate([
          { $match: { userId: { $in: advertiserIds }, status: 'rejected' } },
          { $group: { _id: '$userId', count: { $sum: 1 } } }
        ]);

        // Create a map for quick lookups
        const adStatsMap = new Map();
        
        approvedAds.forEach(item => {
          if (!adStatsMap.has(item._id.toString())) {
            adStatsMap.set(item._id.toString(), { approved: 0, pending: 0, rejected: 0 });
          }
          adStatsMap.get(item._id.toString()).approved = item.count;
        });
        
        pendingAds.forEach(item => {
          if (!adStatsMap.has(item._id.toString())) {
            adStatsMap.set(item._id.toString(), { approved: 0, pending: 0, rejected: 0 });
          }
          adStatsMap.get(item._id.toString()).pending = item.count;
        });
        
        rejectedAds.forEach(item => {
          if (!adStatsMap.has(item._id.toString())) {
            adStatsMap.set(item._id.toString(), { approved: 0, pending: 0, rejected: 0 });
          }
          adStatsMap.get(item._id.toString()).rejected = item.count;
        });

        // Attach ad stats to each advertiser
        users.forEach(user => {
          if (!user.isAdmin) {
            const userId = user._id.toString();
            const stats = adStatsMap.get(userId) || { approved: 0, pending: 0, rejected: 0 };
            user._doc.adStats = stats;
          }
        });
      }
    }
    
    return res.status(200).json({
      users,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: parseInt(page),
      totalUsers
    });
  } catch (error) {
    next(error);
  }
};

// Get user by ID
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password -verifytoken -otp -otpExpires');
    
    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }
    
    // Get advertisement statistics if the user is an advertiser
    let adStats = null;
    if (!user.isAdmin) {
      // Fetch actual advertisement statistics from the database
      const approved = await Advertisement.countDocuments({ userId: user._id, status: 'approved' });
      const pending = await Advertisement.countDocuments({ userId: user._id, status: 'pending' });
      const rejected = await Advertisement.countDocuments({ userId: user._id, status: 'rejected' });
      
      adStats = { approved, pending, rejected };
    }
    
    return res.status(200).json({ user, adStats });
  } catch (error) {
    next(error);
  }
};

// Create a new admin user
export const createAdminUser = async (req, res, next) => {
  try {
    const { username, email, password, mobile, role, firstName, lastName } = req.body;
    
    // Validate required fields
    if (!username || !email || !password || !mobile) {
      return next(errorHandler(400, 'Username, email, password, and mobile are required'));
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return next(errorHandler(400, 'Invalid email format'));
    }
    
    // Validate mobile format (Sri Lankan format)
    const mobileRegex = /^(071|076|077|075|078|070|074|072)\d{7}$/;
    if (!mobileRegex.test(mobile)) {
      return next(errorHandler(400, 'Invalid mobile number format. Must be a valid Sri Lankan mobile number'));
    }
    
    // Validate username
    if (username.length < 5 || username.length > 20) {
      return next(errorHandler(400, 'Username must be between 5 and 20 characters'));
    }
    
    // Validate password strength
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{5,}$/;
    if (!passwordRegex.test(password)) {
      return next(errorHandler(400, 'Password should be at least 5 characters long and contain at least one uppercase letter, one digit, and one symbol (!@#$%^&*()_+).'));
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }, { mobile }] });
    if (existingUser) {
      if (existingUser.email === email) {
        return next(errorHandler(400, 'User with this email already exists'));
      }
      if (existingUser.username === username) {
        return next(errorHandler(400, 'Username already taken'));
      }
      if (existingUser.mobile === mobile) {
        return next(errorHandler(400, 'Mobile number already registered'));
      }
    }
    
    // Hash password
    const hashedPassword = bcryptjs.hashSync(password, 10);
    
    // Construct full name from first and last name if provided
    const name = firstName && lastName ? `${firstName} ${lastName}` : undefined;
    
    // Create user with admin privileges
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      mobile,
      name, // Store the full name if provided
      isAdmin: true,
      isVerified: true, // Admin users are verified by default
      joinDate: new Date(),
      // Store role in a custom field if needed
      role: role || 'Admin'
    });
    
    await newUser.save();
    
    // Don't send back the password
    const { password: pass, ...userWithoutPassword } = newUser._doc;
    
    res.status(201).json({
      ...userWithoutPassword,
      message: 'Admin user created successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Update user
export const updateUser = async (req, res, next) => {
  try {
    const { password, email, username, mobile, isAdmin, isVerified } = req.body;
    
    // Check if user exists
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }
    
    // Check if email is being changed and is already taken
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return next(errorHandler(400, 'Email already in use'));
      }
    }
    
    // Check if username is being changed and is already taken
    if (username && username !== user.username) {
      const usernameExists = await User.findOne({ username });
      if (usernameExists) {
        return next(errorHandler(400, 'Username already in use'));
      }
    }
    
    // Update user fields
    if (email) user.email = email;
    if (username) user.username = username;
    if (mobile) user.mobile = mobile;
    if (typeof isAdmin === 'boolean') user.isAdmin = isAdmin;
    if (typeof isVerified === 'boolean') user.isVerified = isVerified;
    
    // Update password if provided
    if (password) {
      user.password = bcryptjs.hashSync(password, 10);
    }
    
    await user.save();
    
    // Don't send back sensitive information
    const { password: pass, verifytoken, otp, otpExpires, ...updatedUser } = user._doc;
    
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

// Delete user
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }
    
    await User.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ message: 'User has been deleted' });
  } catch (error) {
    next(error);
  }
};

// Toggle user status (active/inactive)
export const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }
    
    // Here we're using isVerified as a proxy for active/inactive status
    user.isVerified = !user.isVerified;
    await user.save();
    
    // Don't send back sensitive information
    const { password, verifytoken, otp, otpExpires, ...updatedUser } = user._doc;
    
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

// Get user statistics
export const getUserStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const admins = await User.countDocuments({ isAdmin: true });
    const advertisers = await User.countDocuments({ isAdmin: false });
    const verifiedUsers = await User.countDocuments({ isVerified: true });
    const unverifiedUsers = await User.countDocuments({ isVerified: false });
    
    // Get new users in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newUsers = await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
    
    res.status(200).json({
      totalUsers,
      admins,
      advertisers,
      verifiedUsers,
      unverifiedUsers,
      newUsers
    });
  } catch (error) {
    next(error);
  }
};
