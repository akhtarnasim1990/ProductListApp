# Product List Application

This project is a simple React application that displays a list of products with search functionality. It also provides a user-friendly experience by including an image loading spinner and handling image load errors.

## Features

- **Product List Display:** Renders a list of products fetched from a mock API.
- **Search Functionality:** Allows users to search for products by name. The search is optimized with a debounced input, ensuring that the search is performed after the user stops typing.
- **Image Loading State:** Displays a loading spinner while images are being fetched and handles errors by showing an alternative message if the image fails to load.

## Installation

To run this project locally, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/product-list-app.git
   cd product-list-app
   ```

2. **Install the dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**

   ```bash
   npm start
   ```

4. **View the application:**

   Open [http://localhost:3000](http://localhost:3000) in your browser to see the application running.

## Code Overview

### React Components

- **`App.tsx`:** The main component of the application.
  - **State Management:**
    - `products`: Stores the list of products fetched from the API.
    - `searchKey`: Stores the user's search input.
    - `debouncedSearchKey`: Stores the debounced value of the search key to optimize the search performance.
    - `imageLoading`: Tracks the loading state of each product's image.
  - **Effects:**
    - Fetches product data from the API on component mount.
    - Implements debouncing for the search input.
  - **Functions:**
    - `handleSearchChange`: Updates the search key as the user types.
    - `handleImageLoad`: Updates the image loading state when an image is successfully loaded.
    - `handleImageError`: Updates the image loading state when an image fails to load.

### CSS Styling

- **Responsive Design:** The CSS file includes media queries to ensure the application is responsive across different screen sizes.
- **Loader Spinner:** A custom spinner is included to indicate loading states for images.

## API Details

### Mock Server and Dynamic Data

The data for the product list is fetched from a mock server created using Postman. Here's how the mock server and the dynamic data generation work:

1. **Schema Creation:**

   - In Postman, a schema is defined for the product data. This schema outlines the structure and types of data for each product (e.g., `productId`, `productName`, `productPrice`, `productImage`).
   - This schema is stored in a variable within a Postman collection, allowing it to be reused across different mock responses.

2. **Dynamic Data Generation:**

   - The mock server is set up to leverage the schema to generate dynamic data on each API request.
   - Every time the API endpoint is called, the mock server returns a new set of product data based on the predefined schema. This means the product data will change on every page reload or refresh, ensuring a fresh dataset each time.

3. **Mock API Example:**
   - An example response is created in Postman that uses the schema to generate the mock data dynamically.
   - This setup simulates a real-world API, providing a realistic environment for front-end development and testing without needing a live backend.

### API Endpoint

- **Endpoint:** `https://1e0ba872-6030-405d-9881-8b7455d2ebdf.mock.pstmn.io/api/v1/products`
- **Method:** `GET`
- **Response:** A list of products with dynamic content on each request.

## Future Scope

Here are some potential enhancements that could be made to this project:

1. **Pagination:** Add pagination to manage large sets of products more efficiently.
2. **Improved Error Handling:** Implement more sophisticated error handling for network requests and display user-friendly messages.
3. **Lazy Loading:** Implement lazy loading for images to optimize performance and reduce the initial load time.
4. **Enhanced Search:** Add advanced search capabilities, such as filtering by price range or product categories.
5. **Unit Tests:** Add unit tests for components and utility functions to ensure code reliability.
6. **State Management:** Integrate a global state management solution like Redux for better scalability and manageability.
