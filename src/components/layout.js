import * as React from 'react'
import { Link, useStaticQuery, graphql } from 'gatsby'

import {
  container,
  nav,
  navLinks,
  navLinkItem,
  navLinkText,
  siteTitle,
  navLinkActive,
  //box,
  alert
} from './layout.module.scss'
import { StaticImage } from 'gatsby-plugin-image'
import Platforms from './platforms';

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <div className={container}>
      <div className='{box}'>
        <header className={siteTitle}>
          <StaticImage src="../images/game/platform/floriaen.png" alt='Upgrade Your Skull'></StaticImage>
          {data.site.siteMetadata.title}
        </header>
        <div className={alert}>IN CONSTRUCTION</div>
      </div>
      <div className='{box}'>
        <main>
          
          <Platforms />
          
          <div className='{box}'>
            <nav className={nav}>
              <ul className={navLinks}>
                <li className={navLinkItem}>
                  <Link to="/" className={navLinkText} activeClassName={navLinkActive}>
                    Games
                  </Link>
                </li>
                <li className={navLinkItem}>
                  <Link to="/development" className={navLinkText} activeClassName={navLinkActive}>
                    Development
                  </Link>
                </li>
                <li className={navLinkItem}>
                  <Link to="/goodies" className={navLinkText} activeClassName={navLinkActive}>
                    Goodies
                  </Link>
                </li>
                <li className={navLinkItem}>
                  <Link to="/about" className={navLinkText} activeClassName={navLinkActive}>
                    About
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {children}

          <div className='{box}'>
            <footer>2010 - 2023 Floriaen</footer>
          </div>
          
        </main>
      </div>
    </div>
  )
}

export default Layout