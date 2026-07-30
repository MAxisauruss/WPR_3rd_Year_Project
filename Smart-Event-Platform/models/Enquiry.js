// Import mongoose to use its Schema and Model features
const mongoose = require('mongoose');

// Define the blueprint (Schema) for how every single Enquiry must be structured
const enquirySchema = new mongoose.Schema({
    
    // 1. The Name Field
    name: {
        type: String, // The data must be text
        required: [true, 'Please provide a name'], // This field cannot be left blank
        trim: true, // Automatically removes accidental spaces before or after the name
        minlength: [2, "Name must be at least 2 characters long"],
        maxlength: [100, "Name cannot exceed 100 characters"],
    },

    // 2. The Email Field
    email: {
        type: String, // The data must be text
        required: [true, 'Please provide an email address'], // Cannot be left blank
        trim: true,
        lowercase: true,
       
       // We use 'match' to enforce a Regular Expression (Regex) rule.
        // This specific modern regex breaks down like this:
        // 1. ^[a-zA-Z0-9._%+-]+  -> The username can have letters, numbers, dots, and modern symbols like + or %
        // 2. @                   -> It absolutely MUST contain an @ symbol
        // 3. [a-zA-Z0-9.-]+      -> The domain name (like 'gmail' or 'belgiumcampus')
        // 4. \.[a-zA-Z]{2,}$     -> The domain extension (like '.com' or '.education') must be at least 2 letters long
        match: [
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            'Please add a valid email'
        ]
    },

    // 3. The Subject Field
    subject: {
        type: String,
        required: [true, 'Please provide a subject line'],
        maxlength: [100, 'Subject cannot be more than 100 characters'] // Prevents spammy, massive subjects
    },

    // 4. The Message Field
    message: {
        type: String,
        required: [true, 'Please provide a message body'],
        trim: true,
        maxlength: [2000, "Message cannot exceed 2000 characters"],
    },

    // 5. The Status Field
    status: {
        type: String, // The data saved to the database must be text
        
        // We use an object {} for the enum instead of just an array [].
        // This prevents the "Cast to String" error and allows us to write a custom error message.
        enum: {
            // 'values' is the exact list of allowed words. If it's not on this list, Mongoose blocks it.
            values: ['Unread', 'Read', 'Resolved'],
            
            // 'message' is the custom error that gets sent back if someone tries to save a bad status (like 'Pending')
            message: "Status must be 'Unread', 'Read', or 'Resolved'"
        },
        
        // If a user submits a form and doesn't provide a status (which they won't), 
        // the database automatically sets it to 'Unread' for the admin to review later.
        default: 'Unread'
    }
    
}, {
    // Schema Options
    // Setting timestamps to true automatically adds 'createdAt' and 'updatedAt' fields.
    // This tracks exactly when the user submitted the contact form without you writing extra code!
    timestamps: true 
});






// --- Indexes ---
// Speeds up frequent lookups by email and status filtering in admin dashboards
enquirySchema.index({ email: 1 });
enquirySchema.index({ status: 1 });
enquirySchema.index({ createdAt: -1 }); // Optimise sorting by newest first

// --- Instance Method ---
// Cleanly marks an enquiry as resolved
enquirySchema.methods.markAsResolved = async function () {
  this.status = "Resolved";
  return await this.save();
};

// --- Static Method ---
// Fetch all unread enquiries, sorted by newest first
enquirySchema.statics.getUnread = function () {
  return this.find({ status: "Unread" }).sort({ createdAt: -1 });
};



/* Compile the Schema into a usable Model and export it.
 We name the model 'Enquiry'. 
 Mongoose will automatically turn this into a plural collection called 'enquiries' in the database.
*/
// Prevent OverwriteModelError in dev / hot-reload scenarios
const Enquiry = mongoose.models.Enquiry || mongoose.model('Enquiry', enquirySchema);
/*(enquirySchema)I used Mongoose schemas to build strict data validation at the database level,
 ensuring that users cannot submit blank fields or invalid email addresses.*/
module.exports = Enquiry;

 