import * as React from 'react';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import { graphql, useStaticQuery } from 'gatsby';
import {
    gameContainer,
    gameTitle,
    gameDescription,
    gamePlatformList,
    gamePlatformElement,
    gameBannerImage,
    gamePlatformImage
} from './game.module.scss';

function Game({ data }) {
    const bannerImage = getImage(data.banner);
    const platforms = data.platforms || [];
    const sources = data.sources || [];

    const imageData = useStaticQuery(graphql`
        query {
            kongregate: file(relativePath: { eq: "game/platform/kongregate.png" }) {
                childImageSharp {
                    gatsbyImageData(
                        width: 24
                    )
                }
            }
            newgrounds: file(relativePath: { eq: "game/platform/newgrounds.png" }) {
                childImageSharp {
                    gatsbyImageData(
                        width: 24
                    )
                }
            }
            gamejolt: file(relativePath: { eq: "game/platform/gamejolt.png" }) {
                childImageSharp {
                    gatsbyImageData(
                        width: 24
                    )
                }
            }
            js13k: file(relativePath: { eq: "game/platform/js13k.png" }) {
                childImageSharp {
                    gatsbyImageData(
                        width: 24
                    )
                }
            }
            itchio: file(relativePath: { eq: "game/platform/itchio.png" }) {
                childImageSharp {
                    gatsbyImageData(
                        width: 24
                    )
                }
            },
            github: file(relativePath: { eq: "game/platform/github.png" }) {
                childImageSharp {
                    gatsbyImageData(
                        width: 24
                    )
                }
            },
            bitbucket: file(relativePath: { eq: "game/platform/bitbucket.png" }) {
                childImageSharp {
                    gatsbyImageData(
                        width: 24
                    )
                }
            },
            floriaen: file(relativePath: { eq: "game/platform/floriaen.png" }) {
                childImageSharp {
                    gatsbyImageData(
                        width: 24
                    )
                }
            }
        }
    `);

    const platformImages = {
        kongregate: getImage(imageData.kongregate.childImageSharp.gatsbyImageData),
        newgrounds: getImage(imageData.newgrounds.childImageSharp.gatsbyImageData),
        gamejolt: getImage(imageData.gamejolt.childImageSharp.gatsbyImageData),
        js13k : getImage(imageData.js13k.childImageSharp.gatsbyImageData),
        itchio: getImage(imageData.itchio.childImageSharp.gatsbyImageData),
        github: getImage(imageData.github.childImageSharp.gatsbyImageData),
        bitbucket: getImage(imageData.bitbucket.childImageSharp.gatsbyImageData),
        floriaen: getImage(imageData.floriaen.childImageSharp.gatsbyImageData)
    };

    return (
        <div className={gameContainer}>
            <div>
                <div className={gameTitle}>{data.name}</div>
                <div className={gameDescription} dangerouslySetInnerHTML={{ __html: data.description }}></div>
                {
                    data.url && 
                    <a href={data.url} target="_blank" rel="noreferrer">
                        <GatsbyImage className={gameBannerImage} image={bannerImage} alt={data.name} />
                    </a>
                }
                {
                    !data.url && 
                    <GatsbyImage className={gameBannerImage} image={bannerImage} alt={data.name} />
                }
            </div>
            <ul className={gamePlatformList}>
                
                {platforms.map((platform) => {
                    const imageSrc = platformImages[platform.name];
                    return (
                        <li className={gamePlatformElement} key={data.name + platform.name}>
                            <a href={platform.url} target="_blank" rel="noreferrer">
                                <GatsbyImage className={gamePlatformImage} image={imageSrc} alt={platform.name} />
                            </a>
                        </li>
                    )                    
                })}
                
                {sources.map((source) => {
                    const imageSrc = platformImages[source.name];
                    return (
                        <li className={gamePlatformElement} key={data.name + source.name}>
                            <a href={source.url} target="_blank" rel="noreferrer">
                                <GatsbyImage className={gamePlatformImage} image={imageSrc} alt={source.name} />
                            </a>
                        </li>
                    )                    
                })}
            </ul>
        </div>
    )
}
export default Game