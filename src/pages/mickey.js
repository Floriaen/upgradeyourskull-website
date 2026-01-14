import * as React from 'react'
import { StaticImage } from 'gatsby-plugin-image'

const mickeyContainer = {
    maxWidth: "900px",
    margin: "0 auto",
}

const mickeyList = {
    listStyleType: "none",
    margin: "0rem",
    padding: 0,
    overflow: "hidden"
}

const mickeyElement = {
    float: "left",
    margin: "0.2rem",
    border: "0.3rem solid #aaa",
    borderRadius: "0.3rem",
}

const micketImageWidth = 256;

const Mickey = () => {

    return (
        <div>

            <header>

            </header>

            <div>
                <main>
                    <div style={mickeyContainer}>
                        <ul style={mickeyList}>
                            <li style={mickeyElement}><StaticImage src="../images/goodies/mickey/mickey1.jpg" alt='Mickey 1' width={micketImageWidth}></StaticImage></li>
                            <li style={mickeyElement}><StaticImage src="../images/goodies/mickey/mickey2.jpg" alt='Mickey 2' width={micketImageWidth}></StaticImage></li>
                            <li style={mickeyElement}><StaticImage src="../images/goodies/mickey/mickey3.jpg" alt='Mickey 3' width={micketImageWidth}></StaticImage></li>
                            <li style={mickeyElement}><StaticImage src="../images/goodies/mickey/mickey4.jpg" alt='Mickey 4' width={micketImageWidth}></StaticImage></li>
                            <li style={mickeyElement}><StaticImage src="../images/goodies/mickey/mickey5.png" alt='Mickey 5' width={micketImageWidth}></StaticImage></li>
                            <li style={mickeyElement}><StaticImage src="../images/goodies/mickey/mickey6.jpg" alt='Mickey 6' width={micketImageWidth}></StaticImage></li>
                        </ul>
                    </div>

                    <div>
                        <footer>2010 - 2023 Floriaen</footer>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Mickey