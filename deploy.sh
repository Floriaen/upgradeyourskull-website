#!/bin/bash
echo 'Building assets...'
yarn build
echo 'Synchronizing assets with server...'
rsync -az --force --delete --progress public/ floriaen@213.165.72.64:/var/www/upgradeyourskull

# next step https://mxd.codes/articles/how-to-deploy-your-gatsby-site-on-your-own-server