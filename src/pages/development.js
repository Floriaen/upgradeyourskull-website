
import React from 'react';
import Layout from '../components/layout'

const Development = () => {
    return (
        <div>
            <Layout pageTitle="Development">
                <ul>
                    <li>
                        <a href="/brokenheart" target="_blank" rel="noreferrer">
                            2012 #js1k entry - Find the color of Love
                        </a>
                    </li>
                    <li>
                        <a href="https://js1k.com/2013-spring/demo/1379" target="_blank" rel="noreferrer">
                            2013 #js1k entry - Sunflower
                        </a>
                    </li>
                    <li>
                        <a href="/pixelbutton" target="_blank" rel="noreferrer">
                            PixelButton
                        </a>
                    </li>
                    <li>
                        <a href="/xcode4" target="_blank" rel="noreferrer">
                            Xcode 4 portage of the TextMate Theme by Zachary Johnson
                        </a>
                    </li>
                    <li>
                        <a href="/wait" target="_blank" rel="noreferrer">
                            Wait...
                        </a>
                    </li>
                </ul>
            </Layout>
        </div>
    );
};

export const Head = () => <title>Development</title>

export default Development;
