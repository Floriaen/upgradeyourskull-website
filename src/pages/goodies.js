
import React from 'react';
import Layout from '../components/layout'

const Goodies = () => {
    return (
        <div>
            <Layout pageTitle="Goodies">
                <ul>
                    <li>
                        <a href="/weareanonymous" target="_blank" rel="noreferrer">
                            We are Anonymous
                        </a>
                    </li>
                    <li>
                        <a href="/chagevara" target="_blank" rel="noreferrer">
                            Chagevara
                        </a>
                    </li>
                </ul>          
            </Layout>
        </div>
    );
};

export const Head = () => <title>Goodies</title>

export default Goodies;
