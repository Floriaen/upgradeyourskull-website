// Step 1: Import React
import * as React from 'react'
import Layout from '../components/layout'
import Game from '../components/game'
import Seo from '../components/seo'
import { graphql } from 'gatsby'

export const query = graphql`
  query {
    allGamesJson {
      edges {
        node {
          id
          name
          url
          banner {
            childImageSharp {
              gatsbyImageData(
                width: 600
                layout: CONSTRAINED
                placeholder: BLURRED
              )
            }
          }
          description
          platforms {
            name
            url
          }
          sources {
            name
            url
          }
        }
      }
    }
  }
`
// Step 2: Define your component
const IndexPage = ({ data }) => {
  return (
    <main>
      <Layout pageTitle="Games" key={IndexPage}>
        <p>
          "Wortest game in the World. No, in All Galaxy.
          Now tell me cheat, this game impossible complete without death."
        </p>
        <p>
          "If you can't jump, what's the point?"
        </p>
        {data.allGamesJson.edges.map(({node}) => {
          return (
            <Game data={node} key={node.id} />
          )
        })}
      </Layout>
    </main>
  )
}

// You'll learn about this in the next task, just copy it for now
export const Head = () => <Seo title="Games" />

// Step 3: Export your component
export default IndexPage;