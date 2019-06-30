# BoilerMakeQR
A simple application to manage qr codes for the BoilerMake hackathon

## About
For BM7, we are striving for a quicker check-in process and a cleaner method to monitor whether or not hackers have received swag or have eaten. To do this, we've opted to use qr codes. This full stack web application aims to offer a means to manage these qr codes while simulaneously offering a way to scan these codes from mobile devices.

## Installation
Before you run the application, you'll need to make a [GitHub OAuth App](http://localhost:8080/api/auth/github/redirect).
* For local development, use:
    * Homepage URL: `http://localhost:8080`
    * Authorization callback URL: `http://localhost:8080/api/auth/github/redirect`
* For deployment to Heroku, use:
    * Homepage URL: `https://YOUR_HEROKU_NAME.herokuapp.com/`
    * Authorization callback URL: `https://YOUR_HEROKU_NAME.herokuapp.com/api/auth/github/redirect`

To start this application for local development, clone the repository and run:
```bash
npm install
npm start
```