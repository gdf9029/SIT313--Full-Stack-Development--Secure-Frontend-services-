import React from 'react' //importing React library

const App = () => { //Creating a functional component named App
    return (
      <main>
      {/*    Semantic HTML 5 Tag*/}
          <div className="pattern">
          <div className="wrapper"></div>
      {/*        This to wrap our header */}
              <header>
                  <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle</h1>
              </header>
            </div>

      </main>
)
}


    export default App //Exporting the App component as the default export