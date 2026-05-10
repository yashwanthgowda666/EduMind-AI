// Import mongoose library for database schema/model creation.
const mongoose = require('mongoose'); // Required to define schemas in MongoDB; without this, you cannot create models for your collections.
// Import bcryptjs for password hashing and comparison.
const bcrypt = require('bcryptjs'); // Provides password hashing methods; if not provided, passwords are stored in plain text (insecure).
// Import jsonwebtoken for JWT token creation.
const jwt = require('jsonwebtoken'); // Used to create/verify JWT tokens for authentication; without this, you can't generate tokens for login sessions.

// Define the schema for the User collection
const UserSchema = new mongoose.Schema({
  name: {
    type: String, // This field must be a string.
    required: [true, 'Name is required'], // 'name' must always be present, otherwise error message given.
    trim: true, // Removes whitespace from both ends before saving; if not provided, spaces remain.
    maxlength: [50, 'Name cannot exceed 50 characters'], // Maximum allowed length is 50 characters.
  },
  email: {
    type: String, // This field must be a string.
    required: [true, 'Email is required'], // 'email' must always be present.
    unique: true, // No two users can use the same email; if not provided, duplicates possible.
    lowercase: true, // Converts the email to lowercase before saving; if not here, case differences remain.
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'], // Must match email pattern; if not, invalid emails may be allowed.
  },
  password: {
    type: String, // Password is a string.
    required: [true, 'Password is required'], // Password must be given.
    minlength: [6, 'Password must be at least 6 characters'], // At least 6 characters needed for password.
    select: false, // By default, omit password from query results for security. If not used, password may be sent to frontend or exposed in queries.
  },
  grade: {
    type: String, // Grade must be a string.
    enum: ['8th', '9th', '10th', '11th', '12th', 'College', 'Other'], // Only these values are allowed.
    default: 'Other', // If not specified, defaults to 'Other'.
  },
  subjects: [{
    type: String, // Array of strings.
    enum: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography', 'English', 'Computer Science', 'Economics', 'Other'], // Only these subject names are allowed.
  }],
  totalDoubts: {
    type: Number, // Must be a number.
    default: 0, // Starts at zero if not specified.
  },
  createdAt: {
    type: Date, // Records the date.
    default: Date.now, // Will use the current date/time automatically if not set.
  },
});

// Hash password before saving the user document to database.
UserSchema.pre('save', async function (next) {
  // Check if password was modified; if not, skip hashing.
  if (!this.isModified('password')) return next();
  // Generate a salt with 12 rounds; more secure than lower values.
  const salt = await bcrypt.genSalt(12);
  // Replace plaintext password with its hash.
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
// If you don't hash the password here, it will be stored in database as plain text, making it easy for attackers to read user passwords.

// Define method to compare entered password with stored (hashed) password.
UserSchema.methods.comparePassword = async function (enteredPassword) {
  // Uses bcrypt to compare entered password and hashed password.
  return await bcrypt.compare(enteredPassword, this.password);
};
// Without this, you'd have to manually implement password comparisons, which can be insecure and error-prone.

// Method to generate a JWT token for this user.
UserSchema.methods.generateToken = function () {
  // Creates a JWT token containing user id and email, signed with a secret, and sets its expiration.
  return jwt.sign(
    { id: this._id, email: this.email },
    process.env.JWT_SECRET, // Secret key for signing; must be set in environment.
    { expiresIn: process.env.JWT_EXPIRE || '7d' } // Token expiry, defaults to 7 days if not set.
  );
};
// Without this, you have no secure/authenticated way to identify users between requests (i.e., no login session).

// Export the User model so you can use it elsewhere in your application code.
module.exports = mongoose.model('User', UserSchema);
// If not exported, you cannot interact with users collection using this schema elsewhere in your code.