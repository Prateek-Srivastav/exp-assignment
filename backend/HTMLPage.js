const htmlPage = `
<!DOCTYPE html>
<html>
  <head>
    <title>Backend</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        margin: 0;
      }
      .container {
        text-align: center;
        padding: 20px;
        border: 1px solid #ccc;
        border-radius: 10px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        background-color: #f9f9f9;
        max-width: 400px;
      }
      h1 {
        color: #00a1b6;
        margin-bottom: 20px;
      }
      ul{
        margin : 0px;
        display: flex;
        align-items : center;
        justify-content : flex-start;
      }
      li{
        list-style: none;
        margin-right : 5px;
        background-color : #00a1b6;
        border-radius : 10px;
        padding : 10px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);   
      }
      li a{
         color : #ffffff; 
        text-decoration : none;
       }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Backend</h1>
      <p>Welcome to Backend!</p>
      <p>Check out our:</p>
      <ul>
        <li><a href="/api/products">Products</a></li>
        <li><a href="/api/categories">Categories</a></li>
      </ul>
    </div>
  </body>
</html>
`;
module.exports = htmlPage;
