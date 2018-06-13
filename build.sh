#!/bin/sh
cd $TRAVIS_BUILD_DIR/web
yarn install
yarn lint
