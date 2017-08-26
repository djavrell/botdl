#! /usr/bin/node
'use strict'

const botdl = require('../index').main;

main()
  .catch((err) => console.err(err));