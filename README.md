
# FoodBaby

CEN3031 Group Project

Check it out [here](http://uffoodbaby.herokuapp.com/#/)!


## Testing

Run:

    npm install
    DEBUG=foodbaby:* npm start


## App Layout

    foodbaby/
    |-app.js -- assign routers
    |bin/
      |-www -- generated code for running the app
    |db/
      |-config.js -- db login
      |-db.js -- exported
      |control/
        |-*.control.js -- routing functions
      |model/
        |-*.schema.js -- schemas
    |public/
      |-*.html -- public html files
      |scripts/
        |-*.js -- script files
      |stylesheets
        |-*.css -- stylesheets
    |routes/
      |-*.js -- routers for app.js
