import * as React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import {
    platformsList,
    platformsElement,
    platformImage
} from './platforms.module.scss';

const Platforms = ({ pageTitle, children }) => {
    const platformImages = useStaticQuery(graphql`
        query {
            kongregate: file(relativePath: { eq: "game/platform/kongregate.png" }) {
                childImageSharp {
                    gatsbyImageData(
                        width: 48
                    )
                }
            }
            newgrounds: file(relativePath: { eq: "game/platform/newgrounds.png" }) {
                childImageSharp {
                    gatsbyImageData(
                        width: 48
                    )
                }
            }
            gamejolt: file(relativePath: { eq: "game/platform/gamejolt.png" }) {
                childImageSharp {
                    gatsbyImageData(
                        width: 48
                    )
                }
            }
            github: file(relativePath: { eq: "game/platform/github.png" }) {
                childImageSharp {
                    gatsbyImageData(
                        width: 48
                    )
                }
            },
            bitbucket: file(relativePath: { eq: "game/platform/bitbucket.png" }) {
                childImageSharp {
                    gatsbyImageData(
                        width: 48
                    )
                }
            },
            x: file(relativePath: { eq: "game/platform/x.png" }) {
            childImageSharp {
                    gatsbyImageData(
                        width: 48
                    )
                }
            },
            instagram: file(relativePath: { eq: "game/platform/instagram.png" }) {
                childImageSharp {
                    gatsbyImageData(
                        width: 48
                    )
                }
            }
        }
  `)

    const kongregate = getImage(platformImages.kongregate.childImageSharp.gatsbyImageData);
    const newgrounds = getImage(platformImages.newgrounds.childImageSharp.gatsbyImageData);
    const gamejolt = getImage(platformImages.gamejolt.childImageSharp.gatsbyImageData);
    const github = getImage(platformImages.github.childImageSharp.gatsbyImageData);
    const bitbucket = getImage(platformImages.bitbucket.childImageSharp.gatsbyImageData);
    const x = getImage(platformImages.x.childImageSharp.gatsbyImageData);
    const instagram = getImage(platformImages.instagram.childImageSharp.gatsbyImageData);

    return (
        <ul className={platformsList}>
            <li className={platformsElement} key={1}>
                <a href="https://www.kongregate.com/games/Floriaen" target="_blank" rel="noreferrer">
                    <GatsbyImage className={platformImage} image={kongregate} alt="Kongregate" />
                </a>
            </li>
            <li className={platformsElement} key={2}>
                <a href="https://floriaen.newgrounds.com/games" target="_blank" rel="noreferrer">
                    <GatsbyImage className={platformImage} image={newgrounds} alt="Newgrounds" />
                </a>
            </li>
            <li className={platformsElement} key={3}>
                <a href="https://gamejolt.com/@Floriaen/games" target="_blank" rel="noreferrer">
                    <GatsbyImage className={platformImage} image={gamejolt} alt="Gamejolt" />
                </a>
            </li>
            <li className={platformsElement} key={4}>
                <a href="https://github.com/Floriaen" target="_blank" rel="noreferrer">
                    <GatsbyImage className={platformImage} image={github} alt="Github" />
                </a>
            </li>
            <li className={platformsElement} key={5}>
                <a href="https://bitbucket.org/Floriaen" target="_blank" rel="noreferrer">
                    <GatsbyImage className={platformImage} image={bitbucket} alt="Bitbucket" />
                </a>
            </li>
            <li className={platformsElement} key={6}>
                <a href="https://x.com/floriaen" target="_blank" rel="noreferrer">
                    <GatsbyImage className={platformImage} image={x} alt="X" />
                </a>
            </li>
            <li className={platformsElement} key={7}>
                <a href="https://www.instagram.com/floriaen/" target="_blank" rel="noreferrer">
                    <GatsbyImage className={platformImage} image={instagram} alt="Instagram" />
                </a>
            </li>
        </ul>
    )
}

export default Platforms