// import multer from 'multer';
// import path from 'path';

// // Set storage engine
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/'); // Directory to save uploaded files
//     },
//     filename: (req, file, cb) => {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         cb(null, uniqueSuffix + path.extname(file.originalname)); // Rename file to avoid overwriting
//     }
// });

// // Initialize upload variable with the expected field name
// const upload = multer({ storage: storage }).single('profileImage'); // 'profileImage' should match the field name in the form

// export default upload;
