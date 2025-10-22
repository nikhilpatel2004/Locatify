
# 🏠 Locatify - Airbnb Clone

A full-stack web application that allows users to discover, book, and manage vacation rentals. Built with Node.js, Express, MongoDB, and modern web technologies.

## ✨ Features

### 🔍 **Search & Discovery**
- **Smart Search Bar** with location suggestions
- **Interactive Filter Icons** (Trending, Rooms, Mountains, Castles, etc.)
- **Real-time Search** with autocomplete
- **Location-based Filtering**

### 🏡 **Property Management**
- **Create New Listings** with image upload
- **Edit & Delete** your own listings
- **Image Upload** with Cloudinary integration
- **Automatic Image Compression** (800x600px)
- **File Size Support** up to 50MB

### 🗺️ **Interactive Maps**
- **Real Map Integration** using OpenStreetMap
- **Location Display** for each property
- **India-focused** map view
- **No API Key Required** for basic functionality

### ⭐ **Reviews & Ratings**
- **5-Star Rating System** with visual stars
- **User Reviews** with comments
- **Review Management** (edit/delete your own reviews)
- **Average Rating Display**

### 👤 **User Authentication**
- **User Registration & Login**
- **Session Management**
- **Protected Routes**
- **User-specific Content**

### 🎨 **Modern UI/UX**
- **Airbnb-inspired Design**
- **Responsive Layout** for all devices
- **Smooth Animations** and transitions
- **Professional Styling**

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Cloudinary account (for image uploads)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd majorPro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   CLOUD_NAME=your_cloudinary_cloud_name
   CLOUD_API_KEY=your_cloudinary_api_key
   CLOUD_API_SECRET=your_cloudinary_api_secret
   GOOGLE_MAPS_API_KEY=your_google_maps_api_key (optional)
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system

5. **Run the application**
   ```bash
   npm start
   ```

6. **Open your browser**
   Navigate to `http://localhost:8080`

## 📁 Project Structure

```
majorPro/
├── controllers/          # Route controllers
│   ├── listings.js      # Listing management
│   ├── reviews.js       # Review management
│   └── users.js         # User authentication
├── models/              # Database models
│   ├── listing.js       # Listing schema
│   ├── review.js        # Review schema
│   └── user.js          # User schema
├── routes/              # Express routes
│   ├── listing.js       # Listing routes
│   ├── review.js        # Review routes
│   └── user.js          # User routes
├── views/               # EJS templates
│   ├── layouts/         # Layout templates
│   ├── listings/        # Listing pages
│   ├── users/           # User pages
│   └── includes/        # Partial templates
├── public/              # Static assets
│   ├── css/            # Stylesheets
│   ├── js/             # JavaScript files
│   └── images/         # Static images
├── init/               # Database initialization
├── utils/              # Utility functions
└── middleware.js       # Custom middleware
```

## 🛠️ Technologies Used

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Passport.js** - Authentication
- **Multer** - File upload handling
- **Cloudinary** - Image storage and processing

### Frontend
- **EJS** - Template engine
- **Bootstrap 5** - CSS framework
- **Font Awesome** - Icons
- **Custom CSS** - Styling
- **Vanilla JavaScript** - Interactivity

### Additional Tools
- **NodeGeocoder** - Location geocoding
- **Express Session** - Session management
- **Connect Flash** - Flash messages
- **Method Override** - HTTP method override

## 🎯 Key Features Explained

### Search Functionality
- **Smart Suggestions**: Pre-populated with popular Indian destinations
- **Real-time Filtering**: Filter suggestions as you type
- **One-click Search**: Click suggestions to search instantly

### Filter Icons
- **Interactive Icons**: Click to filter by category
- **Visual Feedback**: Active state with color changes
- **Notification System**: Shows filter status

### Image Upload
- **Drag & Drop**: Easy file selection
- **Auto Compression**: Images resized to 800x600px
- **Large File Support**: Up to 50MB files accepted
- **Cloud Storage**: Secure cloud storage with Cloudinary

### Map Integration
- **OpenStreetMap**: Free, no API key required
- **India Focus**: Centered on India with proper bounds
- **Location Display**: Shows property location
- **Interactive**: Zoom, pan, and explore

## 🔧 Configuration

### Cloudinary Setup
1. Create a Cloudinary account
2. Get your cloud name, API key, and API secret
3. Add them to your `.env` file

### Google Maps (Optional)
1. Follow the guide in `GOOGLE_MAPS_SETUP.md`
2. Enable Maps JavaScript API and Geocoding API
3. Set up billing account
4. Add API key to `.env` file

### Database
- MongoDB connection string: `mongodb://127.0.0.1:27017/majorpro`
- Database name: `majorpro`

## 📱 Responsive Design

The application is fully responsive and works on:
- **Desktop** (1200px+)
- **Tablet** (768px - 1199px)
- **Mobile** (320px - 767px)

## 🎨 Styling Features

- **Airbnb-inspired Design**: Clean, modern interface
- **Consistent Color Scheme**: Red (#fe424d) primary color
- **Smooth Animations**: Hover effects and transitions
- **Professional Typography**: Plus Jakarta Sans font
- **Card-based Layout**: Clean property cards
- **Interactive Elements**: Buttons, forms, and filters

## 🚀 Deployment

### Heroku Deployment
1. Create a Heroku app
2. Set environment variables in Heroku dashboard
3. Connect your GitHub repository
4. Deploy automatically

### Environment Variables for Production
```env
NODE_ENV=production
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:
1. Check the console for error messages
2. Verify your environment variables
3. Ensure MongoDB is running
4. Check your internet connection for map loading

## 🔮 Future Enhancements

- [ ] Real-time chat between hosts and guests
- [ ] Payment integration
- [ ] Advanced search filters
- [ ] Wishlist functionality
- [ ] Mobile app development
- [ ] Multi-language support
- [ ] Advanced analytics dashboard

---

**Built with ❤️ using Node.js, Express, MongoDB, and modern web technologies**
=======
# Locatify
>>>>>>> 1342d1b89b79978eb05a856ebfde01d490a9360d
