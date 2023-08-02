const cloudinary = require('cloudinary').v2;
          
cloudinary.config({ 
  cloud_name: 'dw8vuonyi', 
  api_key: '488862963651754', 
  api_secret: 'ua1i2WNxbGGel2VdTOtBXH3j4_4' 
});

cloudinary.uploader.upload("https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
  { public_id: "olympic_flag", folder:"evntya"  }, 
  function(error, result) {console.log(result); });